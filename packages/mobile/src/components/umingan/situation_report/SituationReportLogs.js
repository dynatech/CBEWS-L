import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
import { DataTable } from 'react-native-paper';
import { ContainerStyle } from '../../../styles/container_style';
import { LabelStyle } from '../../../styles/label_style';
import { ButtonStyle } from '../../../styles/button_style';
import { UmiSituationReport, UmiFieldSurvey } from '@dynaslope/commons';
import { Calendar } from 'react-native-calendars';
import Forms from '../../utils/Forms';
import moment from 'moment';
import Uploader from '../../utils/Uploader';
import MobileCaching from '../../../utils/MobileCaching';

function SituationReportLogs () {

    const [openModal, setOpenModal] = useState(false);
    const [situationReportLogs, setSituationReportLogs] = useState([]);
    const [dataTableContent, setDataTableContent] = useState([]);
    const [dataContainer, setDataContainer] = useState([]);
    const [selectedData, setSelectedData] = useState({});
    const [cmd, setCmd] = useState('add');
    const [markedDates, setMarkedDates] = useState({});
    const [selectedDate, setSelectedDate] = useState('');
    const [defaultStrValues, setDefaultStrValues] = useState({});

    let formData = useRef();

    useEffect(() => {
        init();
        setDefaultStrValues(default_fields);
    }, [])

    const default_fields = {
        'Report timestamp': '',
        'Situation Report Summary': '',
        'Attachment': 'N/A'
    }

    const init = async () => {
        let response = await UmiSituationReport.GetSituationReport()
        if (response.status === true) {
            let temp = {};
            response.data.forEach(element => {
                temp[moment(element.report_ts).format('YYYY-MM-DD')] = {
                    selected: true
                }
            });
            setSituationReportLogs(response.data);
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
                let temp = {
                    'report_ts': `${selectedDate} ${data['Reporttimestamp']}`,
                    'report_summary': data['SituationReportSummary'],
                    'user_id': credentials['user_id']
                };
                setTimeout(async () => {
                    let response = null;
                    if ('attachment' in data) {
                        const url = 'http://192.168.150.221:5000/v2/upload/situation_report/umi/situation_report_logs'
                        const file = [{
                          name: 'file',
                          filename: data.attachment['filename'],
                          filepath: data.attachment['filepath'],
                          filetype: data.attachment['filetype'],
                          filesize: data.attachment['filesize']
                        }];
                        
                        let upload_status = await Uploader(url, file);
                        if (upload_status.status == true) {
                            temp['attachment'] = upload_status.file_path;
                            response = await UmiSituationReport.InsertSituationReport(temp);
                        } else {
                          ToastAndroid.showWithGravity(upload_status.message, ToastAndroid.LONG, ToastAndroid.CENTER)
                        }
                    } else {
                        temp['attachment'] = 'N/A';
                        response = await UmiSituationReport.InsertSituationReport(temp);
                    }
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
                                    case "Reporttimestamp":
                                        temp['report_ts'] = data['Reporttimestamp'];
                                        break;
                                    case "Situationreportsummary":
                                        temp['report_summary'] = data['Situationreportsummary'];
                                        break;
                                    default:
                                        temp[key.replace(" ","_").toLocaleLowerCase()] = data[key];
                                        break;
                                }
                                temp_array.push(temp);
                            });
                            temp_array.push({'user_id': credentials['user_id']})
                            temp_array.push({'id': selectedData['id']})

                            let response = await UmiSituationReport.UpdateSituationReport(temp_array)

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
            'Report timestamp': moment(data['report_ts']).format("HH:mm:ss"),
            'Situation report summary': data['report_summary'],
            'Attachment': data['attachment_path']
        })
        setCmd('update');
        showForm();
    }

    const deleteForm = () => {
        Alert.alert(
            "Situation Report Log",
            "Are you sure you want to delete this data?",
            [
              {
                text: "Cancel",
                style: "cancel"
              },
              { text: "Confirm", onPress: async () => {
                let response = await UmiSituationReport.DeleteSituationReport({
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
              }}
            ],
            { cancelable: false }
        );
    }

    const showDatatable = (day) => {
        let survey_temp = situationReportLogs.filter(x => moment(x.report_ts).format('YYYY-MM-DD') === day.dateString);
        if (survey_temp.length != 0) {
            let temp = [];
            survey_temp.forEach(element => {
                temp.push(
                    <DataTable.Row key={element.id} onPress={() => { modifySummary(element) }}>
                        <DataTable.Cell>{moment(element.report_ts).format('YYYY-MM-DD HH:mm:ss')}</DataTable.Cell>
                        <DataTable.Cell>{element.report_summary}</DataTable.Cell>
                    </DataTable.Row>
                )
            });
            setDataContainer(
                    <View style={[ContainerStyle.datatable_content, {paddingTop: 20}]}>
                        <ScrollView horizontal={true}>
                            <DataTable style={{width: 500, padding: 10 }}>
                                <DataTable.Header>
                                    <DataTable.Title>Report Date</DataTable.Title>
                                    <DataTable.Title>Summary</DataTable.Title>
                                </DataTable.Header>
                                { temp }
                            </DataTable>
                            </ScrollView>
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
                <Text style={[LabelStyle.large_label, LabelStyle.brand]}>Situation Report Logs</Text>
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
                    setDefaultStrValues(default_fields)
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

export default SituationReportLogs;