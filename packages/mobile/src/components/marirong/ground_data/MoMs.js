import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
import { MarGroundData } from '@dynaslope/commons';
import { DataTable } from 'react-native-paper';
import { ContainerStyle } from '../../../styles/container_style';
import { LabelStyle } from '../../../styles/label_style';
import { ButtonStyle } from '../../../styles/button_style';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-community/picker';
import { Formik } from 'formik';
import { Input } from 'react-native-elements';
import NetworkUtils from '../../../utils/NetworkUtils';
import MobileCaching from '../../../utils/MobileCaching';
import moment from 'moment';

function MoMs() {

    const [openModal, setOpenModal] = useState(false);
    const [openFeatureType, setOpenFeatureType] = useState(false);
    const [openFeatureName, setOpenFeatureName] = useState(false);

    const [momsData, setMomsData] = useState([]);
    const [featureData, setFeatureData] = useState([]);
    const [featureNameData, setFeatureNameData] = useState([]);

    const [obsTs, setObsTS] = useState([]);
    const [observanceTs, setObservanceTS] = useState((new Date()));
    const [dataTableContent, setDataTableContent] = useState([]);

    const [selectedData, setSelectedData] = useState({});
    const [cmd, setCmd] = useState('add');
    const [defaultFeatureType, setDefaultFeatureType] = useState({
        "feature_type": "",
        "description": ""
    });
    const [defaultFeatureName, setDefaultFeatureName] = useState({
        "feature_type": "",
        "feature_name": "",
        "location": "",
        "reporter": ""
    });
    const [defaultStrValues, setDefaultStrValues] = useState({
        "ts": "",
        "feature_type": "",
        "feature_name": "",
        "reporter": "",
        "description": "",
        "alert_level": "",
        "location": "",
        "remarks": "",
        "validator": "",
    });

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
        // let temp_types = feature_types.current;
        // temp_types.push({default_val: data['feature_type']})
        // setSelectedData(data);
        // setDefaultStrValues({
        //     "Observance timestamp": data['observance_ts'],
        //     "Feature Type": temp_types,
        //     "Feature Name": data['feature_name'],
        //     "Reporter": data['reporter'],
        //     "Description": data['description'],
        //     "Alert Level": [0,1,2,3, {default_val: data['op_trigger']}],
        //     "Location": data['location'],
        //     "Remarks": data['remarks'],
        //     "Validator": data['validator'],
        // })
        // setCmd('update')
        // showForm();
    }

    const showDatePicker = (entity, selectedDate) => {
        setObsTS(
            <DateTimePicker
                value={observanceTs}
                mode={'datetime'}
                display="default"
                onChange={(i,v)=> {
                    setObservanceTS(v);
                }}
            />
        )
    }

    const fetchLatestData = async () => {
        try {
            let features = await MarGroundData.FetchMoMSFeatures();
            let names = await MarGroundData.GetMomsInstancesPerSite('29'); // leave this for now
            let response = await MarGroundData.GetMOMSData();

            alert(JSON.stringify(names));
            if (response.status == true) {
                // setDefaultStrValues({
                //     "Observance timestamp": "",
                //     "Feature Type": features.data,
                //     "Feature Name": "",
                //     "Reporter": "",
                //     "Description": "",
                //     "Alert Level": [0,1,2,3],
                //     "Location": "",
                //     "Remarks": "",
                //     "Reporter": "",
                //     "Validator": "",
                // });
                MobileCaching.setItem('MarMoMs', response.data);
                MobileCaching.setItem('MarMomsFeatures', features.data);

                feature_types.current = features.data;
                init(response.data);
                setFeatureData(features.data);
                // setFeatureNameData(null);
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

    const openFeatureTypeCreator = () => {
        setOpenFeatureType(true);
    }

    const openFeatureNameCreator = () => {
        setOpenFeatureName(true);
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
                    setCmd('add');
                    setOpenModal(false);
                }}>
                <ScrollView style={[ContainerStyle.content]}>
                    <Formik
                        initialValues={defaultStrValues}
                        onSubmit={values => {
                            alert(JSON.stringify(values));
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values }) => (
                            <View style={{ alignItems: 'center', flex: 1, paddingTop: 20 }}>
                                <Input 
                                    key={"ts"}
                                    name={"ts"}
                                    label={"Observance Timestamp"}
                                    defaultValue={moment(observanceTs).format("YYYY-MM-DD HH:mm:ss")}
                                    containerStyle={{ width: '80%', borderColor: '#f5981c' }}
                                    inputStyle={{ textAlign: 'center', padding: 0 }}
                                    onFocus={showDatePicker} />
                                <Text style={{width: '80%', paddingLeft: 10, fontSize: 16, fontWeight: 'bold', color: '#86939e'}} >Feature Type</Text>
                                <View style={{borderColor: '#86939e', borderBottomWidth: 1, width: '75%'}}>
                                    <Picker
                                        selectedValue={defaultStrValues.feature_type}
                                        style={{height: 50, width: '100%'}}
                                        onValueChange={(itemValue, itemIndex) =>
                                            setDefaultStrValues({...defaultStrValues, feature_type: itemValue})
                                        }>
                                            {
                                                featureData.map((element)=> {
                                                    return <Picker.Item key={element.feature_type} label={element.feature_type} value={element.feature_type} />
                                                })
                                            }
                                    </Picker>
                                </View>
                                <View style={{ alignItems: 'center', marginBottom: 10 }}>
                                    <Text style={[LabelStyle.medium_label, { textAlign: 'center', color: "blue" }]} onPress={openFeatureTypeCreator}>New feature type? Click here!</Text>
                                </View>
                                <Input
                                    key={"feature_name"}
                                    name={"feature_name"}
                                    label={"Feature Name"}
                                    defaultValue={""}
                                    containerStyle={{ width: '80%', borderColor: '#f5981c' }}
                                    inputStyle={{ textAlign: 'center', padding: 0 }}
                                    onChangeText={handleChange('feature_name')} />
                                <View style={{ alignItems: 'center', marginTop: -20, marginBottom: 10}}>
                                    <Text style={[LabelStyle.medium_label, { textAlign: 'center', color: "blue" }]} onPress={openFeatureNameCreator}>New feature name? Click here!</Text>
                                </View>
                                <Input 
                                    key={"alert_level"}
                                    name={"alert_level"}
                                    label={"Alert Level"}
                                    defaultValue={""}
                                    containerStyle={{ width: '80%', borderColor: '#f5981c' }}
                                    inputStyle={{ textAlign: 'center', padding: 0 }}
                                    onChangeText={handleChange('alert_level')} />
                                <Input 
                                    key={"location"}
                                    name={"location"}
                                    label={"Location"}
                                    defaultValue={""}
                                    containerStyle={{ width: '80%', borderColor: '#f5981c' }}
                                    inputStyle={{ textAlign: 'center', padding: 0 }}
                                    onChangeText={handleChange('location')} />
                                <Input 
                                    key={"description"}
                                    name={"description"}
                                    label={"Description"}
                                    defaultValue={""}
                                    containerStyle={{ width: '80%', borderColor: '#f5981c' }}
                                    inputStyle={{ textAlign: 'center', padding: 0 }}
                                    onChangeText={handleChange('description')} />
                                <Input 
                                    key={"reporter"}
                                    name={"reporter"}
                                    label={"Reporter(s)"}
                                    defaultValue={""}
                                    containerStyle={{ width: '80%', borderColor: '#f5981c' }}
                                    inputStyle={{ textAlign: 'center', padding: 0 }}
                                    onChangeText={handleChange('reporter')} />
                                <Input 
                                    key={"validator"}
                                    name={"validator"}
                                    label={"Validator(s)"}
                                    defaultValue={""}
                                    containerStyle={{ width: '80%', borderColor: '#f5981c' }}
                                    inputStyle={{ textAlign: 'center', padding: 0 }}
                                    onChangeText={handleChange('validator')} />
                                <Input 
                                    key={"remarks"}
                                    name={"remarks"}
                                    label={"Remarks"}
                                    defaultValue={""}
                                    containerStyle={{ width: '80%', borderColor: '#f5981c' }}
                                    inputStyle={{ textAlign: 'center', padding: 0 }}
                                    onChangeText={handleChange('remarks')} />
                                <View style={{ alignItems: 'center', paddingTop: 25, paddingBottom: 25 }}>
                                    <Text style={[LabelStyle.small_label, { textAlign: 'center' }]}>* All fields are required</Text>
                                    <Text style={[LabelStyle.small_label, { textAlign: 'center' }]}>* Please review your details before submitting</Text>
                                </View>
                                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                    <TouchableOpacity style={ButtonStyle.small} onPress={handleSubmit}>
                                        <Text style={ButtonStyle.medium_text}>Submit</Text>
                                    </TouchableOpacity>
                                    {
                                        cmd != "add" &&
                                        <TouchableOpacity style={ButtonStyle.small} onPress={(deleteForm)}>
                                            <Text style={ButtonStyle.medium_text}>Delete</Text>
                                        </TouchableOpacity>
                                    }
                                </View>
                            </View>
                        )}
                    </Formik>
                </ScrollView>
            </Modal>

            <Modal animationType="slide"
                visible={openFeatureType}
                onRequestClose={() => { 
                    setCmd('add');
                    setOpenFeatureType(false);
                }}>
                <ScrollView style={[ContainerStyle.content]}>
                    <Formik
                        initialValues={defaultFeatureType}
                        onSubmit={values => {
                            alert(JSON.stringify(values));
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values }) => (
                            <View style={{ alignItems: 'center', flex: 1, paddingTop: 20 }}>
                                <Input 
                                    key={"feature_type"}
                                    name={"feature_type"}
                                    label={"Feature Type"}
                                    defaultValue={""}
                                    containerStyle={{ width: '80%', borderColor: '#f5981c' }}
                                    inputStyle={{ textAlign: 'center', padding: 0 }}
                                    onChangeText={handleChange('feature_type')} />
                                <Input 
                                    key={"description"}
                                    name={"description"}
                                    label={"Description"}
                                    defaultValue={""}
                                    containerStyle={{ width: '80%', borderColor: '#f5981c' }}
                                    inputStyle={{ textAlign: 'center', padding: 0 }}
                                    onChangeText={handleChange('description')} />
                                <View style={{ alignItems: 'center', paddingTop: 25, paddingBottom: 25 }}>
                                    <Text style={[LabelStyle.small_label, { textAlign: 'center' }]}>* All fields are required</Text>
                                    <Text style={[LabelStyle.small_label, { textAlign: 'center' }]}>* Please review your details before submitting</Text>
                                </View>
                                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                    <TouchableOpacity style={ButtonStyle.small} onPress={handleSubmit}>
                                        <Text style={ButtonStyle.medium_text}>Submit</Text>
                                    </TouchableOpacity>
                                    {
                                        cmd != "add" &&
                                        <TouchableOpacity style={ButtonStyle.small} onPress={(deleteForm)}>
                                            <Text style={ButtonStyle.medium_text}>Delete</Text>
                                        </TouchableOpacity>
                                    }
                                </View>
                            </View>
                        )}
                    </Formik>
                </ScrollView>
            </Modal>

            <Modal animationType="slide"
                visible={openFeatureName}
                onRequestClose={() => { 
                    setCmd('add');
                    setOpenFeatureName(false);
                }}>
                <ScrollView style={[ContainerStyle.content]}>
                    <Formik
                        initialValues={defaultFeatureName}
                        onSubmit={values => {
                            alert(JSON.stringify(values));
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values }) => (
                            <View style={{ alignItems: 'center', flex: 1, paddingTop: 20 }}>
                                <Input 
                                    key={"feature_type"}
                                    name={"feature_type"}
                                    label={"Feature Type"}
                                    defaultValue={""}
                                    containerStyle={{ width: '80%', borderColor: '#f5981c' }}
                                    inputStyle={{ textAlign: 'center', padding: 0 }}
                                    onChangeText={handleChange('feature_type')} />
                                <Input 
                                    key={"feature_name"}
                                    name={"feature_name"}
                                    label={"Feature Name"}
                                    defaultValue={""}
                                    containerStyle={{ width: '80%', borderColor: '#f5981c' }}
                                    inputStyle={{ textAlign: 'center', padding: 0 }}
                                    onChangeText={handleChange('ts')} />
                                <Input 
                                    key={"location"}
                                    name={"location"}
                                    label={"Location"}
                                    defaultValue={""}
                                    containerStyle={{ width: '80%', borderColor: '#f5981c' }}
                                    inputStyle={{ textAlign: 'center', padding: 0 }}
                                    onChangeText={handleChange('ts')} />
                                <Input 
                                    key={"reporter"}
                                    name={"reporter"}
                                    label={"Reporter"}
                                    defaultValue={""}
                                    containerStyle={{ width: '80%', borderColor: '#f5981c' }}
                                    inputStyle={{ textAlign: 'center', padding: 0 }}
                                    onChangeText={handleChange('ts')} />
                                <View style={{ alignItems: 'center', paddingTop: 25, paddingBottom: 25 }}>
                                    <Text style={[LabelStyle.small_label, { textAlign: 'center' }]}>* All fields are required</Text>
                                    <Text style={[LabelStyle.small_label, { textAlign: 'center' }]}>* Please review your details before submitting</Text>
                                </View>
                                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                    <TouchableOpacity style={ButtonStyle.small} onPress={handleSubmit}>
                                        <Text style={ButtonStyle.medium_text}>Submit</Text>
                                    </TouchableOpacity>
                                    {
                                        cmd != "add" &&
                                        <TouchableOpacity style={ButtonStyle.small} onPress={(deleteForm)}>
                                            <Text style={ButtonStyle.medium_text}>Delete</Text>
                                        </TouchableOpacity>
                                    }
                                </View>
                            </View>
                        )}
                    </Formik>
                </ScrollView>
            </Modal>

            { obsTs }

        </ScrollView>
    )
}

export default MoMs