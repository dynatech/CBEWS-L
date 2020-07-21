import React, { useEffect } from 'react';
import { Image, Text, Alert, TouchableOpacity, View, Linking, ToastAndroid } from 'react-native';
// import { Icon } from 'native-base'
import { ImageStyle } from '../../styles/image_style'
import { ContainerStyle } from '../../styles/container_style';
import { LabelStyle } from '../../styles/label_style';
import { ScrollView } from 'react-native-gesture-handler';
import NetworkUtils from '../../utils/NetworkUtils';

function MarirongDashboard(props) {
  const navigator = props.navigation;

  useEffect(()=> {
    setTimeout( async ()=> {
      const isConnected = await NetworkUtils.isNetworkAvailable()
      if (isConnected != true) {
        Alert.alert(
          'CBEWS-L is not connected to the internet',
          'CBEWS-L Local data will be used.',
          [
            { text: 'Ok', onPress: () => console.log('OK Pressed'), style: 'cancel' },
          ]
        )
      }
    },100);
  });

  const initiateCallOrSms = () => {
    Alert.alert(
      'Notice',
      'Communication Module',
      [
        { text: 'Cancel', onPress: () => console.log('OK Pressed'), style: 'cancel' },
        { text: 'Call', onPress: () => Linking.openURL('tel:') },
        { text: 'SMS', onPress: () => Linking.openURL(`sms:?addresses=null&body=`) }
      ]
    )
  }

  // <Icon name="menu" onPress={() => navigator.openDrawer()} />

  return (
    <ScrollView>
      <View style={ContainerStyle.dashboard_container}>
        <View style={ContainerStyle.dashboard_seals}>
          <Image style={ImageStyle.dashboard_seal} source={require('../../assets/dost_seal.png')}></Image>
          <Image style={ImageStyle.dashboard_seal} source={require('../../assets/dynaslope_seal.png')}></Image>
          <Image style={ImageStyle.dashboard_seal} source={require('../../assets/leon_seal.png')}></Image>
          <Image style={ImageStyle.dashboard_seal} source={require('../../assets/mar_seal.png')}></Image>
        </View>
        <View style={ContainerStyle.dashboard_content}>
          <Text style={[LabelStyle.large_label, LabelStyle.branding]}>Community Based Early Warning Information for Landslides</Text>
          <View style={ContainerStyle.weather_container}>
            <Text style={[LabelStyle.medium_label]}>Weather update: Clear skies</Text>
            <Text style={[LabelStyle.medium_label]}>Date time: August 16, 2019 04:00 PM</Text>
          </View>
          <View style={ContainerStyle.dashboard_menu}>
            <View style={ContainerStyle.menu_row}>
              <View style={[ContainerStyle.menu_container]}>
                <TouchableOpacity onPress={() => { navigator.navigate("CRATabStack") }}>
                  <Image style={ImageStyle.dashboard_menu_icon} source={require('../../assets/marirong/menu/cra.png')}></Image>
                </TouchableOpacity>
                <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Community{"\n"}Risk Assessment</Text>
              </View>
              <View style={[ContainerStyle.menu_container]}>
                <TouchableOpacity onPress={() => { initiateCallOrSms() }}>
                  <Image style={ImageStyle.dashboard_menu_icon} source={require('../../assets/marirong/menu/call_n_text.png')}></Image>
                </TouchableOpacity>
                <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Call and Text</Text>
              </View>
              <View style={[ContainerStyle.menu_container]}>
                <TouchableOpacity onPress={() => { navigator.navigate("AlertGeneration") }}>
                  <Image style={ImageStyle.dashboard_menu_icon} source={require('../../assets/marirong/menu/alert_gen.png')}></Image>
                </TouchableOpacity>
                <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Alert{"\n"}Generation</Text>
              </View>
            </View>
            <View style={ContainerStyle.menu_row}>
              <View style={[ContainerStyle.menu_container]}>
                <TouchableOpacity onPress={() => { navigator.navigate("DataAnalysis") }}>
                  <Image style={ImageStyle.dashboard_menu_icon} source={require('../../assets/marirong/menu/data_analysis.png')}></Image>
                </TouchableOpacity>
                <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Data{"\n"}Analysis</Text>
              </View>
              <View style={[ContainerStyle.menu_container]}>
                <TouchableOpacity onPress={() => { navigator.navigate("GroundData") }}>
                  <Image style={ImageStyle.dashboard_menu_icon} source={require('../../assets/marirong/menu/ground_data.png')}></Image>
                </TouchableOpacity>
                <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Ground Data</Text>
              </View>
              <View style={[ContainerStyle.menu_container]}>
                <TouchableOpacity onPress={() => { navigator.navigate("SensorData") }}>
                  <Image style={ImageStyle.dashboard_menu_icon} source={require('../../assets/marirong/menu/sensor_data.png')}></Image>
                </TouchableOpacity>
                <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Sensor Data</Text>
              </View>
            </View>
            <View style={ContainerStyle.menu_row}>
              <View style={[ContainerStyle.menu_container]}>
                <TouchableOpacity onPress={() => { navigator.navigate("MaintenanceLogsTabStack") }}>
                  <Image style={ImageStyle.dashboard_menu_icon} source={require('../../assets/marirong/menu/maintenance.png')}></Image>
                </TouchableOpacity>
                <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Maintenance</Text>
              </View>
              <View style={[ContainerStyle.menu_container]}>
                <TouchableOpacity onPress={() => { navigator.navigate("EventsTemplate") }}>
                  <Image style={ImageStyle.dashboard_menu_icon} source={require('../../assets/marirong/menu/events.png')}></Image>
                </TouchableOpacity>
                <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Events</Text>
              </View>
              <View style={[ContainerStyle.menu_container]}>
                <TouchableOpacity onPress={() => { navigator.navigate("DataSync") }}>
                  <Image style={ImageStyle.dashboard_menu_icon} source={require('../../assets/marirong/menu/data_sync.png')}></Image>
                </TouchableOpacity>
                <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Data Sync</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default MarirongDashboard