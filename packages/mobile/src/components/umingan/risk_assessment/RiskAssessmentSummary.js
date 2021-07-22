import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, ToastAndroid, Alert, RefreshControl, SafeAreaView } from 'react-native';
import { DataTable } from 'react-native-paper';
import { ContainerStyle } from '../../../styles/container_style';
import { LabelStyle } from '../../../styles/label_style';
import { ButtonStyle } from '../../../styles/button_style';
import { UmiRiskManagement } from '@dynaslope/commons';
import Forms from '../../utils/Forms';
import MobileCaching from '../../../utils/MobileCaching';
import NetworkUtils from '../../../utils/NetworkUtils';
import { useIsFocused } from '@react-navigation/native';

function RiskAssessmentSummary(props) {
    const navigator = props.navigation;
    
    const [openModal, setOpenModal] = useState(false);
    const [dataTableContent, setDataTableContent] = useState([]);
    const [selectedData, setSelectedData] = useState({});
    const [riskAssessmentContainer, setRiskAssessmentContainer] = useState([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const [cmd, setCmd] = useState('add');
    const isFocused = useIsFocused();
    const [defaultStrValues, setDefaultStrValues] = useState({
        'Location': '',
        'Impact': '',
        'Adaptive Capacity': '',
        'Vulnerability': ''
    });

    let formData = useRef();

    const resetForm = () => {
        setDefaultStrValues({
            'Location': '',
            'Impact': '',
            'Adaptive Capacity': '',
            'Vulnerability': ''
        });
        setSelectedData({});
    }

    // Refresh summary on pull down
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchLatestData().then(() => setRefreshing(false));
    }, []);

    // Fetch summary on succeeding tab loads
    useEffect(() => {
        if(isFocused){
            setTimeout( async ()=> {
                const isConnected = await NetworkUtils.isNetworkAvailable()
                if (isConnected != true) {
                Alert.alert(
                    'CBEWS-L is not connected to the internet',
                    'CBEWS-L Local data will be used.',
                    [
                    { text: 'Ok', onPress: () => {
                        MobileCaching.getItem('UmiRiskAssessmentSummary').then(response => {
                            init(response);
                            setRiskAssessmentContainer(response);
                        });
                    }, style: 'cancel' },
                    ]
                )
                } else {
                    fetchLatestData();
                }
            },100);
        }
    }, [isFocused])

    const init = async (data) => {
        let temp = [];
        if (data == undefined) {
            temp.push(
                <View key={0}>
                    <Text>No local data available.</Text>
                </View>
            )
        } else {
            if (data.length != 0) {
                let row = data;
                row.forEach(element => {
                    temp.push(
                        <DataTable.Row key={element.id} onPress={() => { modifySummary(element) }}>
                            <DataTable.Cell>{element.location}</DataTable.Cell>
                            <DataTable.Cell>{element.impact}</DataTable.Cell>
                            <DataTable.Cell>{element.adaptive_capacity}</DataTable.Cell>
                            <DataTable.Cell>{element.vulnerability}</DataTable.Cell>
                        </DataTable.Row>
                    )
                });
            } else {
                temp.push(
                    <View key={0}>
                        <Text>No available data.</Text>
                    </View>
                )
            }
        }
        setDataTableContent(temp)
    }

    const fetchLatestData = async () => {
        let response = await UmiRiskManagement.GetAllSummary()
        if (response.status == true) {
            init(response.data);
            setRiskAssessmentContainer(response.data);
            MobileCaching.setItem('UmiRiskAssessmentSummary', response.data);
        } else {
            ToastAndroid.showWithGravity(response.message, ToastAndroid.SHORT, ToastAndroid.CENTER)
        }
    }

    const showForm = () => {
        setOpenModal(true);
    }

    const closeForm = () => {
        setOpenModal(false);
    }

    const submitForm = () => {
        let data = formData.current;
        if (!Object.keys(selectedData).length) {
            MobileCaching.getItem('user_credentials').then(credentials => {
                setTimeout(async()=> {
                    const isConnected = await NetworkUtils.isNetworkAvailable();
                    let response = null;
                    if (isConnected != true) {
                        let temp = await MobileCaching.getItem("UmiRiskAssessmentSummary").then(cached_data => {
                            cached_data.push({
                                'adaptive_capacity': data['AdaptiveCapacity'],
                                'id': 0,
                                'impact': data['Impact'],
                                'last_ts': null,
                                'location': data['Location'],
                                'user_id': credentials['user_id'],
                                'vulnerability': data['Vulnerability'],
                                'alterations': 'add'
                            });
                            try {
                                MobileCaching.setItem("UmiRiskAssessmentSummary", cached_data);
                                response = {
                                    "status": true,
                                    "message": "Risk assessment summary is temporarily saved in the memory.\nPlease connect to the internet and sync your data."
                                }
                            } catch (err) {
                                response = {
                                    "status": false,
                                    "message": "Risk assessment summary failed to save data to memory."
                                }
                            }
                            setRiskAssessmentContainer(cached_data);
                            init(cached_data);
                            return response;
                        });
                    } else {
                        data['user_id'] = credentials['user_id']
                        response = await UmiRiskManagement.InsertSummary(data)
                    }

                    if (response.status == true) {
                        ToastAndroid.showWithGravity(response.message, ToastAndroid.SHORT, ToastAndroid.CENTER)
                        fetchLatestData();
                    } else {
                        ToastAndroid.showWithGravity(response.message, ToastAndroid.SHORT, ToastAndroid.CENTER)
                    }

                    ToastAndroid.showWithGravity(response.message, ToastAndroid.SHORT, ToastAndroid.CENTER)
                    closeForm();
                    resetForm();
                    setCmd('add');
                }, 100)
            });
        } else {
            if (!Object.keys(selectedData).length) {
                ToastAndroid.showWithGravity('No changes has been made.', ToastAndroid.SHORT, ToastAndroid.CENTER)
                closeForm();
                resetForm();
            } else {
                MobileCaching.getItem('user_credentials').then(credentials => {
                    setTimeout(async () => {
                        const isConnected = await NetworkUtils.isNetworkAvailable();
                        let response = null;
                        let temp_array = []
                        Object.keys(data).forEach(key => {
                            let temp = {};
                            if (key == "AdaptiveCapacity") {
                                temp["adaptive_capacity"] = data[key]
                            } else {
                                temp[key.replace(" ","_").toLocaleLowerCase()] = data[key]
                            }

                            if (key != 'attachment') {
                                temp_array.push(temp);
                            }
                        });
                        temp_array.push({'user_id': credentials['user_id']})
                        temp_array.push({'id': selectedData['id']})
                        
                        if (isConnected != true) {
                            let temp = await MobileCaching.getItem("UmiRiskAssessmentSummary").then(cached_data => {
                                let state_contaner = selectedData;
                                temp_array.forEach(element => {
                                    let key = Object.keys(element)[0];
                                    state_contaner[key] = element[key];
                                });
                                state_contaner['alterations'] = "update";
                                let index = cached_data.findIndex(x => x.id == selectedData['id']);
                                cached_data[index] = state_contaner;
                                try {
                                    MobileCaching.setItem("UmiRiskAssessmentSummary", cached_data);
                                    response = {
                                        "status": true,
                                        "message": "Risk assessment summary is temporarily saved in the memory.\nPlease connect to the internet and sync your data."
                                    }
                                } catch (err) {
                                    response = {
                                        "status": false,
                                        "message": "Risk assessment summary failed to save data to memory."
                                    }
                                }
                                init(cached_data);
                                return response;
                            });
                        } else {
                            response = await UmiRiskManagement.UpdateSummary(temp_array)
                            if (response.status == true) {
                                ToastAndroid.showWithGravity(response.message, ToastAndroid.SHORT, ToastAndroid.CENTER)
                                fetchLatestData();
                            } else {
                                ToastAndroid.showWithGravity(response.message, ToastAndroid.SHORT, ToastAndroid.CENTER)
                            }
                        }

                        ToastAndroid.showWithGravity(response.message, ToastAndroid.SHORT, ToastAndroid.CENTER)
                        closeForm();
                        resetForm();
                        setCmd('add');
                    }, 300);
                });
            }
        }
    }

    const modifySummary = (data) => {
        setSelectedData(data)
        setDefaultStrValues({
            'Location': data['location'],
            'Impact': data['impact'],
            'Adaptive Capacity': data['adaptive_capacity'],
            'Vulnerability': data['vulnerability']
        })
        setCmd('update')
        showForm();
    }

    const deleteForm = () => {
        Alert.alert(
            "Risk Assessment Summary",
            "Are you sure you want to delete this data?",
            [
              {
                text: "Cancel",
                style: "cancel"
              },
              { text: "Confirm", onPress: () => {
                setTimeout(async ()=> {
                    const isConnected = await NetworkUtils.isNetworkAvailable();
                    if (isConnected != true) {
                        ToastAndroid.showWithGravity("Cannot delete data when offline.\nPlease connect to internet or CBEWS-L Network to proceed.", ToastAndroid.SHORT, ToastAndroid.CENTER)
                    } else {
                        let response = await UmiRiskManagement.DeleteSummary({
                            'id': selectedData['id']
                        })
                        if (response.status == true) {
                            ToastAndroid.showWithGravity(response.message, ToastAndroid.SHORT, ToastAndroid.CENTER)
                            fetchLatestData();               
                        } else {
                            ToastAndroid.showWithGravity(response.message, ToastAndroid.SHORT, ToastAndroid.CENTER)
                        }
                    }
                    closeForm();
                    resetForm();
                    setCmd('add');
                },300)
              }}
            ],
            { cancelable: false }
        );
    }

    return (
        <SafeAreaView>
            <ScrollView refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
                }
            >
            <View style={ContainerStyle.content}>
                <Text style={[LabelStyle.large_label, LabelStyle.brand]}>Risk Assessment Summary</Text>
                <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Summary of Reports / Logs</Text>
                <View style={ContainerStyle.datatable_content}>
                    <DataTable style={{ flex: 1, padding: 10, textAlign: 'center' }}>
                        <DataTable.Header>
                            <DataTable.Title>Location</DataTable.Title>
                            <DataTable.Title>Impact</DataTable.Title>
                            <DataTable.Title>Adaptive Capacity</DataTable.Title>
                            <DataTable.Title>Vulnerability</DataTable.Title>
                        </DataTable.Header>
                        {dataTableContent}
                    </DataTable>
                    <DataTable.Pagination
                        page={1}
                        numberOfPages={3}
                        onPageChange={(page) => { console.log(page); }}
                        label="1-2 of 6"
                    />
                </View>
                <View>
                    <Text style={[LabelStyle.small_label, LabelStyle.brand]}>* Click row to modify.</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'center', padding: 10 }}>
                    <TouchableOpacity style={ButtonStyle.medium} onPress={() => { showForm(); setCmd('add'); }}>
                        <Text style={ButtonStyle.large_text}>Add +</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Modal animationType="slide"
                visible={openModal}
                onRequestClose={() => { 
                    setDefaultStrValues({
                        'Location': '',
                        'Impact': '',
                        'Adaptive Capacity': '',
                        'Vulnerability': ''
                    })
                    setCmd('add');
                    setOpenModal(false);
                 }}>
                <Forms data={{
                    string: defaultStrValues,
                    int: {}
                }}
                    formData={formData}
                    command={cmd}
                    closeForm={() => { closeForm() }}
                    submitForm={() => { submitForm() }}
                    deleteForm={() => { deleteForm() }} />
            </Modal>
        </ScrollView>
        </SafeAreaView>
    )
}

export default RiskAssessmentSummary;