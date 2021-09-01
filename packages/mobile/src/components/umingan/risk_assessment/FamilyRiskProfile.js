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

function FamilyRiskProfile() {

    const [openModal, setOpenModal] = useState(false);
    const [dataTableContent, setDataTableContent] = useState([]);
    const [selectedData, setSelectedData] = useState({});
    const [familyRiskProfile, setFamilyRiskProfile] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [cmd, setCmd] = useState('add');
    const isFocused = useIsFocused();
    const [defaultStrValues, setDefaultStrValues] = useState({
        'Number of Members': '',
        'Vulnerable Groups': '',
        'Nature of Vulnerability': ''
    });

    let formData = useRef();

    const resetForm = () => {
        setDefaultStrValues({
            'Number of Members': '',
            'Vulnerable Groups': '',
            'Nature of Vulnerability': ''
        });
        setSelectedData({});
    }

    // Initialize Family Risk Profile data: Get from cache or fetch from server
    const initFamilyRiskProfile = async () => {
    }

    // Refresh Family Risk Profile on pull down
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
                            <DataTable.Cell>{element.number_of_members}</DataTable.Cell>
                            <DataTable.Cell>{element.vulnerable_groups}</DataTable.Cell>
                            <DataTable.Cell>{element.nature_of_vulnerability}</DataTable.Cell>
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
                <Text style={[LabelStyle.large_label, LabelStyle.brand]}>Family Risk Profile</Text>
                <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Household affected areas logs</Text>
                <View style={ContainerStyle.datatable_content}>
                    <DataTable style={{ flex: 1, padding: 10, textAlign: 'center' }}>
                        <DataTable.Header>
                            <DataTable.Title>Number of Members</DataTable.Title>
                            <DataTable.Title>Vulnerable Groups</DataTable.Title>
                            <DataTable.Title>Nature of Vulnerability</DataTable.Title>
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
                        'Number of Members': '',
                        'Vulnerable Groups': '',
                        'Nature of Vulnerability': ''
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

export default FamilyRiskProfile;