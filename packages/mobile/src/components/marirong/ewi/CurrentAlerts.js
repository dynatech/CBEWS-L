import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
import { ContainerStyle } from '../../../styles/container_style';
import { LabelStyle } from '../../../styles/label_style';
import { ButtonStyle } from '../../../styles/button_style';
import { AlertGeneration } from '@dynaslope/commons';
import moment from 'moment';
import MobileCaching from '../../../utils/MobileCaching';
import NetworkUtils from '../../../utils/NetworkUtils';
import Helpers from '../../utils/Helpers';
import { Linking } from 'react-native';

function CurrentAlerts() {

    const [currentAlert, setCurrentAlert] = useState([]);
    const [currentAlertData, setCurrentAlertData] = useState([]);
    const [ewiDate, setEwiDate] = useState(moment().format('MMMM Do YYYY, h:mm A'));
    const [isDisabled, setDisabled] = useState(false);
    const [ewiSMS, setEWISMS] = useState("");

    useEffect(()=> {
        setTimeout( async ()=> {
            const isConnected = await NetworkUtils.isNetworkAvailable()
            if (isConnected != true) {
              Alert.alert(
                'CBEWS-L is not connected to the internet',
                'CBEWS-L Local data will be used.',
                [
                  { text: 'Ok', onPress: () => {
                    MobileCaching.getItem('MarCurrentAlert').then(response => {
                        init(response);
                        setCurrentAlertData(response);
                    });
                  }, style: 'cancel' },
                ]
              )
            } else {
                fetchLatestData();
            }
          },100);
    }, []);

    const fetchLatestData = async () => {
        let { status, data } = await AlertGeneration.MarGetOngoingAndExtendedMonitoring();
        console.log("response data", data);
        if (status) {
            let key = "";
            if (data.latest.length > 0) key = "latest";
            else if (data.overdue.length > 0) key = "overdue";
            else if (data.extended.length > 0) key = "extended";
            else if ("routine_list" in data.routine) key = "routine";

            if (key in data) {
                const site_data = data[key].find(site_data => site_data.site_id === 29);
                console.log("cachiiing");
                init([site_data]);
                setCurrentAlertData([site_data]);
                MobileCaching.setItem('MarCurrentAlert', [site_data]);
                ToastAndroid.showWithGravity("Successfully retrieved current event", ToastAndroid.LONG, ToastAndroid.CENTER)
            } else {
                init([]);
                setCurrentAlertData([]);
                MobileCaching.setItem('MarCurrentAlert', []);
                ToastAndroid.showWithGravity("No current event", ToastAndroid.LONG, ToastAndroid.CENTER)
            }
        } else {
            ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
        }
    }

    const PrepareTriggers = (triggers) => {
        if (triggers.length > 0) {
            return triggers.map(trigger => {
                const { trigger_type, timestamp, info, trigger_source } = trigger;
                return (
                    <Text key={`${trigger_type}-${timestamp}`} style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left', color: 'red'}]} >
                        {`${moment(timestamp).format("MMMM D, YYYY h:mm A")} | ${trigger_source.toUpperCase()} (${trigger_type}): ${info}`}
                    </Text>
                );
            });
        } else {
            return (
                <Text style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left', color: 'red'}]} >
                    No retriggers
                </Text>
            )
        }   
    }

    const init = async (data) => {
        console.log("CURRENT ALERT", data);
        let temp = [];
        const alert_style = [LabelStyle.large_label, LabelStyle.brand, {textAlign: 'center', fontWeight: 'bold'}];

        if (data.length > 0 && data[0]) {
            const alert_level = data[0].public_alert_level;
            const ts_str = data[0].data_ts;
            
            let ewi_sms_str = `Magandang ${Helpers.getGreeting(moment())} po.\n\nAlert ${alert_level} ang alert level sa Brgy. Umingan, Alimodian, Iloilo ngayong ${ts_str}. Ang recommended response ay `;
            let response = "";
            if (alert_level === 1) {
                alert_style.push(LabelStyle.level_one);
                response = " MANATILI SA BAHAY AT MAGHANDA PARA SA SUSUNOD NA EWI."
            } else if (alert_level === 2) {
                alert_style.push(LabelStyle.level_two);
                response = " MAGHANDANG LUMIKAS KUNG SAKALING TUMAAS PA ANG ALERT."
            } else if (alert_level === 3) {
                alert_style.push(LabelStyle.level_three);
                response = " LUMIKAS MULA SA SITE."
            }
            setEWISMS(`${ewi_sms_str} ${response}`);

            temp.push(
                <View key={'container'}>
                    <View key={'alert_level_container'}>
                        <Text key={'feature'} style={alert_style}>
                            ALERT LEVEL { data[0].public_alert_level }
                        </Text>
                    </View>
                    <View key={'event_details_container'}>
                        <Text key={'materials_characterization'} style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left', fontWeight: 'bold'}]}>
                            Event Started 
                        </Text>
                        <Text key={'feature_value'}style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left'}]}>
                            { moment(data[0].event_start).format('MMMM D, YYYY h:mm A') }
                        </Text>
                        {/* <Text key={'materials_characterization_value'}style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left'}]}>
                            { data[0].materials_characterization }
                        </Text> */}
                    </View>
                    {
                        ['lowering', 'extended'].includes(data[0].event_status) || (data[0].event_status == "on-going" && data.public_alert_level == 0) ? (
                            <View key={'other_status'}>
                                <Text key="lowering_extended" style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left', fontWeight: 'bold'}]}>
                                    Day {
                                        "day" in data[0] ? data[0].day : '0'
                                    } of Extended Monitoring
                                </Text>
                            </View>
                        ) : (
                            <View key="validity">
                                <Text key={'mechanism'} style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left', fontWeight: 'bold'}]}>
                                    Alert Validity
                                </Text>
                                <Text key={'mechanism_value'}style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left'}]}>
                                    { moment(data[0].validity).format('MMMM D, YYYY h:mm A') }
                                </Text>
                            </View>
                        )
                    }
                    <View key={'exposure_container'}>
                        <Text key={'exposure'} style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left', fontWeight: 'bold'}]}>
                            Recommended Response
                        </Text>
                        <Text key={'exposure_value'}style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left'}]}>
                            { data[0].recommended_response }
                        </Text>
                    </View>
                    <View key={'note_container'}>
                        <Text key={'note'} style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left', fontWeight: 'bold', color: 'red'}]}>
                            Triggers
                        </Text>
                        {PrepareTriggers(data[0].latest_event_triggers)}
                    </View>
                </View>
            )
            setEwiDate(moment(data[0].data_ts).format('MMMM Do YYYY, h:mm A'));
        } else {
            temp.push(
                <Text key={0} style={[LabelStyle.medium_label, LabelStyle.brand, {fontWeight: 'bold'}]}>
                    No alert on site.
                </Text>
            )
            setDisabled(true);
        }

        console.log("temp", temp);
        setCurrentAlert(temp)
    }

    const sendEWI = async () => {
        Linking.openURL(`sms:?addresses=null&body=${ewiSMS}`);
    }

    return(
        <ScrollView>
            <View style={ContainerStyle.content}>
                <Text style={[LabelStyle.medium_label, LabelStyle.brand]}>Latest EWI Data as of { ewiDate } </Text>
                <View style={{ padding: 20}}>
                    { currentAlert }
                </View>
                {
                    currentAlertData.length > 0 && (
                        <View style={{alignItems: 'center'}}>
                            <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                <TouchableOpacity style={ButtonStyle.small} onPress={sendEWI} disabled={isDisabled}>
                                    <Text style={ButtonStyle.medium_text}>Send EWI</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                }
            </View>
        </ScrollView>
    )
}

export default CurrentAlerts