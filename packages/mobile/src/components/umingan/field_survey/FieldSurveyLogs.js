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

    let formData = useRef();

    useEffect(() => {
        init();
        setDefaultStrValues(default_fields);
    }, [])

    const default_fields = {
        'Report timestamp': '',
        'Feature': '',
        'Materials Characterization': '',
        'Mechanism': '',
        'Exposure': '',
        'Report narrative': '',
        'Reporter': '',
        'Attachments': 'N/A'
    }

    const init = async () => {
        let response = await UmiFieldSurvey.GetFieldSurveyLogs()
        if (response.status === true) {
            let temp = {};
            response.data.forEach(element => {
                temp[moment(element.report_date).format('YYYY-MM-DD')] = {
                    selected: true
                }
            });
            setFieldSurveyLogs(response.data);
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
                    temp['feature'] = data['Feature'];
                    temp['exposure'] = data['Exposure'];
                    temp['mechanism'] = data['Mechanism'];
                    temp['materials_characterization'] = data['MaterialsCharacterization']
                    temp['report_date'] = `${selectedDate} ${data['Reporttimestamp']}`;
                    temp['report_narrative'] = data['Reportnarrative'];
                    temp['reporter'] = data['Reporter'];

                    if (data['Attachements'] === undefined) {
                        temp['attachment_path'] = "N/A";
                    } else {
                        temp['attachment_path'] = data['Attachments'];
                    }

                    let response = await UmiFieldSurvey.InsertFieldSurveyLogs(temp)

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
                                    case "Reportnarrative":
                                        temp['report_narrative'] = data['Reportnarrative'];
                                        break;
                                    case "MaterialsCharacterization":
                                        temp['materials_characterization'] = data['MaterialsCharacterization'];
                                        break;
                                    case "Reporttimestamp":
                                        temp['report_date'] = `${selectedDate} ${data['Reporttimestamp']}`
                                        break;
                                    default:
                                        temp[key.replace(" ","_").toLocaleLowerCase()] = data[key];
                                        break;
                                }
                                temp_array.push(temp);
                            });
                            temp_array.push({'user_id': credentials['user_id']})
                            temp_array.push({'id': selectedData['id']})

                            let response = await UmiFieldSurvey.UpdateFieldSurveyLogs(temp_array)

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
            'Report timestamp': moment(data['report_date']).format("HH:mm:ss"),
            'Feature': data['feature'],
            'Materials Characterization': data['materials_characterization'],
            'Mechanism': data['mechanism'],
            'Exposure': data['exposure'],
            'Report narrative': data['report_narrative'],
            'Reporter': data['reporter'],
            'Attachments': data['attachment_path']

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
                        <DataTable.Cell>{element.feature}</DataTable.Cell>
                        <DataTable.Cell>{element.reporter}</DataTable.Cell>
                    </DataTable.Row>
                )
            });
            setDataContainer(
                    <View style={[ContainerStyle.datatable_content, {paddingTop: 20}]}>
                        <ScrollView horizontal={true}>
                            <DataTable style={{width: 500, padding: 10 }}>
                                <DataTable.Header>
                                    <DataTable.Title>Report Date</DataTable.Title>
                                    <DataTable.Title>Feature</DataTable.Title>
                                    <DataTable.Title>Reporter</DataTable.Title>
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