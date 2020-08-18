import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
import { Input } from 'react-native-elements';
import { Picker } from '@react-native-community/picker';
import { ContainerStyle } from '../../../styles/container_style';
import { LabelStyle } from '../../../styles/label_style';
import { ButtonStyle } from '../../../styles/button_style';
import { MarEventsTemplate } from '@dynaslope/commons';
import NetworkUtils from '../../../utils/NetworkUtils';
import MobileCaching from '../../../utils/MobileCaching';

function EventsTemplate() {

    const [ cmd, setCmd ] = useState('add');
    const [ templateContainer, setTemplateContainer ] = useState([]);
    const [ templatePicker, setTemplatePicker ] = useState([]);
    const [ selectedId, setSelectedId ] = useState(null);
    const [ selectedTemplateName, setSelectedTemplateName] = useState('');
    const [ selectedMessageTemplate, setSelectedMessageTemplate] = useState('');

    useEffect(() => {
        setTimeout( async ()=> {
            const isConnected = await NetworkUtils.isNetworkAvailable()
            if (isConnected != true) {
              Alert.alert(
                'CBEWS-L is not connected to the internet',
                'CBEWS-L Local data will be used.',
                [
                  { text: 'Ok', onPress: () => {
                    MobileCaching.getItem('MarEventsTemplate').then(response => {
                        response.push({
                            id: "0",
                            template_name: 'New template',
                            message_template: 'New template'
                        });
                        init(response);
                    });
                  }, style: 'cancel' },
                ]
              )
            } else {
                fetchLatestData();
            }
          },100);
    }, [])

    const fetchLatestData = async () => {
        let response = await MarEventsTemplate.GetAllEventsTemplate()
        if (response.status === true) {
            MobileCaching.setItem('MarEventsTemplate', response.data);
            response.data.push({
                id: "0",
                template_name: 'New template',
                message_template: 'New template'
            });
            init(response.data);
        } else {
            ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
        }
    }

    const init = async (data) => {
        let temp = [];
        data.forEach(element => {
            temp.push(
                <Picker.Item key={element.id} label={element.template_name} value={element.id} />
            )
        });
        if (data.length != 0) {
            setCmd('update')
            setSelectedId(data[0].id);
            setSelectedTemplateName(data[0].template_name);
            setSelectedMessageTemplate(data[0].message_template);
        } else {
            setCmd('Add')
            setSelectedTemplateName('')
            setSelectedMessageTemplate('');
        }
        setTemplatePicker(temp);
        setTemplateContainer(data);
    }
    
    const handleChangeTemplate = (value) => {
        let select = templateContainer.find(x => x.id == value);
        if (select.id == "0") {
            setCmd('add');
            setSelectedMessageTemplate('');
            setSelectedTemplateName('');
            setSelectedId(select.id);
        } else {
            setCmd('update')
            setSelectedMessageTemplate(select.message_template);
            setSelectedTemplateName(select.template_name);
            setSelectedId(select.id);
        }
    }

    const handleSubmit = () => {
        MobileCaching.getItem('user_credentials').then(credentials => {
            setTimeout(async ()=> {

                const isConnected = await NetworkUtils.isNetworkAvailable();
                let response = null;
                let temp = {};

                if (cmd == "add") {
                    if (isConnected != true) {
                        response = await MobileCaching.getItem("MarEventsTemplate").then(cached_data => {
                            let ret_val = {}
                            cached_data.push({
                                'id': -1,
                                'last_ts': null,
                                'message_template': selectedMessageTemplate,
                                'template_name': selectedTemplateName,
                                'user_id': credentials['user_id'],
                                'alterations': 'add'
                            });
                            try {
                                MobileCaching.setItem("MarEventsTemplate", cached_data);
                                ret_val = {
                                    "status": true,
                                    "message": "Events template is temporarily saved in the memory.\nPlease connect to the internet and sync your data."
                                }
                            } catch (err) {
                                ret_val = {
                                    "status": false,
                                    "message": "Events template failed to save data to memory."
                                }
                            }
                            cached_data.push({
                                id: "0",
                                template_name: 'New template',
                                message_template: 'New template'
                            });
                            init(cached_data);
                            return ret_val;
                        });
                    } else {
                        response = await MarEventsTemplate.InsertEventsTemplate({
                            'template_name': selectedTemplateName,
                            'message_template': selectedMessageTemplate,
                            'user_id': credentials['user_id']
                        });
                        fetchLatestData();
                    }
                } else {
                    if (isConnected != true) {
                        temp = await MobileCaching.getItem("MarEventsTemplate").then(cached_data => {
                            alert(JSON.stringify(cached_data));
                        });
                    } else {
                        response = await MarEventsTemplate.UpdateEventsTemplate({
                            'id': selectedId,
                            'template_name': selectedTemplateName,
                            'message_template': selectedMessageTemplate,
                            'user_id': credentials['user_id']
                        });
                    }
                }
                ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
            },100);

        });
    }

    const handleDelete = () => {
        Alert.alert(
            "SMS Template",
            "Are you sure you want to delete this data?",
            [
              {
                text: "Cancel",
                style: "cancel"
              },
              { text: "Confirm", onPress: () => {
                setTimeout(async ()=> {
                    let response = await MarEventsTemplate.DeleteEventsTemplate({
                        'id': selectedId
                    })
                    if (response.status == true) {
                        ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
                        // init();
                    } else {
                        ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
                    }
                },300)
              }}
            ],
            { cancelable: false }
        );
    }
    return(
        <ScrollView>
            <View style={ContainerStyle.content}>
                <Text style={[LabelStyle.large_label, LabelStyle.brand]}>Events | SMS Template</Text>
                <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Add / Modify / Delete SMS Templates</Text>
                <View style={{padding: 20}}>
                    <View style={{  width: '94%', borderBottomWidth: 1, borderBottomColor: '#848e98', marginBottom: 20, alignSelf: 'center' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 17, color: '#848e98' }}>Select template</Text>
                        <Picker
                            mode='dropdown'
                            selectedValue={selectedId}
                            onValueChange={(v, i) =>
                                handleChangeTemplate(v)
                            }>
                            { templatePicker }
                        </Picker>
                    </View>
                    <View>
                        <Input placeholder="E.g. Ground Measurement Reminder"
                            label="Template name"
                            value={selectedTemplateName}
                            inputStyle={{ textAlign: 'center', padding: 0 }}
                            onChangeText={(v,i)=> { setSelectedTemplateName(v);}} />
                    </View>
                    <View style={{marginBottom: 20}}>
                        <Input
                            label="Message template"
                            value={selectedMessageTemplate}
                            numberOfLines={10}
                            inputStyle={{ textAlign: 'center', padding: 0 }}
                            onChangeText={(v,i)=> { setSelectedMessageTemplate(v) }} />
                    </View>
                    <View style={{ alignItems: 'center', alignSelf: 'center',flexDirection: 'row' }}>
                        <TouchableOpacity style={ButtonStyle.small} onPress={handleSubmit}>
                            <Text style={ButtonStyle.medium_text}>Submit</Text>
                        </TouchableOpacity>
                        {
                            cmd != 'add' &&
                            <TouchableOpacity style={ButtonStyle.small} onPress={handleDelete}>
                                <Text style={ButtonStyle.medium_text}>Delete</Text>
                            </TouchableOpacity>
                        }
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default EventsTemplate;