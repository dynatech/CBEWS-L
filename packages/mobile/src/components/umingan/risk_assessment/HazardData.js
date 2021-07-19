import React, { useState, useRef, useEffect } from 'react';
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

const numberOfItemsPerPageList = [2, 3, 4];

const items = [
  {
    key: 1,
    name: 'Page 1',
  },
  {
    key: 2,
    name: 'Page 2',
  },
  {
    key: 3,
    name: 'Page 3',
  },
];

function HazardData() {

    const [openModal, setOpenModal] = useState(false);
    const [dataTableContent, setDataTableContent] = useState([]);
    const [selectedData, setSelectedData] = useState({});
    const [hazardDataContainer, setHazardDataContainer] = useState([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const [cmd, setCmd] = useState('add');
    const isFocused = useIsFocused();

    const [defaultStrValues, setDefaultStrValues] = useState({
        'Hazard': '',
        'Speed of Onset': '',
        'Early Warning': '',
        'Impact': ''
    });

    // Datatable pagination
    const [page, setPage] = React.useState(0);
    const [numberOfItemsPerPage, onItemsPerPageChange] = React.useState(numberOfItemsPerPageList[0]);
    const from = page * numberOfItemsPerPage;
    const to = Math.min((page + 1) * numberOfItemsPerPage, items.length);
    React.useEffect(() => {
        setPage(0);
     }, [numberOfItemsPerPage]);
    

    let formData = useRef();
    const resetForm = () => {
        setDefaultStrValues({
            'Hazard': '',
            'Speed of Onset': '',
            'Early Warning': '',
            'Impact': ''
        });
        setSelectedData({});
    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchLatestData().then(() => setRefreshing(false));
    }, []);

    useEffect(() => {
        if(isFocused){
            setTimeout( async ()=> {
                const isConnected = await NetworkUtils.isNetworkAvailable()
                if (isConnected != true) {
                    MobileCaching.getItem('UmiHazardData').then(response => {
                        init(response);
                        setHazardDataContainer(response);
                    });
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
                            <DataTable.Cell>{element.hazard}</DataTable.Cell>
                            <DataTable.Cell>{element.speed_of_onset}</DataTable.Cell>
                            <DataTable.Cell>{element.early_warning}</DataTable.Cell>
                            <DataTable.Cell>{element.impact}</DataTable.Cell>
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
        let response = await UmiRiskManagement.GetAllHazardData()
        if (response.status == true) {
            init(response.data);
            setHazardDataContainer(response.data);
            MobileCaching.setItem('UmiHazardData', response.data);
        } else {
            ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
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
                setTimeout(async () => {
                    const isConnected = await NetworkUtils.isNetworkAvailable();
                    let response = null;
                    if (isConnected != true) {
                        let temp = await MobileCaching.getItem("UmiHazardData").then(cached_data => {
                            cached_data.push({
                                'early_warning': data[''],
                                'hazard': data[''],
                                'id': 0,
                                'impact': data[''],
                                'last_ts': null,
                                'speed_of_onset': data[''],
                                'user_id': credentials['user_id'],
                                'alterations': 'add'
                            });
                            try {
                                MobileCaching.setItem("UmiHazardData", cached_data);
                                response = {
                                    "status": true,
                                    "message": "Hazard Data is temporarily saved in the memory.\nPlease connect to the internet and sync your data."
                                }
                            } catch (err) {
                                response = {
                                    "status": false,
                                    "message": "Hazard Data failed to save data to memory."
                                }
                            }
                            setHazardDataContainer(cached_data);
                            init(cached_data);
                            return response;
                        });
                    } else {
                        data['user_id'] = credentials['user_id']
                        response = await UmiRiskManagement.InsertHazardData(data)
                    }

                    if (response.status == true) {
                        ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
                    } else {
                        ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
                    }
                    closeForm();
                    resetForm();
                    setCmd('add');
                    fetchLatestData();
                }, 300);
            });
        } else {
            if (!Object.keys(selectedData).length) {
                ToastAndroid.showWithGravity('No changes has been made.', ToastAndroid.LONG, ToastAndroid.CENTER)
                closeForm();
            } else {
                MobileCaching.getItem('user_credentials').then(credentials => {
                    setTimeout(async () => {
                        let temp_array = []
                        Object.keys(data).forEach(key => {
                            let temp = {};
                            switch(key) {
                                case 'SpeedofOnset':
                                    temp["speed_of_onset"] = data[key]
                                    break;
                                case 'EarlyWarning':
                                    temp["early_warning"] = data[key]
                                    break;
                                default:
                                    temp[key.replace(" ","_").toLocaleLowerCase()] = data[key]
                                    break;
                            }

                            if (key != 'attachment') {
                                temp_array.push(temp);
                            }
                        });
                        temp_array.push({'user_id': credentials['user_id']})
                        temp_array.push({'id': selectedData['id']})

                        const isConnected = await NetworkUtils.isNetworkAvailable();
                        let response = null;
                        if (isConnected != true) {
                            let temp = await MobileCaching.getItem("UmiHazardData").then(cached_data => {
                                let state_contaner = selectedData;
                                temp_array.forEach(element => {
                                    let key = Object.keys(element)[0];
                                    state_contaner[key] = element[key];
                                });
                                state_contaner['alterations'] = "update";
                                let index = cached_data.findIndex(x => x.id == selectedData['id']);
                                cached_data[index] = state_contaner;
                                try {
                                    MobileCaching.setItem("UmiHazardData", cached_data);
                                    response = {
                                        "status": true,
                                        "message": "Hazard data is temporarily saved in the memory.\nPlease connect to the internet and sync your data."
                                    }
                                } catch (err) {
                                    response = {
                                        "status": false,
                                        "message": "Hazard data failed to save data to memory."
                                    }
                                }
                                init(cached_data);
                                return response;
                            });
                        } else {
                            response = await UmiRiskManagement.UpdateHazardData(temp_array)
                            if (response.status == true) {
                                ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
                            } else {
                                ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
                            }
                        }
                        closeForm();
                        resetForm();
                        setCmd('add');
                        fetchLatestData();
                    }, 300);
                });
            }
        }
    }

    const modifySummary = (data) => {
        setSelectedData(data)
        setDefaultStrValues({
            'Hazard': data['hazard'],
            'Speed of Onset': data['speed_of_onset'],
            'Early Warning': data['early_warning'],
            'Impact': data['impact']
        })
        setCmd('update')
        showForm();
    }

    const deleteForm = () => {
        Alert.alert(
            "Risk Assessment Hazard Data",
            "Are you sure you want to delete this data?",
            [
              {
                text: "Cancel",
                style: "cancel"
              },
              { text: "Confirm", onPress: () => {
                setTimeout(async ()=> {
                    let response = await UmiRiskManagement.DeleteHazardData({
                        'id': selectedData['id']
                    })
                    if (response.status == true) {
                        ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
                    } else {
                        ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
                    }
                    closeForm();
                    resetForm();
                    setCmd('add');
                    fetchLatestData();    
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
                <Text style={[LabelStyle.large_label, LabelStyle.brand]}>Hazard Data</Text>
                <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Hazard Reports / Logs</Text>
                <View style={ContainerStyle.datatable_content}>
                    <DataTable style={{ flex: 1, padding: 10, textAlign: 'center' }}>
                        <DataTable.Header>
                            <DataTable.Title>Hazard</DataTable.Title>
                            <DataTable.Title>Speed of Onset</DataTable.Title>
                            <DataTable.Title>Early Warning</DataTable.Title>
                            <DataTable.Title>Impact</DataTable.Title>
                        </DataTable.Header>
                        { dataTableContent }
                    </DataTable>
                    <DataTable.Pagination
                        page={page}
                        numberOfPages={Math.ceil(items.length / numberOfItemsPerPage)}
                        onPageChange={page => setPage(page)}
                        label={`${from + 1}-${to} of ${items.length}`}
                        showFastPaginationControls
                        numberOfItemsPerPageList={numberOfItemsPerPageList}
                        numberOfItemsPerPage={numberOfItemsPerPage}
                        onItemsPerPageChange={onItemsPerPageChange}
                        selectPageDropdownLabel={'Rows per page'}
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
                        'Hazard': '',
                        'Speed of Onset': '',
                        'Early Warning': '',
                        'Impact': ''
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

export default HazardData;