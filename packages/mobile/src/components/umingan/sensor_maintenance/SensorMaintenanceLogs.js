import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
import { ContainerStyle } from '../../../styles/container_style';
import { LabelStyle } from '../../../styles/label_style';
import { ButtonStyle } from '../../../styles/button_style';
import { UmiSensorMaintenance } from '@dynaslope/commons';
import { DataTable } from 'react-native-paper';
import Forms from '../../utils/Forms';
import moment from 'moment';
import MobileCaching from '../../../utils/MobileCaching';
import NetworkUtils from '../../../utils/NetworkUtils';

function SensorMaintenanceLogs() {

    const [openModal, setOpenModal] = useState(false);
    const [sensorMaitenanceLogs, setSensorMaintenanceLogs] = useState([]);
    const [dataTableContent, setDataTableContent] = useState([]);
    const [selectedData, setSelectedData] = useState({});
    const [cmd, setCmd] = useState('add');
    const [selectedDate, setSelectedDate] = useState('');
    const [defaultStrValues, setDefaultStrValues] = useState({});

    const [page, setPage] = useState(0);
    const [pages, setPages] = useState(0);

    const default_fields = {
        'Timestamp': '',
        'Remarks': '',
        'Working Nodes': '',
        'Anomalous Nodes': '',
        'Rain Gauge Status': ''
    }

    let formData = useRef();
    
    useEffect(()=> {
        setTimeout( async ()=> {
            const isConnected = await NetworkUtils.isNetworkAvailable()
            if (isConnected != true) {
                MobileCaching.getItem('UmiSensorMaintenanceLogs').then(response => {
                    init(response);
                    setSensorMaintenanceLogs(response);
                });
            } else {
                fetchLatestData();
            }
          },100);
    },[]);

    const init = async (data) => {
        let temp_pages = parseInt(data.length / 10)

        if ((data.length % 10) != 0) {
            temp_pages = temp_pages+1;
        }

        setSensorMaintenanceLogs(data);
        setDefaultStrValues(default_fields);
        setPages(temp_pages);
        constructDtBody(data, 0)
    };

    const fetchLatestData = async () => {
        let response = await UmiSensorMaintenance.GetSensorMaintenanceLogs();
        if (response.status == true) {
            init(response.data);
            // setDataTableContent([]);
            MobileCaching.setItem('UmiSensorMaintenanceLogs', response.data);
        } else {
            ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
        }
    };

    const constructDtBody = (data, dt_row) => {
        let sensor_maintenance_rows = data.slice(dt_row, dt_row+10);
        let temp = [];
        sensor_maintenance_rows.forEach((row, index) => {
            temp.push(
                <DataTable.Row key={index} onPress={() => { modifySummary(row) }}>
                    <DataTable.Cell style={{width: 150}}>{row.timestamp}</DataTable.Cell>
                    <DataTable.Cell style={{width: 150}}>{row.remarks}</DataTable.Cell>
                    <DataTable.Cell style={{width: 150}}>{row.working_nodes}</DataTable.Cell>
                    <DataTable.Cell style={{width: 150}}>{row.anomalous_nodes}</DataTable.Cell>
                    <DataTable.Cell style={{width: 150}}>{row.rain_gauge_status}</DataTable.Cell>
                </DataTable.Row>
            );
        });
        setDataTableContent(temp);
      }

    const onPageChange = (raw_page) => {
        setPage(raw_page);
        constructDtBody(surficialData, raw_page * 10);
    }

    const showForm = () => {
        setOpenModal(true);
    }

    const closeForm = () => {
        setOpenModal(false);
    }

    const modifySummary = (data) => {
        setSelectedData(data)
        setDefaultStrValues({
            'Timestamp': data['timestamp'],
            'Remarks': data['remarks'],
            'Working Nodes': data['working_nodes'].toString(),
            'Anomalous Nodes': data['anomalous_nodes'].toString(),
            'Rain Gauge Status': data['rain_gauge_status']
        })
        setCmd('update');
        showForm();
    }

    const submitForm = async () => {
        let data = formData.current;
        if (!Object.keys(selectedData).length) {
            MobileCaching.getItem('user_credentials').then(credentials => {
                setTimeout(async () => {
                    const isConnected = await NetworkUtils.isNetworkAvailable();
                    let response = null;

                    if (isConnected != true) {
                        let cached = await MobileCaching.getItem("UmiSurficialData").then(cached_data => {
                            let surficial_obj = {};

                            surficial_obj[temp['ts']] = {
                                ...temp['marker_value'],
                                'observer': temp['observer'],
                                'weather': temp['weather'],
                                'ts': temp['ts'],
                                'alterations': 'add'
                            }

                            cached_data.push(surficial_obj);

                            try {
                                MobileCaching.setItem("MarSurficialData", cached_data);
                                // OPEN MESSAGING APP TO SEND MANUALLY
                                response = {
                                    "status": true,
                                    "message": "Surficial Data is temporarily saved in the memory.\nPlease connect to the internet and sync your data."
                                }
                            } catch (err) {
                                response = {
                                    "status": false,
                                    "message": "Surficial Data failed to save data to memory."
                                }
                            }
                            MobileCaching.getItem('MarSurficialDataMarkers').then(markers => {
                                init(cached_data, markers);
                            });
                            return response;
                        });
                    } else {
                        response = await UmiSensorMaintenance.InsertSensorMaintenanceLogs({
                            timestamp: data['Timestamp'],
                            remarks: data['Remarks'],
                            working_nodes: data['WorkingNodes'],
                            anomalous_nodes: data['AnomalousNodes'],
                            rain_gauge_status: data['RainGaugeStatus']
                        });
                        fetchLatestData();
                    }

                    if (response.status == true) {
                        ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
                        closeForm();
                    } else {
                        ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
                    }
                }, 300);
            });
        } else {
            if (!Object.keys(selectedData).length) {
                ToastAndroid.showWithGravity('No changes has been made.', ToastAndroid.LONG, ToastAndroid.CENTER)
                closeForm();
            } else {
                MobileCaching.getItem('user_credentials').then(credentials => {
                    setTimeout(async () => {
                        const isConnected = await NetworkUtils.isNetworkAvailable();
                        let response = {};
                        let obj_temp = {...selectedData};
                        Object.keys(data).forEach(key => {
                            switch(key) {
                                case 'Remarks':
                                    obj_temp = {
                                        ...obj_temp,
                                        remarks: data['Remarks']
                                    }
                                    break;
                                case 'Timestamp':
                                    obj_temp = {
                                        ...obj_temp,
                                        timestamp: data['Timestamp']
                                    }
                                    break;
                                case 'WorkingNodes':
                                    obj_temp = {
                                        ...obj_temp,
                                        working_nodes: data['WorkingNodes']
                                    }
                                    break;
                                case 'RainGaugeStatus':
                                    obj_temp = {
                                        ...obj_temp,
                                        rain_gauge_status: data['RainGaugeStatus']
                                    }
                                    break;
                                case 'AnomalousNodes':
                                    obj_temp = {
                                        ...obj_temp,
                                        anomalous_nodes: data['AnomalousNodes']
                                    }
                                    break;
                                case 'attachment':
                                    console.log('Attachment not availble for ground data');
                                    break;
                                default:
                                    console.log("All set")
                                    break;
                            }
                        });

                        if (isConnected != true) {
                            let temp_data = await MobileCaching.getItem("UmiSensorMaintenanceLogs").then(cached_data => {
                                let temp_proc = {}

                                let index = cached_data.findIndex(x=> x[obj_temp['id']].id == obj_temp['id']);
                                temp_proc[obj_temp['id']] = obj_temp;
                                cached_data[index] = temp_proc

                                try {
                                    MobileCaching.setItem("UmiSensorMaintenanceLogs", cached_data);
                                    response = {
                                        "status": true,
                                        "message": "Sensor Maintenance Logs is temporarily saved in the memory.\nPlease connect to the internet and sync your data."
                                    }
                                } catch (err) {
                                    response = {
                                        "status": false,
                                        "message": "Sensor Maintenance Logs failed to save data to memory."
                                    }
                                }
                                MobileCaching.getItem('UmiSurficialDataMarkers').then(markers => {
                                    init(cached_data, markers);
                                });
                                return response
                            });
                        } else {
                            response = await UmiSensorMaintenance.UpdateSensorMaintenanceLogs(obj_temp);
                            if (response.status == true) {
                                fetchLatestData();
                            }
                        }

                        closeForm();
                        setCmd('add');
                        ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
                    }, 300);
                });
            }
        }
    }

    const deleteForm = () => {
        Alert.alert(
            "Sensor Maintenance Logs",
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
                        ToastAndroid.showWithGravity("Cannot delete data when offline.\nPlease connect to internet or CBEWS-L Network to proceed.", ToastAndroid.LONG, ToastAndroid.CENTER)
                    } else {
                        // let response = await UmiGroundData.DeleteSurficialMarkersData({
                        //     "observer": selectedData['observer'],
                        //     "site_id": "50",
                        //     "ts": selectedData['ts'],
                        //     "weather": selectedData['weather']
                        //  })

                        // if (response.status == true) {
                        //     ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
                        //     fetchLatestData();
                        //     closeForm();
                        // } else {
                        //     ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
                        // }
                    }
                },300)
              }}
            ],
            { cancelable: false }
        );
    }

    return(
        <ScrollView>
            <View style={ContainerStyle.content}>
                <Text style={[LabelStyle.large_label, LabelStyle.brand]}>Sensor Maintenance Logs</Text>
                <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Add / Update / Delete Maintenance logs</Text>
                <View style={ContainerStyle.datatable_content}>
                    <ScrollView horizontal={true}>
                        <DataTable style={{ flex: 1, padding: 10}}>
                            <DataTable.Header>
                                <DataTable.Title style={{width: 150}}>Timestamp</DataTable.Title>
                                <DataTable.Title style={{width: 150}}>Remarks</DataTable.Title>
                                <DataTable.Title style={{width: 150}}>Working Nodes</DataTable.Title>
                                <DataTable.Title style={{width: 150}}>Anomalous Nodes</DataTable.Title>
                                <DataTable.Title style={{width: 150}}>Rain Gauge Status</DataTable.Title>
                            </DataTable.Header>
                            { dataTableContent }
                        </DataTable>
                    </ScrollView>
                    <DataTable.Pagination
                        page={page}
                        numberOfPages={pages}
                        onPageChange={(page) => { onPageChange(page); }}
                        label={`Page ${page} of ${pages-1}`}
                    />
                </View>
                <View>
                    <Text style={[LabelStyle.small_label, LabelStyle.brand]}>* Click row to modify.</Text>
                </View>
                <View style={{flex: 1, alignItems: 'center', padding: 10}}>
                    <TouchableOpacity style={ButtonStyle.medium} onPress={() => { showForm() }}>
                        <Text style={ButtonStyle.large_text}>Add +</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Modal animationType="slide"
                visible={openModal}
                onRequestClose={() => { 
                    setDefaultStrValues(defaultStrValues)
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
    )
}

export default SensorMaintenanceLogs