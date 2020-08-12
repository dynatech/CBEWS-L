import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, Text, TouchableOpacity, View, ToastAndroid } from 'react-native';
import { Input } from 'react-native-elements';
import { ButtonStyle } from '../../styles/button_style';
import { ContainerStyle } from '../../styles/container_style';
import { LabelStyle } from '../../styles/label_style';
import { Formik } from 'formik';
import FilePickerManager from 'react-native-file-picker';
import NetworkUtils from '../../utils/NetworkUtils';

const Forms = (props) => {
    const { data, submitForm, deleteForm, formData, command } = props;
    const { string, int } = data;

    const [confirmUpload, setConfirmUpload] = useState(false);
    const [filename, setFilename] = useState("N/A");
    const [filepath, setFilepath] = useState();
    const [filetype, setFiletype] = useState();
    const [filesize, setFilesize] = useState();

    const [defaultValues, setDefaultValues] = useState({});
    const [cmd, setCmd] = useState('');

    useEffect(()=> {
        setDefaultValues(Object.assign(string, int));
        string.Attachment != null & setFilename(string.Attachment);
        setCmd(command);
    },[])

    const uploadFile = async() => {
        const isConnected = await NetworkUtils.isNetworkAvailable();
        if (isConnected != true) {
            ToastAndroid.showWithGravity("Failed to upload file. Please connect to the Internet / CBEWS-L Network to continue.", ToastAndroid.LONG, ToastAndroid.CENTER)
        } else {
            FilePickerManager.showFilePicker(null, (response) => {
                if (response.didCancel) {
                  console.log('User cancelled file picker');
                }
                else if (response.error) {
                  console.log('FilePickerManager Error: ', response.error);
                }
                else {
                  setFilepath(response.path);
                  setFiletype(response.type);
                  setFilesize(response.size);
                  setFilename(response.fileName);
                  setConfirmUpload(true);
                }
              });
        }
      }

    return(
        <ScrollView style={[ContainerStyle.content]}>
        <Formik
            initialValues={defaultValues}
            onSubmit={values => {
                formData.current = values;
                if (filename != "N/A") {
                    formData.current['attachment'] = {
                        'filename': filename,
                        'filepath': filepath,
                        'filetype': filetype,
                        'filesize': filesize
                    }
                }
                submitForm();
            }}
        >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
                <View style={{ alignItems: 'center', paddingTop: 20 }}>
                    {   
                        Object.entries(defaultValues).map((e, l) => {
                            let key = e[0].replace(/\s/g, "");
                            let input_field = [];
                                if (e[0].toLowerCase() == "attachment") {
                                input_field.push(
                                    <View key={e[0]} style={{ paddingTop: '10%', alignItems: 'center' }}>
                                        <Text style={[LabelStyle.medium_label, LabelStyle.brand]} onPress={uploadFile}>Attachments: {filename}</Text>
                                    </View>
                                )
                            } else {
                                if (e[1].length > 80) {
                                    input_field.push(
                                        <Input 
                                            key={e[0]}
                                            label={e[0]}
                                            defaultValue={e[1]}
                                            multiline={true}
                                            numberOfLines={10}
                                            containerStyle={{ width: '80%', borderColor: '#f5981c' }}
                                            inputStyle={{ textAlign: 'center', padding: 0 }}
                                            onChangeText={handleChange(`${key}`)} />
                                    )
                                } else {
                                    input_field.push(
                                        <Input 
                                            key={e[0]}
                                            label={e[0]}
                                            defaultValue={e[1]}
                                            containerStyle={{ width: '80%', borderColor: '#f5981c' }}
                                            inputStyle={{ textAlign: 'center', padding: 0 }}
                                            onChangeText={handleChange(`${key}`)} />
                                    )
                                }
                            }
                            return(
                                input_field
                            )
                        })
                     }
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
    )
}

export default Forms;