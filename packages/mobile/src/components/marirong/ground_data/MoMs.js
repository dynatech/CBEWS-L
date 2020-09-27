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

function MoMs() {

    const [openModal, setOpenModal] = useState(false);
    const [momsData, setMomsData] = useState([]);
    const [dataTableContent, setDataTableContent] = useState([]);
    const [featureTypeList, setFeatureTypeList] = useState([]);
    const [selectedData, setSelectedData] = useState({});
    const [cmd, setCmd] = useState('add');
    const [defaultStrValues, setDefaultStrValues] = useState({});

    let formData = useRef();
    let feature_types = useRef();

    useEffect(() => {
        setTimeout( async ()=> {
            const isConnected = await NetworkUtils.isNetworkAvailable()
            if (isConnected != true) {
              Alert.alert(
                'CBEWS-L is not connected to the internet',
                'CBEWS-L Local data will be used.',
                [
                  { text: 'Ok', onPress: () => {
                    MobileCaching.getItem('MarMoMs').then(response => {
                        // init(response);
                    });
                  }, style: 'cancel' },
                ]
              )
            } else {
                fetchLatestData();
            }
          },100);
    }, [])

    const init = async (data) => {
        let temp = [];
        if (data.length != 0) {
            data.forEach(element => {
                temp.push(
                    <DataTable.Row key={element.moms_id} onPress={() => { modifySummary(element) }}>
                        <DataTable.Cell style={{width: 150}}>{element.observance_ts}</DataTable.Cell>
                        <DataTable.Cell style={{width: 100}}>{element.feature_type}</DataTable.Cell>
                        <DataTable.Cell style={{width: 150}}>{element.reporter}</DataTable.Cell>
                        <DataTable.Cell style={{width: 150}}>{element.description}</DataTable.Cell>
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
        setMomsData(data);
}

    const showForm = () => {
        setOpenModal(true);
    }

    const closeForm = () => {
        setOpenModal(false);
    }

    const modifySummary = (data) => {
        let temp_types = feature_types.current;
        temp_types.push({default_val: data['feature_type']})
        setSelectedData(data);
        setDefaultStrValues({
            "Observance timestamp": data['observance_ts'],
            "Feature Type": temp_types,
            "Feature Name": data['feature_name'],
            "Reporter": data['reporter'],
            "Description": data['description'],
            "Alert Level": [0,1,2,3, {default_val: data['op_trigger']}],
            "Location": data['location'],
            "Remarks": data['remarks'],
            "Validator": data['validator'],
        })
        setCmd('update')
        showForm();
    }

    const fetchLatestData = async () => {
        try {
            let features = await MarGroundData.FetchMoMSFeatures();
            let response = await MarGroundData.GetMOMSData();

            if (response.status == true) {
                setDefaultStrValues({
                    "Observance timestamp": "",
                    "Feature Type": features.data,
                    "Feature Name": "",
                    "Reporter": "",
                    "Description": "",
                    "Alert Level": [0,1,2,3],
                    "Location": "",
                    "Remarks": "",
                    "Reporter": "",
                    "Validator": "",
                });
                MobileCaching.setItem('MarMoMs', response.data);
                feature_types.current = features.data;
                init(response.data);
            } else {
                ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
            }
        } catch(err){
            alert(JSON.stringify(err))
        }
    }

    const submitForm = () => {
        let data = formData.current;
        if (!Object.keys(selectedData).length) {
            MobileCaching.getItem('user_credentials').then(credentials => {
                setTimeout(async () => {
                    const isConnected = await NetworkUtils.isNetworkAvailable();
                    let response = null;
                    if (isConnected != true) {
                        // let temp = await MobileCaching.getItem("MarCapacityAndVulnerability").then(cached_data => {
                        //     cached_data.push({
                        //         'id': 0,
                        //         'date': data['Datetime'],
                        //         'incharge': data['Incharge'],
                        //         'last_ts': null,
                        //         'owner': data['Owner'],
                        //         'quantity': data['Quantity'],
                        //         'resource': data['Resource'],
                        //         'stat_desc': data['Status'],
                        //         'updater': data['Updater'],
                        //         'user_id': credentials['user_id'],
                        //         'alterations': 'add'
                        //     });
                        //     try {
                        //         MobileCaching.setItem("MarCapacityAndVulnerability", cached_data);
                        //         response = {
                        //             "status": true,
                        //             "message": "Capacity and Vulnerability is temporarily saved in the memory.\nPlease connect to the internet and sync your data."
                        //         }
                        //     } catch (err) {
                        //         response = {
                        //             "status": false,
                        //             "message": "Capacity and Vulnerability failed to save data to memory."
                        //         }
                        //     }
                        //     init(cached_data);
                        //     return response;
                        // });
                    } else {
                        let moms_data = {
                            "alert_level": data['AlertLevel'],
                            "feature_name": data['FeatureName'],
                            "feature_type": data['FeatureType'],
                            "location": data['Location'],
                            "remarks": data['Remarks'],
                            "reporter": data['Reporter'],
                            "site_id": credentials['site_id'],
                            "ts": data['Observancetimestamp'],
                            "user_id": credentials['user_id']
                        }
                        response = await MarGroundData.InsertMOMSData(moms_data)
                    }
                    if (response.status == true) {
                        ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
                        fetchLatestData();
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
                        let temp_array = [];
                        let temp = selectedData;

                        alert(JSON.stringify(selectedData));

                        let moms_data = {
                            "alert_level": data['AlertLevel'],
                            "feature_name": data['FeatureName'],
                            "feature_type": data['FeatureType'],
                            "location": data['Location'],
                            "remarks": data['Remarks'],
                            "reporter": data['Reporter'],
                            "site_id": credentials['site_id'],
                            "ts": data['Observancetimestamp'],
                            "user_id": credentials['user_id']
                        }

                        
                        Object.keys(data).forEach(key => {
                            switch(key) {
                                case 'Observancetimestamp':
                                    temp = {...temp, ts: data[key]}
                                    break;
                                case 'FeatureName':
                                    temp = {...temp, feature_name: data[key]}
                                    break;
                                case 'FeatureType':
                                    temp = {...temp, feature_type: data[key]}
                                    break;
                                case 'attachment':
                                    console.log('Attachment not availble for MoMs');
                                    break;
                                case 'Validator':
                                    temp = {...temp, user_id: credentials['user_id']}
                                    break;
                                default:
                                    temp = {...temp, [key.replace(" ","_").toLocaleLowerCase()]: data[key]}
                                    break;
                            }
                        });
                        temp = {...temp, site_id: credentials['site_id']};

                        alert(JSON.stringify(temp));

                        // if (isConnected != true) {
                        //     let temp = await MobileCaching.getItem("MarCapacityAndVulnerability").then(cached_data => {
                        //         let response = null;
                        //         let state_contaner = selectedData;
                        //         temp_array.forEach(element => {
                        //             let key = Object.keys(element)[0];
                        //             state_contaner[key] = element[key];
                        //         });
                        //         state_contaner['alterations'] = "update";
                        //         let index = cached_data.findIndex(x => x.id == selectedData['id']);
                        //         cached_data[index] = state_contaner;
                        //         try {
                        //             MobileCaching.setItem("MarCapacityAndVulnerability", cached_data);
                        //             response = {
                        //                 "status": true,
                        //                 "message": "Capacity and Vulnerability is temporarily saved in the memory.\nPlease connect to the internet and sync your data."
                        //             }
                        //         } catch (err) {
                        //             response = {
                        //                 "status": false,
                        //                 "message": "Capacity and Vulnerability failed to save data to memory."
                        //             }
                        //         }
                        //         init(cached_data);
                        //     });
                        // } else {
                        //     let response = await MarCommunityRiskAssessment.UpdateCapacityAndVulnerability(temp_array)
                        //     if (response.status == true) {
                        //         fetchLatestData();
                        //     }
                        // }
                        // closeForm();
                        // setCmd('add');
                        // ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
                    }, 300);
                });
            }
        }
    }

    return(
        <ScrollView>
            <View style={ContainerStyle.content}>
                <Text style={[LabelStyle.large_label, LabelStyle.brand]}>Manifestation of Movements</Text>
                <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Add / Modify / MoMs data</Text>
                <View style={ContainerStyle.datatable_content}>
                    <ScrollView horizontal={true}>
                        <DataTable style={{ flex: 1, padding: 10}}>
                            <DataTable.Header>
                                <DataTable.Title style={{width: 150}}>Observance Timestamp</DataTable.Title>
                                <DataTable.Title style={{width: 100}}>Feature type</DataTable.Title>
                                <DataTable.Title style={{width: 150}}>Reporter</DataTable.Title>
                                <DataTable.Title style={{width: 150}}>Description</DataTable.Title>
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
                    setDefaultStrValues({
                        "Observance timestamp": "",
                        "Feature Type": feature_types.current,
                        "Feature Name": "",
                        "Reporter": "",
                        "Description": "",
                        "Alert Level": [0,1,2,3],
                        "Location": "",
                        "Remarks": "",
                        "Reporter": "",
                        "Validator": "",
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

export default MoMs