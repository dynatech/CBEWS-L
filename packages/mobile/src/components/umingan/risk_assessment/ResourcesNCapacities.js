import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
import { DataTable } from 'react-native-paper';
import { ContainerStyle } from '../../../styles/container_style';
import { LabelStyle } from '../../../styles/label_style';
import { ButtonStyle } from '../../../styles/button_style';
import { UmiRiskManagement } from '@dynaslope/commons';
import Forms from '../../utils/Forms';
import MobileCaching from '../../../utils/MobileCaching';

function ResourcesNCapacities() {

    const [openModal, setOpenModal] = useState(false);
    const [dataTableContent, setDataTableContent] = useState([]);
    const [selectedData, setSelectedData] = useState({});
    const [cmd, setCmd] = useState('add');
    const [defaultStrValues, setDefaultStrValues] = useState({
        'Resource and Capacities': '',
        'Status': '',
        'Owner': ''
    });

    let formData = useRef();


    useEffect(() => {
        init();
    }, [])

    const init = async () => {
        let response = await UmiRiskManagement.GetAllResourceAndCapacities()
        if (response.status === true) {
            let temp = [];
            if (response.data.length != 0) {
                let row = response.data;
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
                        <Text>No available data.</Text>
                    </View>
                )
            }
            setDataTableContent(temp)
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
                    data['user_id'] = credentials['user_id']
                    let response = await UmiRiskManagement.InsertResourceAndCapacities(data)
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
                        Object.keys(data).forEach(key => {
                            let temp = {};
                            switch(key) {
                                case 'ResourceandCapacities':
                                    temp["resource_and_capacities"] = data[key]
                                    break;
                                default:
                                    temp[key.replace(" ","_").toLocaleLowerCase()] = data[key]
                                    break;
                            }
                            temp_array.push(temp);
                        });
                        temp_array.push({'user_id': credentials['user_id']})
                        temp_array.push({'id': selectedData['id']})
                        let response = await UmiRiskManagement.UpdateResourceAndCapacities(temp_array)
                        if (response.status == true) {
                            ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
                            init();
                            closeForm();
                            setCmd('add');
                        } else {
                            ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
                        }
                    }, 300);
                });
            }
        }
    }

    const modifySummary = (data) => {
        setSelectedData(data)
        setDefaultStrValues({
            'Resource and Capacities': data['resource_and_capacities'],
            'Status': data['status'],
            'owner': data['owner']
        })
        setCmd('update')
        showForm();
    }

    const deleteForm = () => {
        Alert.alert(
            "Risk Assessment Resource and Capacities",
            "Are you sure you want to delete this data?",
            [
              {
                text: "Cancel",
                style: "cancel"
              },
              { text: "Confirm", onPress: () => {
                setTimeout(async ()=> {
                    let response = await UmiRiskManagement.DeleteResourceAndCapacities({
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
                <Text style={[LabelStyle.large_label, LabelStyle.brand]}>Resource and Capacities</Text>
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
                    <TouchableOpacity style={ButtonStyle.medium} onPress={() => { showForm() }}>
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
    )
}

export default ResourcesNCapacities;