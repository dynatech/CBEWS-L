import { Picker } from '@react-native-community/picker';
import React, { Fragment } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Input } from 'react-native-elements';
import { ButtonStyle } from '../../styles/button_style';
import { ContainerStyle } from '../../styles/container_style';
import { LabelStyle } from '../../styles/label_style';

function Signup(props) {

    const navigator = props.navigation;

    return (
        <Fragment>
            <ScrollView style={[ContainerStyle.content]}>
                <View>
                    <View style={{ alignItems: 'center', paddingTop: 20 }}>
                        <Input placeholder="E.g. Juan"
                            label="First name"
                            containerStyle={{ width: '80%', borderColor: '#f5981c' }}
                            inputStyle={{textAlign: 'center', padding: 0}} />
                        <Input placeholder="E.g. Dela Cruz"
                            label="Last name"
                            containerStyle={{ width: '80%' }}
                            inputStyle={{textAlign: 'center', padding: 0}} />
                        <Input placeholder="E.g. Domgingo"
                            label="Middle name"
                            containerStyle={{ width: '80%' }}
                            inputStyle={{textAlign: 'center', padding: 0}} />
                        <Input placeholder="E.g. 091234567890"
                            label="Mobile No."
                            containerStyle={{ width: '80%' }}
                            inputStyle={{borderBottomWidth: 2}}
                            inputStyle={{textAlign: 'center', padding: 0}} />
                        <View style={{ width: '77%', borderBottomWidth: 1, borderBottomColor: '#848e98', alignSelf: 'center'}}>
                            <Text style={{fontWeight: 'bold', fontSize: 17, paddingLeft: 5, color: '#848e98'}}>Site Selection</Text>
                            <Picker
                                selectedValue={'mar'}
                                mode='dropdown'>
                                <Picker.Item label="Marirong" value="mar" />
                                <Picker.Item label="Umingan" value="umi" />
                            </Picker>
                        </View>
                        <View style={{ width: '77%',paddingTop: 25, borderBottomWidth: 1, borderBottomColor: '#848e98', alignSelf: 'center'}}>
                            <Text style={{fontWeight: 'bold', fontSize: 17, paddingLeft: 5, color: '#848e98'}}>Organization</Text>
                            <Picker
                                selectedValue={'lewc'}
                                mode='dropdown'>
                                <Picker.Item label="LEWC" value="lewc" />
                                <Picker.Item label="BLGU" value="blgu" />
                                <Picker.Item label="MLGU" value="mlgu" />
                                <Picker.Item label="PLGU" value="plgu" />
                                <Picker.Item label="PDRRMO" value="pdrrmo" />
                                <Picker.Item label="PNP" value="pnp" />
                                <Picker.Item label="Public" value="pub" />
                            </Picker>
                        </View>
                    </View>
                    <View style={{ alignItems: 'center' , paddingTop: 25, paddingBottom: 25}}>
                        <Text style={[LabelStyle.small_label, { textAlign: 'center' }]}>* All fields are required when creating your CBEWS-L Account</Text>
                        <Text style={[LabelStyle.small_label, { textAlign: 'center' }]}>* Please review your details before submitting</Text>
                    </View>
                    <View style={{alignItems: 'center'}}>
                        <TouchableOpacity style={ButtonStyle.medium}>
                            <Text style={ButtonStyle.medium_text}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </Fragment>
    )
}

export default Signup;