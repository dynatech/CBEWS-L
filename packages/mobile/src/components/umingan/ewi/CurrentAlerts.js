import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
import { ContainerStyle } from '../../../styles/container_style';
import { LabelStyle } from '../../../styles/label_style';
import { ButtonStyle } from '../../../styles/button_style';
import { AlertGeneration } from '@dynaslope/commons';
import moment from 'moment';
import MobileCaching from '../../../utils/MobileCaching';
import NetworkUtils from '../../../utils/NetworkUtils';

function CurrentAlerts() {

    const [currentAlert, setCurrentAlert] = useState([]);
    const [currentAlertData, setCurrentAlertData] = useState([]);
    const [ewiDate, setEwiDate] = useState(moment().format('MMMM Do YYYY, h:mm:ss a'));
    const [isDisabled, setDisabled] = useState(false);

    useEffect(()=> {
        setTimeout( async ()=> {
            const isConnected = await NetworkUtils.isNetworkAvailable()
            if (isConnected != true) {
              Alert.alert(
                'CBEWS-L is not connected to the internet',
                'CBEWS-L Local data will be used.',
                [
                  { text: 'Ok', onPress: () => {
                    MobileCaching.getItem('UmiCurrentAlert').then(response => {
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
        let { status, data } = await AlertGeneration.UmiGetOngoingAndExtendedMonitoring();
        console.log("response data", data);
        if (status == true) {
            let key = "";
            if (data.latest.length > 0) key = "latest";
            else if (data.overdue.length > 0) key = "overdue";
            else if (data.extended.length > 0) key = "extended";
            if (key in data) {
                const site_data = data[key].find(site_data => site_data.site_id === 50);
                console.log("cachiiing");
                init([site_data]);
                setCurrentAlertData([site_data]);
                MobileCaching.setItem('UmiCurrentAlert', [site_data]);
            } else {
                console.error("There is something wrong with the code in latest current alert");
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
                    No retriggerss
                </Text>
            )
        }   
    }

    const init = async (data) => {
        let temp = [];
        if (data.length != 0) {
            console.log("pushing temp...");
            temp.push(
                <View key={'container'}>
                    <View key={'alert_level_container'}>
                        <Text key={'feature'} style={[LabelStyle.large_label, LabelStyle.brand, {textAlign: 'center', fontWeight: 'bold'}]}>
                            ALERT LEVEL { data[0].public_alert_level }
                        </Text>
                    </View>
                    <View key={'event_details_container'}>
                        <Text key={'materials_characterization'} style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left', fontWeight: 'bold'}]}>
                            Event Started 
                        </Text>
                        <Text key={'feature_value'}style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left'}]}>
                            { moment(data[0].event_start).format('MMMM Do YYYY, h:mm:ss a') }
                        </Text>
                        {/* <Text key={'materials_characterization_value'}style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left'}]}>
                            { data[0].materials_characterization }
                        </Text> */}
                    </View>
                    {
                        ['lowering', 'extended'].includes(data[0].event_status) || (data[0].event_status == "on-going" && data.public_alert_level == 0) ? (
                            <View key={'other_status'}>
                                <Text key="lowering_extended">Day <strong>{
                                        "day" in leo[0] ? data.day : '0'
                                    }</strong> of Extended Monitoring
                                </Text>
                            </View>
                        ) : (
                            <View key="validity">
                                <Text key={'mechanism'} style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left', fontWeight: 'bold'}]}>
                                    Alert Validity
                                </Text>
                                <Text key={'mechanism_value'}style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left'}]}>
                                    { data[0].validity }
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
            setEwiDate(moment(data[0].data_ts).format('MMMM Do YYYY, h:mm:ss a'));
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

    const releaseEWI = async () => {
        // TODO: Release EWI
        console.log("EWI RELEASE CLICKED")
    }

    const sendEWI = async () => {
        // TODO: Connect to messaging APP?
        console.log("EWI SEND CLICKED")
    }

    return(
        <ScrollView>
            <View style={ContainerStyle.content}>
                <Text style={[LabelStyle.medium_label, LabelStyle.brand]}>Latest EWI Data as of { ewiDate } </Text>
                <View style={{ padding: 20}}>
                    { currentAlert }
                </View>
                <View style={{alignItems: 'center'}}>
                    <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                        <TouchableOpacity style={ButtonStyle.small} onPress={sendEWI} disabled={isDisabled}>
                            <Text style={ButtonStyle.medium_text}>Send EWI</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default CurrentAlerts