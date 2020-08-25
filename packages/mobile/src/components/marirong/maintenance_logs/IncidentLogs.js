import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
import { DataTable } from 'react-native-paper';
import { ContainerStyle } from '../../../styles/container_style';
import { LabelStyle } from '../../../styles/label_style';
import { ButtonStyle } from '../../../styles/button_style';
import { MarMaintenanceLogs } from '@dynaslope/commons';
import { Calendar } from 'react-native-calendars';
import Forms from '../../utils/Forms';
import MobileCaching from '../../../utils/MobileCaching';
import NetworkUtils from '../../../utils/NetworkUtils';

function IncidentLogs () {

    const [openModal, setOpenModal] = useState(false);
    const [incidentLogs, setIncidentLogs] = useState([]);
    const [dataTableContent, setDataTableContent] = useState([]);
    const [dataContainer, setDataContainer] = useState([]);
    const [selectedData, setSelectedData] = useState({});
    const [cmd, setCmd] = useState('add');
    const [markedDates, setMarkedDates] = useState({});
    const [selectedDate, setSelectedDate] = useState('');
    const [defaultStrValues, setDefaultStrValues] = useState({
        'Report Narrative': '',
        'Reporter': '',
    });

    let formData = useRef();

    useEffect(() => {
        setTimeout( async ()=> {
            const isConnected = await NetworkUtils.isNetworkAvailable()
            if (isConnected != true) {
                MobileCaching.getItem('MarIncidentLogs').then(response => {
                    init(response);
                });
            } else {
                fetchLatestData();
            }
          },100);
    }, [])

    const fetchLatestData = async () => {
        let response = await MarMaintenanceLogs.GetIncidentLogs()
        if (response.status === true) {
            init(response.data);
            MobileCaching.setItem('MarIncidentLogs', response.data);
        } else {
            ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
        }
    }

    const init = async (data) => {
        let temp = {};
        data.forEach(element => {
            temp[element.incident_date] = {
                selected: true
            }
        });
        setDataContainer([]);
        setIncidentLogs(data);
        setMarkedDates(temp);
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
                let temp = {};
                let response = {};

                setTimeout(async () => {
                    setTimeout(async () => {

                        const isConnected = await NetworkUtils.isNetworkAvailable();

                        temp['user_id'] = credentials['user_id'];
                        temp['incident_date'] = selectedDate;
                        temp['incident_report_narrative'] = data['ReportNarrative'];
                        temp['reporter'] = data['Reporter'];

                        if (isConnected != true) {
                            let cached = await MobileCaching.getItem("MarIncidentLogs").then(cached_data => {
                                temp["alterations"] = "add";
                                cached_data.push(temp);
                                
                                try {
                                    MobileCaching.setItem("MarIncidentLogs", cached_data);
                                    response = {
                                        "status": true,
                                        "message": "Incident Logs is temporarily saved in the memory.\nPlease connect to the internet and sync your data."
                                    }
                                } catch (err) {
                                    response = {
                                        "status": false,
                                        "message": `Incident Logs failed to save data to memory. Err: ${err}`
                                    }
                                }
    
                                if (response.status == true) {
                                    closeForm();
                                    setCmd('add');
                                    init(cached_data);
                                }
    
                                ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
                                return response;
                            });
                        } else {
                            response = await MarMaintenanceLogs.InsertIncidentLogs(temp);
                            if (response.status == true) {
                                fetchLatestData();
                                closeForm();
                            }
                            ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
                        }
                    });
                }, 100);
            });
        } else {
            if (!Object.keys(selectedData).length) {
                ToastAndroid.showWithGravity('No changes has been made.', ToastAndroid.LONG, ToastAndroid.CENTER)
                closeForm();
            } else {
                MobileCaching.getItem('user_credentials').then(credentials => {
                    setTimeout(async () => {
                        const isConnected = await NetworkUtils.isNetworkAvailable();
                        let temp_array = [];
                        let response = {};

                        Object.keys(data).forEach(key => {
                            let temp = {};
                            switch(key) {
                                case "ReportNarrative":
                                    temp['incident_report_narrative'] = data['ReportNarrative'];
                                    break;
                                default:
                                    temp[key.replace(" ","_").toLocaleLowerCase()] = data[key];
                                    break;
                            }
                            if (key != "attachment") {
                                temp_array.push(temp);
                            }
                        });
                        temp_array.push({'user_id': credentials['user_id']})
                        temp_array.push({'id': selectedData['id']})

                        if (isConnected != true) {
                            response = await MobileCaching.getItem("MarIncidentLogs").then(cached_data => {
                                let temp_response = {};
                                let state_contaner = selectedData;
                                temp_array.forEach(element => {
                                    let key = Object.keys(element)[0];
                                    state_contaner[key] = element[key];
                                });
                                state_contaner['alterations'] = "update";
                                let index = cached_data.findIndex(x => x.id == selectedData['id']);
                                cached_data[index] = state_contaner;
                                try {
                                    MobileCaching.setItem("MarIncidentLogs", cached_data);
                                    temp_response = {
                                        "status": true,
                                        "message": "Incident Logs is temporarily saved in the memory.\nPlease connect to the internet and sync your data."
                                    }
                                } catch (err) {
                                    temp_response = {
                                        "status": false,
                                        "message": "Incident Logs failed to save data to memory."
                                    }
                                }
                                init(cached_data);
                                return temp_response;
                            });
                        } else {
                            response = await MarMaintenanceLogs.UpdateIncidentLogs(temp_array);
                            if (response.status == true) {
                                fetchLatestData();
                            }
                        }
                        closeForm();
                        setCmd('add');
                        ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
                    }, 100);
                });
            }
        }
    }

    const modifySummary = (data) => {
        setSelectedData(data)
        setDefaultStrValues({
            'Report Narrative': data['incident_report_narrative'],
            'Reporter': data['reporter'],
        })
        setCmd('update')
        showForm();
    }

    const deleteForm = () => {
        Alert.alert(
            "Incident Logs",
            "Are you sure you want to delete this data?",
            [
              {
                text: "Cancel",
                style: "cancel"
              },
              { text: "Confirm", onPress: () => {
                setTimeout(async ()=> {
                    let response = await MarMaintenanceLogs.DeleteIncidentLogs({
                        'id': selectedData['id']
                    })
                    if (response.status == true) {
                        ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
                        init();
                        setDataContainer([]);
                        closeForm();
                        setCmd('add');
                    } else {
                        ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
                    }
                },300)
              }}
            ],
            { cancelable: false }
        );
    }

    const showDatatable = (day) => {
        let incident_temp = incidentLogs.filter(x => x.incident_date === day.dateString);
        if (incident_temp.length != 0) {
            let temp = [];
            incident_temp.forEach(element => {
                temp.push(
                    <DataTable.Row key={element.id} onPress={() => { modifySummary(element) }}>
                        <DataTable.Cell>{element.incident_report_narrative}</DataTable.Cell>
                        <DataTable.Cell>{element.reporter}</DataTable.Cell>
                    </DataTable.Row>
                )
            });
            setDataContainer(
                <View style={[ContainerStyle.datatable_content, {paddingTop: 20}]}>
                    <DataTable style={{flex: 1, padding: 10 }}>
                        <DataTable.Header>
                            <DataTable.Title>Narrative report</DataTable.Title>
                            <DataTable.Title>Reporter</DataTable.Title>
                        </DataTable.Header>
                        { temp }
                    </DataTable>
                    <DataTable.Pagination
                        page={1}
                        numberOfPages={3}
                        onPageChange={(page) => { console.log(page); }}
                        label="1-2 of 6"
                    />
                    <View style={{flex: 1, alignItems: 'center', padding: 10}}>
                        <TouchableOpacity style={ButtonStyle.medium} onPress={() => { showForm() }}>
                            <Text style={ButtonStyle.large_text}>Add +</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        } else {
            setDataContainer(
                <View style={{flex: 1, alignItems: 'center', padding: 10}}>
                    <Text style={[LabelStyle.large_label, LabelStyle.brand, {padding: 20}]}>No data available.</Text>
                    <TouchableOpacity style={ButtonStyle.medium} onPress={() => { showForm() }}>
                        <Text style={ButtonStyle.large_text}>Add +</Text>
                    </TouchableOpacity>
                </View>
            )
        }
        setSelectedDate(day.dateString);
    }

    return(
        <ScrollView>
            <View style={ContainerStyle.content}>
                <Text style={[LabelStyle.large_label, LabelStyle.brand]}>Incident Logs</Text>
                <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Logs and Reports</Text>
                <Calendar 
                    markedDates={markedDates}
                    theme={{
                        calendarBackground: 'transparent'
                    }}
                    onDayPress={(day) => { showDatatable(day) }}>
                </Calendar>
                <Text style={[LabelStyle.small_label, LabelStyle.brand]}>* Click calendar to show data table.</Text>
                { dataContainer }
            </View>
            <Modal animationType="slide"
                visible={openModal}
                onRequestClose={() => { 
                    setDefaultStrValues({
                        'Report Narrative': '',
                        'Reporter': ''
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
    )
}

export default IncidentLogs;