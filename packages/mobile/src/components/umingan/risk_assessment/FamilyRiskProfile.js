import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
import { DataTable } from 'react-native-paper';
import { ContainerStyle } from '../../../styles/container_style';
import { LabelStyle } from '../../../styles/label_style';
import { ButtonStyle } from '../../../styles/button_style';
import { UmiRiskManagement } from '@dynaslope/commons';
import Forms from '../../utils/Forms';
import MobileCaching from '../../../utils/MobileCaching';
import NetworkUtils from '../../../utils/NetworkUtils';

function FamilyRiskProfile() {

    const [openModal, setOpenModal] = useState(false);
    const [dataTableContent, setDataTableContent] = useState([]);
    const [selectedData, setSelectedData] = useState({});
    const [familyRiskProfile, setFamilyRiskProfile] = useState([]);
    const [cmd, setCmd] = useState('add');
    const [defaultStrValues, setDefaultStrValues] = useState({
        'Number of Members': '',
        'Vulnerable Groups': '',
        'Nature of Vulnerability': ''
    });

    let formData = useRef();

    useEffect(() => {
        setTimeout( async ()=> {
            const isConnected = await NetworkUtils.isNetworkAvailable()
            if (isConnected != true) {
                MobileCaching.getItem('UmiFamilyRiskProfile').then(response => {
                    init(response);
                    setFamilyRiskProfile(response);
                });
            } else {
                fetchLatestData();
            }
        },100);

    }, [])

    const init = async (data) => {
        let temp = [];
        if (data == undefined) {
            temp.push(
                <View key={0}>
                    <Text>No local data available.</Text>
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
                        <Text>No available data.</Text>
                    </View>
                )
            }
        }

        setDataTableContent(temp)
    }

    const fetchLatestData = async () => {
        let response = await UmiRiskManagement.GetAllFamilyRiskProfile()
        if (response.status == true) {
            init(response.data);
            setFamilyRiskProfile(response.data);
            MobileCaching.setItem('UmiFamilyRiskProfile', response.data);
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
                setTimeout(async () => {

                    const isConnected = await NetworkUtils.isNetworkAvailable();
                    let response = null;
                    
                    if (isConnected != true) {
                        response = await MobileCaching.getItem("UmiFamilyRiskProfile").then(cached_data => {
                            cached_data.push({
                                'id': 0,
                                'last_ts': null,
                                'nature_of_vulnerability': data['NatureofVulnerability'],
                                'number_of_members': data['NumberofMembers'],
                                'user_id': credentials['user_id'],
                                'vulnerable_groups': data['VulnerableGroups'],
                                'alterations': 'add'
                            });
                            try {
                                MobileCaching.setItem("UmiFamilyRiskProfile", cached_data);
                                response = {
                                    "status": true,
                                    "message": "Capacity and Vulnerability is temporarily saved in the memory.\nPlease connect to the internet and sync your data."
                                }
                            } catch (err) {
                                response = {
                                    "status": false,
                                    "message": "Capacity and Vulnerability failed to save data to memory."
                                }
                            }
                            init(cached_data);
                            return response;
                        });
                    } else {
                        data['user_id'] = credentials['user_id']
                        response = await UmiRiskManagement.InsertFamilyRiskProfile(data)
                        fetchLatestData();
                    }
                   
                    if (response.status == true) {
                        ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
                        closeForm();
                        setCmd("add");
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
                        const isConnected = await NetworkUtils.isNetworkAvailable();
                        let response = null;
                        let temp_array = []
                        Object.keys(data).forEach(key => {
                            let temp = {};
                            switch(key) {
                                case 'NumberofMembers':
                                    temp["number_of_members"] = data[key]
                                    break;
                                case 'VulnerableGroups':
                                    temp["vulnerable_groups"] = data[key]
                                    break;
                                case 'NatureofVulnerability':
                                    temp["nature_of_vulnerability"] = data[key]
                                    break;
                                default:
                                    temp[key.replace(" ","_").toLocaleLowerCase()] = data[key]
                                    break;
                            }
                            if (key != 'attachment') {
                                temp_array.push(temp);
                            }
                        });
                        temp_array.push({'user_id': credentials['user_id']})
                        temp_array.push({'id': selectedData['id']})

                        if (isConnected != true) {
                            let temp = await MobileCaching.getItem("UmiFamilyRiskProfile").then(cached_data => {
                                let state_contaner = selectedData;
                                temp_array.forEach(element => {
                                    let key = Object.keys(element)[0];
                                    state_contaner[key] = element[key];
                                });
                                state_contaner['alterations'] = "update";
                                let index = cached_data.findIndex(x => x.id == selectedData['id']);
                                cached_data[index] = state_contaner;
                                try {
                                    MobileCaching.setItem("UmiFamilyRiskProfile", cached_data);
                                    response = {
                                        "status": true,
                                        "message": "Family Risk Profile is temporarily saved in the memory.\nPlease connect to the internet and sync your data."
                                    }
                                } catch (err) {
                                    response = {
                                        "status": false,
                                        "message": "Family Risk Profile failed to save data to memory."
                                    }
                                }
                                init(cached_data);
                            });
                        } else {
                            response = await UmiRiskManagement.UpdateFamilyRiskProfile(temp_array)
                            if (response.status == true) {
                                fetchLatestData();
                            }
                        }
                        ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
                        closeForm();
                        setCmd('add');
                    }, 300);
                });
            }
        }
    }

    const modifySummary = (data) => {
        setSelectedData(data)
        setDefaultStrValues({
            'Number of Members': data['number_of_members'],
            'Vulnerable Groups': data['vulnerable_groups'],
            'Nature of Vulnerability': data['nature_of_vulnerability']
        })
        setCmd('update')
        showForm();
    }

    const deleteForm = () => {
        Alert.alert(
            "Risk Assessment Family Risk Profile",
            "Are you sure you want to delete this data?",
            [
              {
                text: "Cancel",
                style: "cancel"
              },
              { text: "Confirm", onPress: () => {
                setTimeout(async ()=> {
                    let response = await UmiRiskManagement.DeleteFamilyRiskProfile({
                        'id': selectedData['id']
                    })
                    if (response.status == true) {
                        ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
                        init();
                        closeForm();
                    } else {
                        ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
                    }
                },300)
              }}
            ],
            { cancelable: false }
        );
    }

    return (
        <ScrollView>
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
                    <TouchableOpacity style={ButtonStyle.medium} onPress={() => { showForm() }}>
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
    )
}

export default FamilyRiskProfile;