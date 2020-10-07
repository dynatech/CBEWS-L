import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
import { MarGroundData } from '@dynaslope/commons';
import { DataTable } from 'react-native-paper';
import { ContainerStyle } from '../../../styles/container_style';
import { LabelStyle } from '../../../styles/label_style';
import { ButtonStyle } from '../../../styles/button_style';
import Forms from '../../utils/Forms';
import NetworkUtils from '../../../utils/NetworkUtils';
import MobileCaching from '../../../utils/MobileCaching';

function SurficialMarkers() {

    let formData = useRef();
    const [openModal, setOpenModal] = useState(false);
    const [surficialData, setSurficialData] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [dataTableHeaders, setDataTableHeaders] = useState([]);
    const [dataTableContent, setDataTableContent] = useState([]);
    const [selectedData, setSelectedData] = useState({});
    const [cmd, setCmd] = useState('add');
    const [defaultStrValues, setDefaultStrValues] = useState({});

    useEffect(() => {
        setTimeout( async ()=> {
            const isConnected = await NetworkUtils.isNetworkAvailable()
            if (isConnected != true) {
                MobileCaching.getItem('MarSurficialData').then(data => {
                    MobileCaching.getItem('MarSurficialDataMarkers').then(markers => {
                        init(data, markers);
                    });
                });
            } else {
                fetchLatestData();
            }
          },100);
    }, [])

    const init = async (data, markers) => {
        let temp = [];
        let temp_headers = [];
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

            if (data.length != 0) {
                data.forEach(element => {
                    let temp_data = element[Object.keys(element)[0]];
                    let temp_marker_value_container = [];
                    
                    for (const [key, value] of Object.entries(temp_data)) {
                        if (key != 'observer' && key != 'ts' && key != 'weather' && key != 'alterations') {
                            temp_marker_value_container.push(<DataTable.Cell key={`${key}_${value}`} style={{width: 75}}>{value}</DataTable.Cell>);
                        }
                    }
                    
                    temp.push(
                        <DataTable.Row key={Object.keys(element)[0]} onPress={() => { modifySummary(element) }}>
                            <DataTable.Cell style={{width: 150}}>{temp_data.ts}</DataTable.Cell>
                                { temp_marker_value_container }
                            <DataTable.Cell style={{width: 150}}>{temp_data.weather}</DataTable.Cell>
                            <DataTable.Cell style={{width: 150}}>{temp_data.observer}</DataTable.Cell>
                        </DataTable.Row>
                    )
                });
            } else {
                temp.push(
                    <View key={0} style={{padding: 10}}>
                        <Text>No available data.</Text>
                    </View>
                )
            }
            setDataTableHeaders(temp_headers)
            setDataTableContent(temp)
            setSurficialData(data);
            setMarkers(markers)
            setDefaultStrValues(temp_default_fields);
        } else {
            // Display error
        }

    }

    const showForm = () => {
        setOpenModal(true);
    }

    const closeForm = () => {
        setOpenModal(false);
    }

    const deleteForm = () => {
        Alert.alert(
            "Surficial Markers",
            "Are you sure you want to delete this data?",
            [
              {
                text: "Cancel",
                style: "cancel"
              },
              { text: "Confirm", onPress: () => {
                setTimeout(async ()=> {
                    const isConnected = await NetworkUtils.isNetworkAvailable();
                    if (isConnected != true) {
                        ToastAndroid.showWithGravity("Cannot delete data when offline.\nPlease connect to internet or CBEWS-L Network to proceed.", ToastAndroid.LONG, ToastAndroid.CENTER)
                    } else {
                        let response = await MarGroundData.DeleteSurficialMarkersData({
                            "observer": selectedData['observer'],
                            "site_id": "29",
                            "ts": selectedData['ts'],
                            "weather": selectedData['weather']
                         })

                        if (response.status == true) {
                            ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
                            fetchLatestData();
                            closeForm();
                        } else {
                            ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
                        }
                    }
                },300)
              }}
            ],
            { cancelable: false }
        );
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

    const submitForm = async () => {
        let data = formData.current;
        if (!Object.keys(selectedData).length) {
            MobileCaching.getItem('user_credentials').then(credentials => {
                setTimeout(async () => {
                    const isConnected = await NetworkUtils.isNetworkAvailable();
                    let response = null;
                    let marker_value = {};

                    for (const [key, value] of Object.entries(data)) {
                        if (key != 'Observer/Nagsukat' && key != 'Observancetimestamp' 
                            && key != 'Weather' && key != 'attachment') {
                            marker_value[key] = value;
                        }
                    }

                    let temp = {
                        "observer": data['Observer/Nagsukat'],
                        "ts": data['Observancetimestamp'],
                        "weather": data['Weather'],
                        "site_id": 29,
                        marker_value
                    }

                    if (isConnected != true) {
                        let cached = await MobileCaching.getItem("MarSurficialData").then(cached_data => {
                            let surficial_obj = {};

                            surficial_obj[temp['ts']] = {
                                ...temp['marker_value'],
                                'observer': temp['observer'],
                                'weather': temp['weather'],
                                'ts': temp['ts'],
                                'alterations': 'add'
                            }

                            cached_data.push(surficial_obj);

                            try {
                                MobileCaching.setItem("MarSurficialData", cached_data);
                                // OPEN MESSAGING APP TO SEND MANUALLY
                                response = {
                                    "status": true,
                                    "message": "Surficial Data is temporarily saved in the memory.\nPlease connect to the internet and sync your data."
                                }
                            } catch (err) {
                                response = {
                                    "status": false,
                                    "message": "Surficial Data failed to save data to memory."
                                }
                            }
                            MobileCaching.getItem('MarSurficialDataMarkers').then(markers => {
                                init(cached_data, markers);
                            });
                            return response;
                        });
                    } else {
                        response = await MarGroundData.InsertSurficialMarkersData(temp)
                        fetchLatestData();
                    }
                    if (response.status == true) {
                        ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
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
                        const isConnected = await NetworkUtils.isNetworkAvailable();
                        let response = {};
                        let temp = {};
                        Object.keys(data).forEach(key => {
                            switch(key) {
                                case 'Observer/Nagsukat':
                                    temp['observer'] = data['Observer/Nagsukat']
                                    break;
                                case 'Weather':
                                    temp['weather'] = data['Weather']
                                    break;
                                case 'Observancetimestamp':
                                    temp['new_ts'] = data['Observancetimestamp']
                                    break;
                                case 'attachment':
                                    console.log('Attachment not availble for ground data');
                                    break;
                                default:
                                    temp['marker_values'] = {...temp['marker_values'], [key]: data[key]}
                                    break;
                            }
                        });

                        if (isConnected != true) {
                            let temp_data = await MobileCaching.getItem("MarSurficialData").then(cached_data => {

                                let temp_state = selectedData;

                                if (temp['marker_values'] == undefined) {
                                    temp_state = {
                                        ...temp_state,
                                        ...temp,
                                    }
                                } else {
                                    let mv = {...temp['marker_values']}
                                    temp_state = {
                                        ...temp_state,
                                        ...mv
                                    }

                                    temp['marker_values'] = undefined;
                                    
                                    temp_state = {
                                        ...temp_state,
                                        ...temp,
                                    }
                                }

                                let temp_proc = {}

                                let index = cached_data.findIndex(x=> x[temp_state['ts']].ts == temp_state['ts']);
                                temp_proc[temp_state['ts']] = temp_state;
                                cached_data[index] = temp_proc

                                alert(JSON.stringify(cached_data));

                                try {
                                    MobileCaching.setItem("MarSurficialData", cached_data);
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
                                // OPEN MESSAGING APP TO UPDATE
                                MobileCaching.getItem('MarSurficialDataMarkers').then(markers => {
                                    init(cached_data, markers);
                                });
                                return response
                            });
                        } else {
                            temp['site_id'] = credentials['site_id'];
                            temp['ref_ts'] = selectedData['ts'];
                            response = await MarGroundData.UpdateSurficialMarkerData(temp);
                            if (response.status == true) {
                                fetchLatestData();
                            }
                        }

                        closeForm();
                        setCmd('add');
                        ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
                    }, 300);
                });
            }
        }
    }

    const fetchLatestData = async () => {
        let response = await MarGroundData.GetSurficialMarkersData();
        if (response.status == true) {
            init(response.data, response.markers);
            MobileCaching.setItem('MarSurficialData', response.data);
            MobileCaching.setItem('MarSurficialDataMarkers', response.markers);
        } else {
            ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
        }
    }

    return(
        <ScrollView>
            <View style={ContainerStyle.content}>
                <Text style={[LabelStyle.large_label, LabelStyle.brand]}>Surficial Data</Text>
                <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Add / Modify / Surficial data</Text>
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
                        page={1}
                        numberOfPages={3}
                        onPageChange={(page) => { console.log(page); }}
                        label="1-2 of 6"
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

export default SurficialMarkers