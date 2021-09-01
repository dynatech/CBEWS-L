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
    }

    const modifySummary = (data) => {
        showForm();
    }

    const deleteForm = () => {
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
                            <DataTable style={{ width: 500, padding: 10 }}>
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