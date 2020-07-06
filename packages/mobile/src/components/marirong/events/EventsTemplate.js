import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
import { Input } from 'react-native-elements';
import { Picker } from '@react-native-community/picker';
import { ContainerStyle } from '../../../styles/container_style';
import { LabelStyle } from '../../../styles/label_style';
import { ButtonStyle } from '../../../styles/button_style';
import { MarEventsTemplate } from '@dynaslope/commons';
import Forms from '../../utils/Forms';
import MobileCaching from '../../../utils/MobileCaching';

function EventsTemplate() {

    const [ cmd, setCmd ] = useState('add');
    const [ templateContainer, setTemplateContainer ] = useState([]);
    const [ templatePicker, setTemplatePicker ] = useState([]);
    const [ selectedTemplateName, setSelectedTemplateName] = useState('');
    const [ selectedMessageTemplate, setSelectedMessageTemplate] = useState('def');

    useEffect(()=> {
        init();
    }, []);

    const init = async () => {
        let response = await MarEventsTemplate.GetAllEventsTemplate()
        if (response.status === true) {
            let temp = [];
            response.data.forEach(element => {
                temp.push(
                    <Picker.Item key={element.id} label={element.template_name} value={element.id} />
                )
            });
            temp.push(<Picker.Item key="new" label="New template" value="new" />);
            if (response.data.length != 0) {
                setSelectedTemplateName(response.data[0].id)
                setSelectedMessageTemplate(response.data[0].message_template);
            } else {
                setSelectedTemplateName('new')
                setSelectedMessageTemplate('');
            }
            setTemplatePicker(temp);
            setTemplateContainer(response.data);
        } else {
            ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
        }
    }
    
    const handleChangeTemplate = (value) => {
        alert('CHANGE')
        setSelectedMessageTemplate('');
        setSelectedTemplateName(value);
    }

    const handleSubmit = () => {
        MobileCaching.getItem('user_credentials').then(credentials => {
            setTimeout(async ()=> {
                let response = await MarEventsTemplate.InsertEventsTemplate({
                    'template_name': selectedTemplateName,
                    'message_template': selectedMessageTemplate,
                    'user_id': credentials['user_id']
                })
    
                if (response.status == true) {
                    ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
                    init();
                } else {
                    ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
                }
            },100);

        });
    }

    const handleDelete = () => {

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
                            selectedValue={selectedTemplateName}
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