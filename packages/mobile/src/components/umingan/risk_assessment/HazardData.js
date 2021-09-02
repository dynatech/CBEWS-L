import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, ToastAndroid, Alert, RefreshControl, SafeAreaView } from 'react-native';
import { DataTable } from 'react-native-paper';
import { ContainerStyle } from '../../../styles/container_style';
import { LabelStyle } from '../../../styles/label_style';
import { ButtonStyle } from '../../../styles/button_style';
import { UmiRiskManagement } from '@dynaslope/commons';
import Forms from '../../utils/Forms';
import MobileCaching from '../../../utils/MobileCaching';
import NetworkUtils from '../../../utils/NetworkUtils';
import { useIsFocused } from '@react-navigation/native';

const numberOfItemsPerPageList = [2, 3, 4];

const items = [
  {
    key: 1,
    name: 'Page 1',
  },
  {
    key: 2,
    name: 'Page 2',
  },
  {
    key: 3,
    name: 'Page 3',
  },
];

function HazardData() {

    const [openModal, setOpenModal] = useState(false);
    const [dataTableContent, setDataTableContent] = useState([]);
    const [selectedData, setSelectedData] = useState({});
    const [hazardDataContainer, setHazardDataContainer] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [cmd, setCmd] = useState('add');
    const isFocused = useIsFocused();
    const [defaultStrValues, setDefaultStrValues] = useState({
        'Hazard': '',
        'Speed of Onset': '',
        'Early Warning': '',
        'Impact': ''
    });

    // Datatable pagination
    const [page, setPage] = React.useState(0);
    const [numberOfItemsPerPage, onItemsPerPageChange] = React.useState(numberOfItemsPerPageList[0]);
    const from = page * numberOfItemsPerPage;
    const to = Math.min((page + 1) * numberOfItemsPerPage, items.length);
    React.useEffect(() => {
        setPage(0);
     }, [numberOfItemsPerPage]);
    
    let formData = useRef();
    
    const resetForm = () => {
        setDefaultStrValues({
            'Hazard': '',
            'Speed of Onset': '',
            'Early Warning': '',
            'Impact': ''
        });
        setSelectedData({});
    }

    const listTable = [{
        'id': 0,
        'early_warning': 'PAGASA',
        'hazard': 'Tropical Cyclone',
        'impact': 'Few Days',
        'last_ts': null,
        'speed_of_onset': 'Slow',
    }];

    // Initialize Hazards Data data: Get from cache or fetch from server
    const initHazardsData = async () => {
        fetchLatestData();
    }

    // Refresh hazard data on pull down
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        initHazardsData().then(() => setRefreshing(false));
    }, []);

    // Fetch Hazards Data on initial tab load
    useEffect(() => {
        initHazardsData();
    }, []);

    // Fetch Hazards Data on next succeeding tab loads
    useEffect(() => {
        if(isFocused){
            initHazardsData();
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
                            <DataTable.Cell>{element.hazard}</DataTable.Cell>
                            <DataTable.Cell>{element.speed_of_onset}</DataTable.Cell>
                            <DataTable.Cell>{element.early_warning}</DataTable.Cell>
                            <DataTable.Cell>{element.impact}</DataTable.Cell>
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
        init(listTable);   
    }

    const showForm = () => {
        setOpenModal(true);
    }

    const closeForm = () => {
        setOpenModal(false);
    }

    const submitForm = () => {
    }

    const modifySummary = (data) => {
        setSelectedData(data)
        setDefaultStrValues({
            'Hazard': data['hazard'],
            'Speed of Onset': data['speed_of_onset'],
            'Early Warning': data['early_warning'],
            'Impact': data['impact']
        })
        setCmd('update')
        showForm();
    }

    const deleteForm = () => {
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
                <Text style={[LabelStyle.large_label, LabelStyle.brand]}>Hazard Data</Text>
                <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Hazard Reports / Logs</Text>
                <View style={ContainerStyle.datatable_content}>
                    <DataTable style={{ flex: 1, padding: 10, textAlign: 'center' }}>
                        <DataTable.Header>
                            <DataTable.Title>Hazard</DataTable.Title>
                            <DataTable.Title>Speed of Onset</DataTable.Title>
                            <DataTable.Title>Early Warning</DataTable.Title>
                            <DataTable.Title>Impact</DataTable.Title>
                        </DataTable.Header>
                        { dataTableContent }
                    </DataTable>
                    <DataTable.Pagination
                        page={page}
                        numberOfPages={Math.ceil(items.length / numberOfItemsPerPage)}
                        onPageChange={page => setPage(page)}
                        label={`${from + 1}-${to} of ${items.length}`}
                        showFastPaginationControls
                        numberOfItemsPerPageList={numberOfItemsPerPageList}
                        numberOfItemsPerPage={numberOfItemsPerPage}
                        onItemsPerPageChange={onItemsPerPageChange}
                        selectPageDropdownLabel={'Rows per page'}
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
                        'Hazard': '',
                        'Speed of Onset': '',
                        'Early Warning': '',
                        'Impact': ''
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

export default HazardData;