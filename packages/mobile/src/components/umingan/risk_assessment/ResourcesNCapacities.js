import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, ToastAndroid, Alert, BackHandler, RefreshControl, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { DataTable } from 'react-native-paper';
import { ContainerStyle } from '../../../styles/container_style';
import { LabelStyle } from '../../../styles/label_style';
import { ButtonStyle } from '../../../styles/button_style';
import { UmiRiskManagement } from '@dynaslope/commons';
import Forms from '../../utils/Forms';
import MobileCaching from '../../../utils/MobileCaching';
import NetworkUtils from '../../../utils/NetworkUtils';
import { useIsFocused } from '@react-navigation/native';

function ResourcesNCapacities(props) {
    const navigator = props.navigation;

    const [openModal, setOpenModal] = useState(false);
    const [dataTableContent, setDataTableContent] = useState([]);
    const [selectedData, setSelectedData] = useState({});
    const [resourceAndCapacitiesContainer, setResourceAndCapacitiesContainer] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [cmd, setCmd] = useState('add');
    const isFocused = useIsFocused();

    const [defaultStrValues, setDefaultStrValues] = useState({
        'Resource and Capacities': '',
        'Status': '',
        'Owner': ''
    });

    let formData = useRef();

    const resetForm = () => {
        setDefaultStrValues({
            'Resource and Capacities': '',
            'Status': '',
            'Owner': ''
        });
        setSelectedData({});
    }


    // Initialize Resources and Capacities data: Get from cache or fetch from server
    const initResNCapacities = async () => {
    }

    // Refresh Resources and Capacities on pull down
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
                            <DataTable.Cell>{element.resource_and_capacities}</DataTable.Cell>
                            <DataTable.Cell>{element.status}</DataTable.Cell>
                            <DataTable.Cell>{element.owner}</DataTable.Cell>
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
                <Text style={[LabelStyle.large_label, LabelStyle.brand]}>Resources and Capacities</Text>
                <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Resources Logs / Inventory</Text>
                <View style={ContainerStyle.datatable_content}>
                    <DataTable style={{ flex: 1, padding: 10, textAlign: 'center' }}>
                        <DataTable.Header>
                            <DataTable.Title>Resource / Capacity</DataTable.Title>
                            <DataTable.Title>Status</DataTable.Title>
                            <DataTable.Title>Owner</DataTable.Title>
                        </DataTable.Header>
                        { dataTableContent }
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
                        'Resource and Capacities': '',
                        'Status': '',
                        'Owner': ''
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

export default ResourcesNCapacities;