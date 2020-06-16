import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, ToastAndroid } from 'react-native';
import { DataTable } from 'react-native-paper';
import { ContainerStyle } from '../../../styles/container_style';
import { LabelStyle } from '../../../styles/label_style';
import { ButtonStyle } from '../../../styles/button_style';
import { MarMaintenanceLogs } from '@dynaslope/commons';
import { Calendar } from 'react-native-calendars';
import Forms from '../../utils/Forms';
import MobileCaching from '../../../utils/MobileCaching';

function MaintenanceLogs () {

    const [openModal, setOpenModal] = useState(false);
    const [maintenanceLogs, setMaintenanceLogs] = useState([]);
    const [dataTableContent, setDataTableContent] = useState([]);
    const [dataContainer, setDataContainer] = useState([]);
    const [selectedData, setSelectedData] = useState({});
    const [cmd, setCmd] = useState('add');
    const [markedDates, setMarkedDates] = useState({});
    const [defaultStrValues, setDefaultStrValues] = useState({
        'Maintenance Activity': '',
        'Maintenance date': '',
        'Remarks': '',
        'In-charge': '',
        'Updater': ''
    });

    let formData = useRef();

    useEffect(() => {
        init();
    }, [])

    const init = async () => {
        let response = await MarMaintenanceLogs.GetMaintenanceLogs()
        if (response.status === true) {
            let temp = {};
            response.data.forEach(element => {
                temp[element.maintenance_date] = {
                    selected: true
                }
            });
            setMaintenanceLogs(response.data);
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
                setTimeout(async () => {
                    data['user_id'] = credentials['user_id']
                    let response = await MarMaintenanceLogs.InsertMaintenanceLogs(data)
                    console.log(response)
                    // if (response.status == true) {
                    //     ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
                    //     init();
                    //     closeForm();
                    // } else {
                    //     ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
                    // }
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
                            temp[key.replace(" ","_").toLocaleLowerCase()] = data[key]
                            temp_array.push(temp);
                        });
                        temp_array.push({'user_id': credentials['user_id']})
                        temp_array.push({'cav_id': selectedData['cav_id']})
                        // let response = await MarCommunityRiskAssessment.SubmitCapacityAndVulnerability(cmd,temp_array)
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
            'Maintenance Activity': data['type'],
            'Remarks': `${data['remarks']}`,
            'In-charge': data['in_charge'],
            'Updater': data['updater']
        })
        setCmd('update')
        showForm();
    }

    const deleteForm = () => {
        Alert.alert(
            "Capacity and Vulnerability",
            "Are you sure you want to delete this data?",
            [
              {
                text: "Cancel",
                style: "cancel"
              },
              { text: "Confirm", onPress: () => {
                setTimeout(async ()=> {
                    let response = await MarCommunityRiskAssessment.DeleteCapacityAndVulnerability({
                        'cav_id': selectedData['cav_id']
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

    const showDatatable = (day) => {
        console.log("selected date:",day);
        console.log("container date:", maintenanceLogs);
        let maintenance_temp = maintenanceLogs.filter(x => x.maintenance_date === day.dateString);
        if (maintenance_temp.length != 0) {
            let temp = [];
            maintenance_temp.forEach(element => {
                temp.push(
                    <DataTable.Row key={element.id} onPress={() => { modifySummary(element) }}>
                        <DataTable.Cell>{element.type}</DataTable.Cell>
                        <DataTable.Cell>{element.in_charge}</DataTable.Cell>
                        <DataTable.Cell>{element.updater}</DataTable.Cell>
                    </DataTable.Row>
                )
            });
            setDataTableContent(temp);
            setDataContainer(
                <View style={[ContainerStyle.datatable_content, {paddingTop: 20}]}>
                    <ScrollView horizontal={true}>
                        <DataTable style={{ width: 500, padding: 10 }}>
                            <DataTable.Header>
                                <DataTable.Title>Maintenance Activity</DataTable.Title>
                                <DataTable.Title>In-charge</DataTable.Title>
                                <DataTable.Title>Updater</DataTable.Title>
                            </DataTable.Header>
                            { dataTableContent }
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
    }

    return(
        <ScrollView>
            <View style={ContainerStyle.content}>
                <Text style={[LabelStyle.large_label, LabelStyle.brand]}>Maintenance Logs</Text>
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
                    setDefaultStrValues({
                        'Maintenance Activity': '',
                        'Remarks': '',
                        'In-charge': '',
                        'Updater': ''
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

export default MaintenanceLogs;