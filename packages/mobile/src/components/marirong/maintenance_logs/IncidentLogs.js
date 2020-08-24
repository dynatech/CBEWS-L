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
        // init();
    }, [])

    const init = async () => {
        let response = await MarMaintenanceLogs.GetIncidentLogs()
        if (response.status === true) {
            let temp = {};
            response.data.forEach(element => {
                temp[element.incident_date] = {
                    selected: true
                }
            });
            console.log(response.data);
            setIncidentLogs(response.data);
            setMarkedDates(temp);
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
                let temp = {};
                setTimeout(async () => {
                    temp['user_id'] = credentials['user_id'];
                    temp['incident_date'] = selectedDate;
                    temp['incident_report_narrative'] = data['ReportNarrative'];
                    temp['reporter'] = data['Reporter'];

                    let response = await MarMaintenanceLogs.InsertIncidentLogs(temp)
 
                    if (response.status == true) {
                        ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
                        init();
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
                        let temp_array = []
                        if (Object.keys(data).length) {
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
                                temp_array.push(temp);
                            });
                            temp_array.push({'user_id': credentials['user_id']})
                            temp_array.push({'id': selectedData['id']})
                            let response = await MarMaintenanceLogs.UpdateIncidentLogs(temp_array)
                            if (response.status == true) {
                                ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
                                init();
                                closeForm();
                                setDataContainer([]);
                                setCmd('add');
                            } else {
                                ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
                            }
                        } else {
                            ToastAndroid.showWithGravity("No changes has been made. Please double check each field or Press back button to cancel.", ToastAndroid.LONG, ToastAndroid.CENTER)
                        }
                    }, 300);
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