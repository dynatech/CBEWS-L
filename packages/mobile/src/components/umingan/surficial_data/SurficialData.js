import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
import { DataTable } from 'react-native-paper';
import { ContainerStyle } from '../../../styles/container_style';
import { LabelStyle } from '../../../styles/label_style';
import { ButtonStyle } from '../../../styles/button_style';
import { UmiGroundData } from '@dynaslope/commons';
import Forms from '../../utils/Forms';
import NetworkUtils from '../../../utils/NetworkUtils';
import MobileCaching from '../../../utils/MobileCaching';

function SurficialData() {

    let formData = useRef();
    const [openModal, setOpenModal] = useState(false);
    const [surficialData, setSurficialData] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [dataTableHeaders, setDataTableHeaders] = useState([]);
    const [dataTableContent, setDataTableContent] = useState([]);
    const [selectedData, setSelectedData] = useState({});
    const [cmd, setCmd] = useState('add');
    const [defaultStrValues, setDefaultStrValues] = useState({});

    const [page, setPage] = useState(0);
    const [pages, setPages] = useState(0);

    const init = async (data, markers) => {
        let temp = [];
        let temp_headers = [];
        let temp_pages = parseInt(data.length / 10)

        if (markers.length != 0) {
            let temp_default_fields = {
                'Observance timestamp': '',
                'Weather': '',
                'Observer / Nagsukat': ''
            }
            markers.forEach(element => {
                temp_default_fields[element.marker_name] = "";
                temp_headers.push(<DataTable.Title key={element.marker_name} style={{width: 75}}>{element.marker_name}</DataTable.Title>)
            });

            if ((data.length % 10) != 0) {
                temp_pages = temp_pages+1;
            }

            setDataTableHeaders(temp_headers)
            setSurficialData(data);
            setMarkers(markers)
            setDefaultStrValues(temp_default_fields);
            setPages(temp_pages);
            constructDtBody(data, 0)
        } else {
            // Display error
        }
    }


    const fetchLatestData = async () => {
    }

    const onPageChange = (raw_page) => {
        setPage(raw_page);
        constructDtBody(surficialData, raw_page * 10);
    }

    const modifySummary = (data) => {
        let key = Object.keys(data)[0];
        let inputs = {
            'Weather': data[key]['weather'],
            'Observer / Nagsukat': data[key]['observer'],
        };

        Object.keys(data[key]).forEach(element => {
            if (element != 'ts' && element != 'weather' && element != 'observer') {
                inputs[element] = data[key][element];
            }
        });

        setSelectedData(data[key]);
        setDefaultStrValues(inputs);
        setCmd('update')
        showForm();
    }

    const showForm = () => {
        setOpenModal(true);
    }

    const closeForm = () => {
        setOpenModal(false);
    }

    const deleteForm = () => {
    }

    const submitForm = async () => {
    }

    const constructDtBody = (data, dt_row) => {
        let surficial_row = data.slice(dt_row, dt_row+10);
        let temp = [];
        surficial_row.forEach(row => {
            let obj_data = Object.values(row)
            let actual_data = Object.values(obj_data[0])
            let temp_marker_value_container = [];
            for (const [key, value] of Object.entries(obj_data[0])) {
                if (key != 'observer' && key != 'ts' && key != 'weather' && key != 'alterations') {
                    temp_marker_value_container.push(<DataTable.Cell key={`${key}_${value}`} style={{width: 75}}>{value}</DataTable.Cell>);
                }
            }
            
            temp.push(
                <DataTable.Row key={Object.keys(obj_data)[0]} onPress={() => { modifySummary(obj_data) }}>
                    <DataTable.Cell style={{width: 150}}>{obj_data[0].ts}</DataTable.Cell>
                        { temp_marker_value_container }
                    <DataTable.Cell style={{width: 150}}>{obj_data[0].weather}</DataTable.Cell>
                    <DataTable.Cell style={{width: 150}}>{obj_data[0].observer}</DataTable.Cell>
                </DataTable.Row>
            )
        });
        setDataTableContent(temp)
      }
    
    return(
        <ScrollView>
            <View style={ContainerStyle.content}>
                <Text style={[LabelStyle.large_label, LabelStyle.brand]}>Surficial Data</Text>
                <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Add / Edit / Delete Surficial Data</Text>
                <View style={ContainerStyle.datatable_content}>
                    <ScrollView horizontal={true}>
                        <DataTable style={{ flex: 1, padding: 10}}>
                            <DataTable.Header>
                                <DataTable.Title style={{width: 150}}>Observance timestamp</DataTable.Title>
                                { dataTableHeaders }
                                <DataTable.Title style={{width: 150}}>Weather Condition</DataTable.Title>
                                <DataTable.Title style={{width: 150}}>Nagsukat / Reporter</DataTable.Title>
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

export default SurficialData