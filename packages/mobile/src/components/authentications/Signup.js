import { Picker } from '@react-native-community/picker';
import React, { Fragment, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Input } from 'react-native-elements';
import { ButtonStyle } from '../../styles/button_style';
import { ContainerStyle } from '../../styles/container_style';
import { LabelStyle } from '../../styles/label_style';
import { Formik } from 'formik';

function Signup(props) {

    const navigator = props.navigation;
    let defaultValues = {
        firstname: '',
        lastname: '',
        middlename: '',
        mobile_no: '',
        username: '',
        password: '',
        cpassword: '',
        site: '',
        org: ''
    }

    let sites = [
        { label: 'Marirong', value: 'mar' },
        { label: 'Umingan', value: 'umi' }
    ]

    let orgs = [
        { label: 'LEWC', value: 'lewc' },
        { label: 'BLGU', value: 'blgu' },
        { label: 'MLGU', value: 'mlgu' },
        { label: 'PLGU', value: 'PLGU' },
        { label: 'PNP', value: 'pnp' },
        { label: 'Public', value: 'pub' }
    ]

    const test = (value) => {
        console.log(value)
    }
    return (
        <Fragment>
            <ScrollView style={[ContainerStyle.content]}>
                <Formik
                    initialValues={defaultValues}
                    onSubmit={values => console.log(values)}
                >
                    {({ handleChange, handleBlur, handleSubmit, values }) => (
                        <View>
                            <View style={{ alignItems: 'center', paddingTop: 20 }}>
                                <Input placeholder="E.g. Juan"
                                    label="First name"
                                    value={values.firstname}
                                    containerStyle={{ width: '80%', borderColor: '#f5981c' }}
                                    inputStyle={{ textAlign: 'center', padding: 0 }}
                                    onChangeText={handleChange('firstname')} />
                                <Input placeholder="E.g. Dela Cruz"
                                    label="Last name"
                                    value={values.lastname}
                                    containerStyle={{ width: '80%' }}
                                    inputStyle={{ textAlign: 'center', padding: 0 }}
                                    onChangeText={handleChange('lastname')} />
                                <Input placeholder="E.g. Domgingo"
                                    label="Middle name"
                                    value={values.middlename}
                                    containerStyle={{ width: '80%' }}
                                    inputStyle={{ textAlign: 'center', padding: 0 }}
                                    onChangeText={handleChange('middlename')} />
                                <Input placeholder="E.g. 091234567890"
                                    label="Mobile No."
                                    value={values.mobile_no}
                                    containerStyle={{ width: '80%' }}
                                    inputStyle={{ textAlign: 'center', padding: 0 }}
                                    onChangeText={handleChange('mobile_no')} />
                                <Input placeholder="E.g. JuanDelaCruz"
                                    label="Username"
                                    value={values.username}
                                    containerStyle={{ width: '80%' }}
                                    inputStyle={{ textAlign: 'center', padding: 0 }}
                                    onChangeText={handleChange('username')} />
                                <Input
                                    label="Password"
                                    value={values.password}
                                    secureTextEntry={true}
                                    containerStyle={{ width: '80%' }}
                                    inputStyle={{ textAlign: 'center', padding: 0 }} 
                                    onChangeText={handleChange('password')}/>
                                <Input
                                    label="Confirm Password"
                                    secureTextEntry={true}
                                    value={values.cpassword}
                                    containerStyle={{ width: '80%' }}
                                    inputStyle={{ textAlign: 'center', padding: 0 }} 
                                    onChangeText={handleChange('cpassword')}/>
                                <View style={{ width: '77%', borderBottomWidth: 1, borderBottomColor: '#848e98', alignSelf: 'center' }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 17, paddingLeft: 5, color: '#848e98' }}>Site Selection</Text>
                                    <Picker
                                        mode='dropdown'
                                        selectedValue={values.site}
                                        onValueChange={handleChange('site')}>
                                        {
                                            sites.map((site) => {
                                                return <Picker.Item key={site.value} label={site.label} value={site.value} />
                                            })
                                        }
                                    </Picker>
                                </View>
                                <View style={{ width: '77%', paddingTop: 25, borderBottomWidth: 1, borderBottomColor: '#848e98', alignSelf: 'center' }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 17, paddingLeft: 5, color: '#848e98' }}>Organization</Text>
                                    <Picker
                                        mode='dropdown'
                                        selectedValue={values.org}
                                        onValueChange={handleChange('org')}>
                                        {
                                            orgs.map((org) => {
                                                return <Picker.Item key={org.value} label={org.label} value={org.value} />
                                            })
                                        }
                                    </Picker>
                                </View>
                            </View>
                            <View style={{ alignItems: 'center', paddingTop: 25, paddingBottom: 25 }}>
                                <Text style={[LabelStyle.small_label, { textAlign: 'center' }]}>* All fields are required when creating your CBEWS-L Account</Text>
                                <Text style={[LabelStyle.small_label, { textAlign: 'center' }]}>* Please review your details before submitting</Text>
                            </View>
                            <View style={{ alignItems: 'center' }}>
                                <TouchableOpacity style={ButtonStyle.medium} onPress={handleSubmit}>
                                    <Text style={ButtonStyle.medium_text}>Submit</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </Formik>
            </ScrollView>
        </Fragment>
    )
}

export default Signup;