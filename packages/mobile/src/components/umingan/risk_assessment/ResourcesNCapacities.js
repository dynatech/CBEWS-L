import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, ToastAndroid, Alert, BackHandler, RefreshControl, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { DataTable } from 'react-native-paper';
import { ContainerStyle } from '../../../styles/container_style';
import { LabelStyle } from '../../../styles/label_style';
import { ButtonStyle } from '../../../styles/button_style';
import { UmiRiskManagement } from '@dynaslope/commons';
import Forms from '../../utils/Forms';
import MobileCaching from '../../../utils/MobileCaching';
import NetworkUtils from '../../../utils/NetworkUtils';
import { useIsFocused } from '@react-navigation/native';

function ResourcesNCapacities(props) {
    const navigator = props.navigation;

    const [openModal, setOpenModal] = useState(false);
    const [dataTableContent, setDataTableContent] = useState([]);
    const [selectedData, setSelectedData] = useState({});
    const [resourceAndCapacitiesContainer, setResourceAndCapacitiesContainer] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [cmd, setCmd] = useState('add');
    const isFocused = useIsFocused();

    const [defaultStrValues, setDefaultStrValues] = useState({
        'Resource and Capacities': '',
        'Status': '',
        'Owner': ''
    });

    let formData = useRef();

    const resetForm = () => {
        setDefaultStrValues({
            'Resource and Capacities': '',
            'Status': '',
            'Owner': ''
        });
        setSelectedData({});
    }

    // useFocusEffect(
    //     useCallback(() => {
    //         const onBackPress = () => {
    //             navigator.jumpTo('UminganDashboard');
    //         };
      
    //         BackHandler.addEventListener('hardwareBackPress', onBackPress);
      
    //         return () =>
    //           BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    //     }, [])
    // );

    // Initialize Resources and Capacities data: Get from cache or fetch from server
    const initResNCapacities = async () => {
        const isConnected = await NetworkUtils.isNetworkAvailable()
        if (isConnected != true) {
            MobileCaching.getItem('UmiResourceAndCapacities').then(response => {
                init(response);
                setResourceAndCapacitiesContainer(response);
            });
        } else {
            fetchLatestData();
        }
    }

    // Refresh Resources and Capacities on pull down
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        initResNCapacities().then(() => setRefreshing(false));
    }, []);

    // Fetch Resources and Capacities on initial tab load
    useEffect(() => {
        initResNCapacities();
    }, [])

    // Fetch Resources and Capacities on next succeeding tab loads
    useEffect(() => {
        if(isFocused){
            initResNCapacities();
        }
    }, [isFocused])

    const init = async (data) => {
        let temp = [];
        if (data == undefined) {
            temp.push(
                <View key={0}>
                    <Text style={{ textAlign: 'center' }}>No local data available.</Text>
                </View>
            )
        } else {
            if (data.length != 0) {
                let row = data;
                row.forEach(element => {
                    temp.push(
                        <DataTable.Row key={element.id} onPress={() => { modifySummary(element) }}>
                            <DataTable.Cell>{element.resource_and_capacities}</DataTable.Cell>
                            <DataTable.Cell>{element.status}</DataTable.Cell>
                            <DataTable.Cell>{element.owner}</DataTable.Cell>
                        </DataTable.Row>
                    )
                });
            } else {
                temp.push(
                    <View key={0}>
                        <Text style={{ textAlign: 'center' }}>No available data.</Text>
                    </View>
                )
            }
        }
        setDataTableContent(temp)
    }

    const fetchLatestData = async () => {
        let response = await UmiRiskManagement.GetAllResourceAndCapacities()
        if (response.status == true) {
            init(response.data);
            setResourceAndCapacitiesContainer(response.data);
            MobileCaching.setItem('UmiResourceAndCapacities', response.data);
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
                setTimeout(async () => {
                    const isConnected = await NetworkUtils.isNetworkAvailable();
                    let response = null;
                    if (isConnected != true) {
                        let temp = await MobileCaching.getItem("UmiResourceAndCapacities").then(cached_data => {
                            cached_data.push({
                                'id': 0,
                                'last_ts': null,
                                'owner': data['Owner'],
                                'resource_and_capacities': data['ResourceandCapacities'],
                                'status': data['Status'],
                                'user_id': credentials['user_id'],
                                'alterations': 'add'
                            });
                            try {
                                MobileCaching.setItem("UmiResourceAndCapacities", cached_data);
                                response = {
                                    "status": true,
                                    "message": "Resources and Capacities is temporarily saved in the memory.\nPlease connect to the internet and sync your data."
                                }
                            } catch (err) {
                                response = {
                                    "status": false,
                                    "message": "Resource and capacity failed to save data to memory."
                                }
                            }
                            setResourceAndCapacitiesContainer(cached_data);
                            init(cached_data);
                            return response;
                        });
                    } else {
                        data['user_id'] = credentials['user_id']
                        response = await UmiRiskManagement.InsertResourceAndCapacities(data)
                        fetchLatestData()
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
                }, 300);
            });
        } else {
            if (!Object.keys(selectedData).length) {
                ToastAndroid.showWithGravity('No changes has been made.', ToastAndroid.SHORT, ToastAndroid.CENTER)
                closeForm();
                resetForm();
            } else {
                MobileCaching.getItem('user_credentials').then(credentials => {
                    setTimeout(async () => {
                        let response = {};
                        let temp_array = [];
                        Object.keys(data).forEach(key => {
                            let temp = {};
                            switch(key) {
                                case 'ResourceandCapacities':
                                    temp["resource_and_capacities"] = data[key]
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
                        if (isConnected != true) {
                            let temp = await MobileCaching.getItem("UmiResourceAndCapacities").then(cached_data => {
                                let state_contaner = selectedData;
                                temp_array.forEach(element => {
                                    let key = Object.keys(element)[0];
                                    state_contaner[key] = element[key];
                                });
                                state_contaner['alterations'] = "update";
                                let index = cached_data.findIndex(x => x.id == selectedData['id']);
                                cached_data[index] = state_contaner;
                                try {
                                    MobileCaching.setItem("UmiResourceAndCapacities", cached_data);
                                    response = {
                                        "status": true,
                                        "message": "Resources and Capacities is temporarily saved in the memory.\nPlease connect to the internet and sync your data."
                                    }
                                } catch (err) {
                                    response = {
                                        "status": false,
                                        "message": "Resources and Capacities failed to save data to memory."
                                    }
                                }
                                init(cached_data);
                                return response;
                            });
                        } else {
                            response = await UmiRiskManagement.UpdateResourceAndCapacities(temp_array)
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
            'Resource and Capacities': data['resource_and_capacities'],
            'Status': data['status'],
            'owner': data['owner']
        })
        setCmd('update')
        showForm();
    }

    const deleteForm = () => {
        Alert.alert(
            "Risk Assessment Resources and Capacities",
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
                        let response = await UmiRiskManagement.DeleteResourceAndCapacities({
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
                <Text style={[LabelStyle.large_label, LabelStyle.brand]}>Resources and Capacities</Text>
                <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Resources Logs / Inventory</Text>
                <View style={ContainerStyle.datatable_content}>
                    <DataTable style={{ flex: 1, padding: 10, textAlign: 'center' }}>
                        <DataTable.Header>
                            <DataTable.Title>Resource / Capacity</DataTable.Title>
                            <DataTable.Title>Status</DataTable.Title>
                            <DataTable.Title>Owner</DataTable.Title>
                        </DataTable.Header>
                        { dataTableContent }
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
                        'Resource and Capacities': '',
                        'Status': '',
                        'Owner': ''
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

export default ResourcesNCapacities;