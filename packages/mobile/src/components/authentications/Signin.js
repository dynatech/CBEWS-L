import React, { Fragment } from 'react';
import { Image, ImageBackground, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import { ButtonStyle } from '../../styles/button_style';
import { ContainerStyle } from '../../styles/container_style';
import { ImageStyle } from '../../styles/image_style';
import { InputStyle } from '../../styles/input_style';
import { LabelStyle } from '../../styles/label_style';

function Signin(props) {
    const navigator = props.navigation;
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
                    <View style={ContainerStyle.login_content}>
                        <Text style={[LabelStyle.large_label, LabelStyle.default, InputStyle.white]}>Community Based Early Warning Information for Landslides</Text>
                        <TextInput style={[InputStyle.large, InputStyle.default, InputStyle.white]} placeholder="Username" placeholderTextColor="#fff" />
                        <TextInput style={[InputStyle.large, InputStyle.default, InputStyle.white]} secureTextEntry={true} placeholder="Password" placeholderTextColor="#fff" />
                        <Text style={[LabelStyle.brand]} onPress={() => {
                            navigator.navigate('ForgotPassword');
                        }}>Forgot password?</Text>
                        <Text style={[LabelStyle.medium_label, LabelStyle.brand]} onPress={() => {
                            navigator.navigate('Signup');
                        }}>Create account</Text>
                        <TouchableOpacity style={ButtonStyle.large} onPress={() => { }}>
                            <Text style={ButtonStyle.large_text}>Sign in</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </ImageBackground>
        </Fragment>
    )
}

export default Signin;