import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { ContainerStyle } from '../../styles/container_style';
import { ImageStyle } from '../../styles/image_style';
import { LabelStyle } from '../../styles/label_style';
import { ScrollView } from 'react-native-gesture-handler';

function UminganDashboard(props) {
    const navigator = props.navigation;
    return (
        <ScrollView>
            <View style={ContainerStyle.dashboard_container}>
                <View style={[ContainerStyle.dashboard_seals, {paddingTop: 20, paddingBottom: 20}]}>
                    <Image style={ImageStyle.dashboard_seal} source={require('../../assets/umi_seal.png')}></Image>
                    <Image style={ImageStyle.dashboard_seal} source={require('../../assets/dost_seal.png')}></Image>
                    <Image style={ImageStyle.dashboard_seal} source={require('../../assets/dynaslope_seal.png')}></Image>
                </View>
                <View style={{paddingTop: '10%', paddingBottom: '10%'}}>
                    <Text style={[LabelStyle.large_label, LabelStyle.branding]}>Early Warning System for Deep-seated Landslides</Text>
                </View>
                <View style={ContainerStyle.dashboard_content}>
                    
                    <View style={ContainerStyle.menu_row}>
                        <View style={[ContainerStyle.menu_container]}>
                        <TouchableOpacity onPress={() => { navigator.navigate('RATabStack') }}>
                            <Image style={ImageStyle.dashboard_menu_icon} source={require('../../assets/umingan/menu/cra.png')}></Image>
                        </TouchableOpacity>
                        <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Risk{'\n'}Assessment</Text>
                        </View>
                        <View style={[ContainerStyle.menu_container]}>
                        <TouchableOpacity onPress={() => { navigator.navigate('FieldSurvey')}}>
                            <Image style={ImageStyle.dashboard_menu_icon} source={require('../../assets/umingan/menu/field_survey.png')}></Image>
                        </TouchableOpacity>
                        <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Field Survey</Text>
                        </View>
                        <View style={[ContainerStyle.menu_container]}>
                        <TouchableOpacity onPress={() => { }}>
                            <Image style={ImageStyle.dashboard_menu_icon} source={require('../../assets/umingan/menu/situation_report.png')}></Image>
                        </TouchableOpacity>
                        <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Situation{'\n'}Report</Text>
                        </View>
                    </View>
                    <View style={ContainerStyle.menu_row}>
                        <View style={[ContainerStyle.menu_container]}>
                        <TouchableOpacity onPress={() => { }}>
                            <Image style={ImageStyle.dashboard_menu_icon} source={require('../../assets/umingan/menu/sensor_maintenance.png')}></Image>
                        </TouchableOpacity>
                        <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Sensor{'\n'}Maintenance</Text>
                        </View>
                        <View style={[ContainerStyle.menu_container]}>
                        <TouchableOpacity onPress={() => { }}>
                            <Image style={ImageStyle.dashboard_menu_icon} source={require('../../assets/umingan/menu/surficial.png')}></Image>
                        </TouchableOpacity>
                        <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Surficial Data</Text>
                        </View>
                        <View style={[ContainerStyle.menu_container]}>
                        <TouchableOpacity onPress={() => { }}>
                            <Image style={ImageStyle.dashboard_menu_icon} source={require('../../assets/umingan/menu/ewi.png')}></Image>
                        </TouchableOpacity>
                        <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Early Warning{'\n'}Information</Text>
                        </View>
                    </View>
                    <View style={ContainerStyle.menu_row}>
                        <View style={[ContainerStyle.menu_container]}>
                        <TouchableOpacity onPress={() => { }}>
                            <Image style={ImageStyle.dashboard_menu_icon} source={require('../../assets/umingan/menu/reports.png')}></Image>
                        </TouchableOpacity>
                        <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Reports</Text>
                        </View>
                        <View style={[ContainerStyle.menu_container]}>
                        <TouchableOpacity onPress={() => { }}>
                            <Image style={ImageStyle.dashboard_menu_icon} source={require('../../assets/umingan/menu/call.png')}></Image>
                        </TouchableOpacity>
                        <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Call</Text>
                        </View>
                        <View style={[ContainerStyle.menu_container]}>
                        <TouchableOpacity onPress={() => { }}>
                            <Image style={ImageStyle.dashboard_menu_icon} source={require('../../assets/umingan/menu/messaging.png')}></Image>
                        </TouchableOpacity>
                        <Text style={[LabelStyle.small_label, LabelStyle.brand]}>SMS</Text>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

export default UminganDashboard;