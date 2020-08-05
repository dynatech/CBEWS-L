import React, { Fragment, useEffect } from 'react';
import { Image, ImageBackground, ScrollView, Text, TextInput, TouchableOpacity, View, ToastAndroid } from 'react-native';
import { ButtonStyle } from '../../styles/button_style';
import { ContainerStyle } from '../../styles/container_style';
import { ImageStyle } from '../../styles/image_style';
import { InputStyle } from '../../styles/input_style';
import { LabelStyle } from '../../styles/label_style';
import { Formik } from 'formik';
import { UserManagement } from '@dynaslope/commons';
import MobileCaching from '../../utils/MobileCaching';
import NetworkUtils from '../../utils/NetworkUtils';

function Signin(props) {
    const navigator = props.navigation;
    const site_navigator = {
        '51': 'MarirongDashboardStack',
        '50': 'UminganDashboardStack'
    }

    useEffect(()=> {
        setTimeout( async ()=> {
            const isConnected = await NetworkUtils.isNetworkAvailable()
            MobileCaching.getItem('user_credentials').then(credentials=> {
                if (credentials != null) {
                    navigator.navigate(site_navigator[credentials.site_id]);
                } else {
                    if (isConnected != true) {
                        ToastAndroid.showWithGravity("CBEWS-L is not connected to the internet. \nPlease Check your Internet connectivity before logging into the App.", ToastAndroid.LONG, ToastAndroid.CENTER)
                    }
                }
            })
        },100);
    }, []);

    return (
        <Fragment>
            <ImageBackground style={ImageStyle.background} source={require('../../assets/login_screen.png')} blurRadius={1}>
                <ScrollView style={ContainerStyle.content}>
                    <View style={ContainerStyle.seals}>
                        <Image style={ImageStyle.seal} source={require('../../assets/dost_seal.png')}></Image>
                        <Image style={ImageStyle.seal} source={require('../../assets/dynaslope_seal.png')}></Image>
                    </View>
                    <View style={ContainerStyle.seals}>
                        <Image style={ImageStyle.seal} source={require('../../assets/mar_seal.png')}></Image>
                        <Image style={ImageStyle.seal} source={require('../../assets/leon_seal.png')}></Image>
                        <Image style={ImageStyle.seal} source={require('../../assets/umi_seal.png')}></Image>
                    </View>
                    <Formik
                        initialValues={{username: '', password: ''}}
                        onSubmit={values => {
                            setTimeout(async ()=> {
                                let response = await UserManagement.UserAuthentication(values);
                                if (response.status == true) {
                                    ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
                                    MobileCaching.setItem('user_credentials', response.user_data);
                                    navigator.navigate(site_navigator[response.user_data.site_id]);
                                } else {
                                    ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
                                }
                            })
                        }}
                        >
                        {({ handleChange, handleBlur, handleSubmit, values }) => (
                            <View style={ContainerStyle.login_content}>
                                <Text style={[LabelStyle.large_label, LabelStyle.default, InputStyle.white]}>Community Based Early Warning System for Landslides</Text>
                                <TextInput style={[InputStyle.large, InputStyle.default, InputStyle.white]} 
                                                values={values.username} 
                                                placeholder="Username" 
                                                placeholderTextColor="#fff"
                                                onChangeText={handleChange('username')} />
                                <TextInput style={[InputStyle.large, InputStyle.default, InputStyle.white]} 
                                                values={values.password} secureTextEntry={true} 
                                                placeholder="Password" placeholderTextColor="#fff"
                                                onChangeText={handleChange('password')} />
                                <Text style={[LabelStyle.medium_label, LabelStyle.brand]} onPress={() => {
                                    navigator.navigate('ForgotPassword');
                                }}>Forgot password?</Text>
                                <Text style={[LabelStyle.medium_label, LabelStyle.brand]} onPress={() => {
                                    navigator.navigate('Signup');
                                }}>Create account</Text>
                                <TouchableOpacity style={ButtonStyle.large} onPress={handleSubmit}>
                                    <Text style={ButtonStyle.large_text}>Sign in</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </Formik>
                </ScrollView>
            </ImageBackground>
        </Fragment>
    )
}

export default Signin;