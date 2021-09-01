import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ToastAndroid, Alert, Linking, Platform } from 'react-native';
import { ContainerStyle } from '../../../styles/container_style';
import { LabelStyle } from '../../../styles/label_style';
import { ButtonStyle } from '../../../styles/button_style';
import { AlertGeneration } from '@dynaslope/commons';
import moment from 'moment';
import MobileCaching from '../../../utils/MobileCaching';
import NetworkUtils from '../../../utils/NetworkUtils';
import Helpers from '../../utils/Helpers';

function CurrentAlerts() {

    const [currentAlert, setCurrentAlert] = useState([]);
    const [currentAlertData, setCurrentAlertData] = useState([]);
    const [ewiDate, setEwiDate] = useState(moment().format('MMMM Do YYYY, h:mm:ss a'));
    const [isDisabled, setDisabled] = useState(false);
    const [ewiSMS, setEWISMS] = useState("");

    const fetchLatestData = async () => {
    }

    const PrepareTriggers = (triggers) => {   
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
                            { moment(data[0].event_start).format('MMMM Do YYYY, h:mm:ss a') }
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