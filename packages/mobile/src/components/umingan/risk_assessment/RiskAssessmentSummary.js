import React, { useState, useEffect, useRef } from 'react';
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

function RiskAssessmentSummary(props) {
    const navigator = props.navigation;
    
    const [openModal, setOpenModal] = useState(false);
    const [dataTableContent, setDataTableContent] = useState([]);
    const [selectedData, setSelectedData] = useState({});
    const [riskAssessmentContainer, setRiskAssessmentContainer] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [cmd, setCmd] = useState('add');
    const isFocused = useIsFocused();
		const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [defaultStrValues, setDefaultStrValues] = useState({
        'Location': '',
        'Impact': '',
        'Adaptive Capacity': '',
        'Vulnerability': ''
    });

    let formData = useRef();

    const resetForm = () => {
        setDefaultStrValues({
            'Location': '',
            'Impact': '',
            'Adaptive Capacity': '',
            'Vulnerability': ''
        });
        setSelectedData({});
    }

    // Initialize Risk Assessment Summary data: Get from cache or fetch from server
    const initRiskAssessmentSummary = async () => {
    }

    // Refresh Risk Assessment Summary on pull down
    const onRefresh = React.useCallback(() => {
    }, []);

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
                            <DataTable.Cell>{element.location}</DataTable.Cell>
                            <DataTable.Cell>{element.impact}</DataTable.Cell>
                            <DataTable.Cell>{element.adaptive_capacity}</DataTable.Cell>
                            <DataTable.Cell>{element.vulnerability}</DataTable.Cell>
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
                <Text style={[LabelStyle.large_label, LabelStyle.brand]}>Risk Assessment Summary</Text>
                <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Summary of Reports / Logs</Text>
                <View style={ContainerStyle.datatable_content}>
                    <DataTable style={{ flex: 1, padding: 10, textAlign: 'center' }}>
                        <DataTable.Header>
                            <DataTable.Title>Location</DataTable.Title>
                            <DataTable.Title>Impact</DataTable.Title>
                            <DataTable.Title>Adaptive Capacity</DataTable.Title>
                            <DataTable.Title>Vulnerability</DataTable.Title>
                        </DataTable.Header>
                        {dataTableContent}
                    </DataTable>
                    <DataTable.Pagination
                        page={1}
                        numberOfPages={3}
                        onPageChange={(page) => { console.log(page); }}
                        label="1-2 of 6"
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
                        'Location': '',
                        'Impact': '',
                        'Adaptive Capacity': '',
                        'Vulnerability': ''
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

export default RiskAssessmentSummary;