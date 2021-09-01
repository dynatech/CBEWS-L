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
        showForm();
    }

    const submitForm = async () => {
    }

    const deleteForm = () => {
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