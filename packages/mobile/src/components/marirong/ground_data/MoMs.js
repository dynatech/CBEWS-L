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
    // const [featureNameData, setFeatureNameData] = useState([]);
    const [fnContainer, setFnContainer] = useState([]);

    const [obsTs, setObsTS] = useState([]);
    const [observanceTs, setObservanceTS] = useState((new Date()));
    const [dataTableContent, setDataTableContent] = useState([]);

    const [selectedData, setSelectedData] = useState({});
    const [selectedFeatureType, setSelectedFeatureType] = useState();
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
        "ts": moment(observanceTs).format("YYYY-MM-DD HH:mm:ss"),
        "feature_id": "",
        "instance_id": "",
        "reporter": "",
        "description": "",
        "alert_level": ""
    });

    let featureNameData = useRef([]);
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
    }, []);

    const init = async (data) => {
        let temp = [];
        if (data.length != 0) {
            data.forEach(element => {
                temp.push(
                    <DataTable.Row key={element.moms_id} onPress={() => { modifySummary(element) }}>
                        <DataTable.Cell style={{width: 150}}>{element.observance_ts}</DataTable.Cell>
                        <DataTable.Cell style={{width: 100}}>{element.feature_type}</DataTable.Cell>
                        <DataTable.Cell style={{width: 150}}>{element.moms_reporter}</DataTable.Cell>
                        <DataTable.Cell style={{width: 150}}>{element.remarks}</DataTable.Cell>
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
        setCmd('update');
        setSelectedData(data);
        setDefaultStrValues({
            "ts": moment(data.observance_ts).format("YYYY-MM-DD HH:mm:ss"),
            "feature_id": data.feature_id,
            "instance_id": data.instance_id,
            "reporter": data.reporter,
            "remarks": data.remarks,
            "alert_level": data.op_trigger
        });
        setFnContainer(featureNameData.current[data.feature_id])
        showForm();
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

            if (response.status == true) {

                MobileCaching.setItem('MarMoMs', response.data);
                MobileCaching.setItem('MarMomsFeatures', features.data);

                feature_types.current = features.data;
                init(response.data);
                setFeatureData(features.data);
                featureNameData.current = names;
            } else {
                ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
            }
        } catch(err){
            alert(JSON.stringify(err))
        }
    }

    const submitForm = (data) => {
        if (cmd == "add") {
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
                            "alert_level": data.alert_level,
                            "remarks": data.description,
                            "instance_id": data.instance_id,
                            "observance_ts": data.ts,
                            "reporter_id": credentials['user_id'],
                            "site_id": credentials['site_id']
                        };

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
            MobileCaching.getItem('user_credentials').then(credentials => {
                setTimeout(async () => {
                    alert(JSON.stringify(data));
                    let temp = [
                        {"moms_id": selectedData['moms_id']},
                        {"observance_ts": moment(observanceTs).format("YYYY-MM-DD  HH:mm:ss")},
                        {"remarks": data.remarks},
                        {"validator": credentials['user_id']},
                        {"instance_id": data.instance_id},
                        {"reporter_id": credentials['user_id']}
                    ];

                    let response = await MarGroundData.UpdateMOMSData(temp);
                    if (response.status == true) {
                        fetchLatestData();
                        setCmd("add");
                        closeForm();
                    }
                    ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
                }, 300);
            });
        }
    }

    const newFeatureType = async (data) => {
        let response = await MarGroundData.InsertMomsFeatureType(data);
        if (response.status == true) {
            alert(JSON.stringify(response));
            let copy = featureData
            copy.push({feature_id: response.feature_id,
                feature_type: data.feature_type})
            setFeatureData(copy)
            setOpenFeatureType(false);
            setDefaultFeatureType({
                "feature_type": "",
                "description": ""
            })
        }
        ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
    }

    const newFeatureName = (data) => {
        MobileCaching.getItem('user_credentials').then(credentials => {
            let temp = {
                "feature_id": selectedFeatureType,
                "feature_name": data.feature_name,
                "location": data.location,
                "reporter": data.reporter,
                "site_id": credentials['site_id']
            }
            setTimeout(async ()=> {
                let response = await MarGroundData.InsertMomsInstance(temp);
                if (response.status == true) {
                    let names = await MarGroundData.GetMomsInstancesPerSite('29');
                    featureNameData.current = names;
                    setOpenFeatureName(false);
                }
                ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
            }, 100);
        });
    }

    const deleteForm = () => {
        Alert.alert(
            "Manifestation of Movements",
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
                        let response = await MarGroundData.DeleteMOMSData({moms_id: selectedData['moms_id']});
                        if (response.status == true) {
                            fetchLatestData();
                            setCmd("add");
                            closeForm();
                        }   
                        ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
                    }
                },300)
              }}
            ],
            { cancelable: false }
        );
    }

    const openFeatureTypeCreator = () => {
        setOpenFeatureType(true);
    }

    const openFeatureNameCreator = () => {
        setOpenFeatureName(true);
    }

    const handleChangeFeatureType = (value) => {
        setDefaultStrValues({...defaultStrValues, feature_id: value});
        setFnContainer(featureNameData.current[value])
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
                    <TouchableOpacity style={ButtonStyle.medium} onPress={() => { showForm(); setCmd('add'); }}>
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
                            if (cmd == "add" ) {
                                let temp_def_val = {...defaultStrValues};
                                Object.keys(temp_def_val).forEach((key) => {
                                    if (temp_def_val[key] != "") {
                                        values[key] = temp_def_val[key];
                                    }
                                });
                            }
                            submitForm(values);
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
                                    onFocus={showDatePicker}
                                    onChangeText={handleChange('ts')} />
                                <Text style={{width: '80%', paddingLeft: 10, fontSize: 16, fontWeight: 'bold', color: '#86939e'}} >Feature Type</Text>
                                <View style={{borderColor: '#86939e', borderBottomWidth: 1, width: '75%'}}>
                                    <Picker
                                        selectedValue={defaultStrValues.feature_id}
                                        style={{height: 50, width: '100%'}}
                                        onValueChange={(itemValue, itemIndex) => {
                                            handleChangeFeatureType(itemValue)
                                        }}>
                                            <Picker.Item label="-----------" value={-1} />
                                        {
                                            featureData.map((element)=> {
                                                return <Picker.Item key={element.feature_type} label={element.feature_type} value={element.feature_id} />
                                            })
                                        }
                                    </Picker>
                                </View>
                                <View style={{ alignItems: 'center', marginBottom: 10 }}>
                                    <Text style={[LabelStyle.medium_label, { textAlign: 'center', color: "blue" }]} onPress={openFeatureTypeCreator}>New feature type? Click here!</Text>
                                </View>
                                <Text style={{width: '80%', paddingLeft: 10, fontSize: 16, fontWeight: 'bold', color: '#86939e'}} >Feature Type</Text>
                                <View style={{borderColor: '#86939e', borderBottomWidth: 1, width: '75%'}}>
                                    <Picker
                                        selectedValue={defaultStrValues.instance_id}
                                        style={{height: 50, width: '100%'}}
                                        onValueChange={(itemValue, itemIndex) => {
                                            setDefaultStrValues({...defaultStrValues, instance_id: itemValue})
                                        }}>
                                            <Picker.Item label="-----------" value={-1} />
                                        {
                                            fnContainer.map((element)=> {
                                                return <Picker.Item key={element.feature_name} label={element.feature_name} value={element.instance_id} />
                                            })
                                        }
                                    </Picker>
                                </View>
                                <View style={{ alignItems: 'center', marginBottom: 10}}>
                                    <Text style={[LabelStyle.medium_label, { textAlign: 'center', color: "blue" }]} onPress={openFeatureNameCreator}>New feature name? Click here!</Text>
                                </View>
                                <Input 
                                    key={"alert_level"}
                                    name={"alert_level"}
                                    label={"Alert Level"}
                                    defaultValue={values.alert_level}
                                    containerStyle={{ width: '80%', borderColor: '#f5981c' }}
                                    inputStyle={{ textAlign: 'center', padding: 0 }}
                                    onChangeText={handleChange('alert_level')} />
                                <Input 
                                    key={"description"}
                                    name={"remarks"}
                                    label={"Description"}
                                    defaultValue={values.remarks}
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
                    setOpenFeatureType(false);
                }}>
                <ScrollView style={[ContainerStyle.content]}>
                    <Formik
                        initialValues={defaultFeatureType}
                        onSubmit={values => {
                            newFeatureType(values);
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
                    setOpenFeatureName(false);
                }}>
                <ScrollView style={[ContainerStyle.content]}>
                    <Formik
                        initialValues={defaultFeatureName}
                        onSubmit={values => {
                            newFeatureName(values);
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values }) => (
                            <View style={{ alignItems: 'center', flex: 1, paddingTop: 20 }}>
                                <Text style={{width: '80%', paddingLeft: 10, fontSize: 16, fontWeight: 'bold', color: '#86939e'}} >Feature Type</Text>
                                <View style={{borderColor: '#86939e', borderBottomWidth: 1, width: '75%'}}>
                                    <Picker
                                        selectedValue={selectedFeatureType}
                                        style={{height: 50, width: '100%'}}
                                        onValueChange={(itemValue, itemIndex) => {
                                            setSelectedFeatureType(itemValue)
                                        }}>
                                            <Picker.Item label="-----------" value={-1} />
                                        {
                                            featureData.map((element)=> {
                                                return <Picker.Item key={element.feature_type} label={element.feature_type} value={element.feature_id} />
                                            })
                                        }
                                    </Picker>
                                </View>
                                <Input 
                                    key={"feature_name"}
                                    name={"feature_name"}
                                    label={"Feature Name"}
                                    defaultValue={""}
                                    containerStyle={{ width: '80%', borderColor: '#f5981c' }}
                                    inputStyle={{ textAlign: 'center', padding: 0 }}
                                    onChangeText={handleChange('feature_name')} />
                                <Input 
                                    key={"location"}
                                    name={"location"}
                                    label={"Location"}
                                    defaultValue={""}
                                    containerStyle={{ width: '80%', borderColor: '#f5981c' }}
                                    inputStyle={{ textAlign: 'center', padding: 0 }}
                                    onChangeText={handleChange('location')} />
                                <Input 
                                    key={"reporter"}
                                    name={"reporter"}
                                    label={"Reporter"}
                                    defaultValue={""}
                                    containerStyle={{ width: '80%', borderColor: '#f5981c' }}
                                    inputStyle={{ textAlign: 'center', padding: 0 }}
                                    onChangeText={handleChange('reporter')} />
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