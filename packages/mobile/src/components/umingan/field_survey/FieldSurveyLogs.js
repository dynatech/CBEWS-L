import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
import { DataTable } from 'react-native-paper';
import { ContainerStyle } from '../../../styles/container_style';
import { LabelStyle } from '../../../styles/label_style';
import { ButtonStyle } from '../../../styles/button_style';
import { UmiFieldSurvey } from '@dynaslope/commons';
import { Calendar } from 'react-native-calendars';
import Forms from '../../utils/Forms';
import moment from 'moment';
import MobileCaching from '../../../utils/MobileCaching';
import NetworkUtils from '../../../utils/NetworkUtils';
import Uploader from '../../utils/Uploader';

function FieldSurveyLogs () {

    const [openModal, setOpenModal] = useState(false);
    const [fieldSurveyLogs, setFieldSurveyLogs] = useState([]);
    const [dataTableContent, setDataTableContent] = useState([]);
    const [dataContainer, setDataContainer] = useState([]);
    const [selectedData, setSelectedData] = useState({});
    const [cmd, setCmd] = useState('add');
    const [markedDates, setMarkedDates] = useState({});
    const [selectedDate, setSelectedDate] = useState('');
    const [defaultStrValues, setDefaultStrValues] = useState({});

    const default_fields = {
        'Report timestamp': '',
        'Feature': '',
        'Materials Characterization': '',
        'Mechanism': '',
        'Exposure': '',
        'Report narrative': '',
        'Reporter': '',
        'Attachment': 'N/A'
    }

    let formData = useRef();

    useEffect(() => {
        setTimeout( async ()=> {
            const isConnected = await NetworkUtils.isNetworkAvailable()
            if (isConnected != true) {
                MobileCaching.getItem('UmiFieldSurveyLogs').then(response => {
                    init(response);
                    setFieldSurveyLogs(response);
                });
            } else {
                fetchLatestData();
            }
          },100);
    }, [])

    const init = async (data) => {
        let temp = {};
        data.forEach(element => {
            temp[moment(element.report_date).format('YYYY-MM-DD')] = {
                selected: true
            }
        });
        setFieldSurveyLogs(data);
        setMarkedDates(temp);
        setDefaultStrValues(default_fields);
    }

    const fetchLatestData = async () => {
        let response = await UmiFieldSurvey.GetFieldSurveyLogs()
        if (response.status == true) {
            init(response.data);
            setDataTableContent([]);
            MobileCaching.setItem('UmiFieldSurveyLogs', response.data);
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

    const uploadFile = async (attachment) => {
        const url = 'https://dynaslope.phivolcs.dost.gov.ph:5000/v2/upload/field_survey/umi/field_survey_logs'
        const file = [{
          name: 'file',
          filename: attachment.filename,
          filepath: attachment.filepath,
          filetype: attachment.filetype,
          filesize: attachment.filesize
        }];
        let upload_status = await Uploader(url, file);
        return upload_status
    }

    const submitForm = () => {
        let data = formData.current;
        if (!Object.keys(selectedData).length) {
            MobileCaching.getItem('user_credentials').then(credentials => {
                let temp = {};
                let response = {};
                setTimeout(async () => {
                    const isConnected = await NetworkUtils.isNetworkAvailable();
                    temp['user_id'] = credentials['user_id'];
                    temp['feature'] = data['Feature'];
                    temp['exposure'] = data['Exposure'];
                    temp['mechanism'] = data['Mechanism'];
                    temp['materials_characterization'] = data['MaterialsCharacterization']
                    temp['report_date'] = `${selectedDate} ${data['Reporttimestamp']}`;
                    temp['report_narrative'] = data['Reportnarrative'];
                    temp['reporter'] = data['Reporter'];

                    if (data['attachment'] === undefined) {
                        temp['attachment_path'] = "N/A";
                    } else {
                        temp['attachment_path'] = data['attachment'];
                    }

                    if (isConnected != true) {
                        let cached = await MobileCaching.getItem("UmiFieldSurveyLogs").then(cached_data => {
                            temp["alterations"] = "add";
                            cached_data.push(temp)
                            try {
                                MobileCaching.setItem("UmiFieldSurveyLogs", cached_data);
                                response = {
                                    "status": true,
                                    "message": "Field Survey Logs is temporarily saved in the memory.\nPlease connect to the internet and sync your data."
                                }
                            } catch (err) {
                                response = {
                                    "status": false,
                                    "message": "Field Survey Logs failed to save data to memory."
                                }
                            }

                            if (response.status == true) {
                                ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
                                closeForm();
                                setCmd('add');
                            } else {
                                ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
                            }

                            init(cached_data);
                            return response;
                        });
                    } else {
                        setTimeout(async()=> {
                            let upload_response = {};
                            if (temp['attachment_path'] != "N/A") {
                                upload_response = await uploadFile(temp['attachment_path']);
                                temp['attachment_path'] = upload_response.file_path;
                            } else {
                                upload_response['status'] = true;
                            }

                            if (upload_response.status == true) {
                                response = await UmiFieldSurvey.InsertFieldSurveyLogs(temp)
                                if (response.status == true) {
                                    fetchLatestData();
                                    closeForm();
                                    setCmd('add');
                                }
                                ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
                            }
                        }, 200);
                    }

                }, 300);
                setDataContainer([]);
            });
        } else {
            if (!Object.keys(selectedData).length) {
                ToastAndroid.showWithGravity('No changes has been made.', ToastAndroid.LONG, ToastAndroid.CENTER)
                closeForm();
            } else {
                MobileCaching.getItem('user_credentials').then(credentials => {
                    setTimeout(async () => {
                        let temp_array = [];
                        if (Object.keys(data).length) {
                            Object.keys(data).forEach(key => {
                                let temp = {};
                                switch(key) {
                                    case "Reportnarrative":
                                        temp['report_narrative'] = data['Reportnarrative'];
                                        break;
                                    case "MaterialsCharacterization":
                                        temp['materials_characterization'] = data['MaterialsCharacterization'];
                                        break;
                                    case "Reporttimestamp":
                                        temp['report_date'] = `${selectedDate} ${data['Reporttimestamp']}`
                                        break;
                                    case "attachment":
                                        temp['attachment_path'] = data['attachment'];
                                    default:
                                        temp[key.replace(" ","_").toLocaleLowerCase()] = data[key];
                                        break;
                                }
                                temp_array.push(temp);
                            });
                            temp_array.push({'user_id': credentials['user_id']})
                            temp_array.push({'id': selectedData['id']})

                            const isConnected = await NetworkUtils.isNetworkAvailable();
                            let response = null;

                            if (isConnected != true) {
                                let temp = await MobileCaching.getItem("UmiFieldSurveyLogs").then(cached_data => {
                                    let state_contaner = selectedData;
                                    temp_array.forEach(element => {
                                        let key = Object.keys(element)[0];
                                        state_contaner[key] = element[key];
                                    });
                                    state_contaner['alterations'] = "update";
                                    let index = cached_data.findIndex(x => x.id == selectedData['id']);
                                    cached_data[index] = state_contaner;
                                    try {
                                        MobileCaching.setItem("UmiFieldSurveyLogs", cached_data);
                                        response = {
                                            "status": true,
                                            "message": "Field Survey Logs is temporarily saved in the memory.\nPlease connect to the internet and sync your data."
                                        }
                                    } catch (err) {
                                        response = {
                                            "status": false,
                                            "message": "Field Survey Logs failed to save data to memory."
                                        }
                                    }
                                    init(cached_data);
                                    return response;
                                });
                            } else {
                                let updateFile = temp_array.some(obj => obj.hasOwnProperty("attachment_path"));
                                let file_index = temp_array.findIndex(x => x.attachment_path != null);
                                if (updateFile == true && temp_array[file_index].attachment_path != undefined) {
                                    let checkFile = await UmiFieldSurvey.UpdateAttachmentFile({
                                        'id':selectedData['id'],
                                        'file_path':temp_array[file_index].attachment_path
                                    });
                                    if (checkFile.status != true) {
                                        let upload_response = await uploadFile(temp_array[file_index].attachment_path);
                                        temp_array[file_index].attachment_path = upload_response.file_path
                                    }
                                }
                                response = await UmiFieldSurvey.UpdateFieldSurveyLogs(temp_array);
                                fetchLatestData();
                            }
                            closeForm();
                            setDataContainer([]);
                            setCmd('add');
                            ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
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
            'Report timestamp': moment(data['report_date']).format("HH:mm:ss"),
            'Feature': data['feature'],
            'Materials Characterization': data['materials_characterization'],
            'Mechanism': data['mechanism'],
            'Exposure': data['exposure'],
            'Report narrative': data['report_narrative'],
            'Reporter': data['reporter'],
            'Attachment': data['attachment_path']

        })
        setCmd('update');
        showForm();
    }

    const deleteForm = () => {
        Alert.alert(
            "Field Survey Log",
            "Are you sure you want to delete this data?",
            [
              {
                text: "Cancel",
                style: "cancel"
              },
              { text: "Confirm", onPress: () => {
                setTimeout(async ()=> {
                    let response = await UmiFieldSurvey.DeleteFieldSurveyLogs({
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
        let survey_temp = fieldSurveyLogs.filter(x => moment(x.report_date).format('YYYY-MM-DD') === day.dateString);
        if (survey_temp.length != 0) {
            let temp = [];
            survey_temp.forEach(element => {
                temp.push(
                    <DataTable.Row key={element.id} onPress={() => { modifySummary(element) }}>
                        <DataTable.Cell>{moment(element.report_date).format('YYYY-MM-DD HH:mm:ss')}</DataTable.Cell>
                        <DataTable.Cell>{element.reporter}</DataTable.Cell>
                        <DataTable.Cell>{element.report_narrative}</DataTable.Cell>
                        <DataTable.Cell>{element.feature}</DataTable.Cell>
                        <DataTable.Cell>{element.exposure}</DataTable.Cell>
                        <DataTable.Cell>{element.mechanism}</DataTable.Cell>
                        <DataTable.Cell>{element.materials_characterization}</DataTable.Cell>
                    </DataTable.Row>
                )
            });
            setDataContainer(
                    <View style={[ContainerStyle.datatable_content, {paddingTop: 20}]}>
                        <ScrollView horizontal={true}>
                            <DataTable style={{ width: 1200, padding: 10 }}>
                                <DataTable.Header>
                                    <DataTable.Title>Report Date</DataTable.Title>
                                    <DataTable.Title>Reporter</DataTable.Title>
                                    <DataTable.Title>Report Narrative</DataTable.Title>
                                    <DataTable.Title>Feature</DataTable.Title>
                                    <DataTable.Title>Exposure</DataTable.Title>
                                    <DataTable.Title>Mechanism</DataTable.Title>
                                    <DataTable.Title>Materials Characterization</DataTable.Title>
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
                <Text style={[LabelStyle.large_label, LabelStyle.brand]}>Field Survey Logs</Text>
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

export default FieldSurveyLogs;