import React, { useEffect, useState, useCallback } from 'react';
import { Image, Text, Alert, TouchableOpacity, View, Linking, PermissionsAndroid } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { ImageStyle } from '../../styles/image_style'
import { ContainerStyle } from '../../styles/container_style';
import { LabelStyle } from '../../styles/label_style';
import { ScrollView } from 'react-native-gesture-handler';
import Geolocation from 'react-native-geolocation-service';
import NetworkUtils from '../../utils/NetworkUtils';
import DataSync from '../../utils/DataSync';
import MobileCaching from '../../utils/MobileCaching';
import moment from 'moment';

function MarirongDashboard(props) {
  const StackNavigator = props.navigation;
  const [isSyncing, setSyncing] = useState(true);
  const [syncMessage, setSyncMessage] = useState("Syncing data to servers...");
  const [weather, setWeather] = useState({});

  useEffect(()=> {
    initLocation();
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
      } else {
        MobileCaching.getItem('user_credentials').then((credentials)=> {
          setTimeout(async()=> {
            let cache_keys = await DataSync.getCachedData(credentials.site_id)
            let _Alterations = await DataSync.compileUnsyncData(cache_keys, "Marirong");
            setSyncing(false);
          }, 1000);
          // alert(JSON.stringify(_Alterations));
        });
      }
    },100);
  }, []);

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

  const initLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const {latitude, longitude} = position.coords;
        getWeather(latitude, longitude)
      },
      (error) => {
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }

  const getWeather = (lat, lon) => {
    let url = `http://api.weatherstack.com/current?access_key=5eb44eecc33ef8ad7fea90773ae7a6fa&query=${lat},${lon}`;
    fetch(url)
    .then(response => response.json())
    .then(data => {
        setWeather(data.current)
    })
  }

  return (
    <ScrollView>
        <Spinner
          visible={isSyncing}
          textContent={syncMessage}
          textStyle={{
            color: '#fff'
          }}
        />
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
            <Text style={[LabelStyle.weather]}>Cloud cover: {weather.cloudcover}</Text>
            <Text style={[LabelStyle.weather]}>Feels like: {weather.feelslike}°</Text>
            <Text style={[LabelStyle.weather]}>Weather update: {weather.weather_descriptions}</Text>
          </View>
          <View style={ContainerStyle.dashboard_menu}>
            <View style={ContainerStyle.menu_row}>
              <View style={[ContainerStyle.menu_container]}>
                <TouchableOpacity onPress={() => { StackNavigator.navigate("CRATabStack") }}>
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
                <TouchableOpacity onPress={() => { StackNavigator.navigate("AlertGeneration") }}>
                  <Image style={ImageStyle.dashboard_menu_icon} source={require('../../assets/marirong/menu/alert_gen.png')}></Image>
                </TouchableOpacity>
                <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Alert{"\n"}Generation</Text>
              </View>
            </View>
            <View style={ContainerStyle.menu_row}>
              <View style={[ContainerStyle.menu_container]}>
                <TouchableOpacity onPress={() => { StackNavigator.navigate("DataAnalysis") }}>
                  <Image style={ImageStyle.dashboard_menu_icon} source={require('../../assets/marirong/menu/data_analysis.png')}></Image>
                </TouchableOpacity>
                <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Data{"\n"}Analysis</Text>
              </View>
              <View style={[ContainerStyle.menu_container]}>
                <TouchableOpacity onPress={() => { StackNavigator.navigate("GroundData") }}>
                  <Image style={ImageStyle.dashboard_menu_icon} source={require('../../assets/marirong/menu/ground_data.png')}></Image>
                </TouchableOpacity>
                <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Ground Data</Text>
              </View>
              <View style={[ContainerStyle.menu_container]}>
                <TouchableOpacity onPress={() => { StackNavigator.navigate("SensorData") }}>
                  <Image style={ImageStyle.dashboard_menu_icon} source={require('../../assets/marirong/menu/sensor_data.png')}></Image>
                </TouchableOpacity>
                <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Sensor Data</Text>
              </View>
            </View>
            <View style={ContainerStyle.menu_row}>
              <View style={[ContainerStyle.menu_container]}>
                <TouchableOpacity onPress={() => { StackNavigator.navigate("MaintenanceLogsTabStack") }}>
                  <Image style={ImageStyle.dashboard_menu_icon} source={require('../../assets/marirong/menu/maintenance.png')}></Image>
                </TouchableOpacity>
                <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Maintenance</Text>
              </View>
              <View style={[ContainerStyle.menu_container]}>
                <TouchableOpacity onPress={() => { StackNavigator.navigate("EventsTemplate") }}>
                  <Image style={ImageStyle.dashboard_menu_icon} source={require('../../assets/marirong/menu/events.png')}></Image>
                </TouchableOpacity>
                <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Events</Text>
              </View>
              <View style={[ContainerStyle.menu_container]}>
                <TouchableOpacity onPress={() => { StackNavigator.navigate("DataSync") }}>
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