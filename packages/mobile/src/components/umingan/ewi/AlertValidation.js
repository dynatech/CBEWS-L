import React, { useState, useRef, useEffect, Fragment } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
import { ContainerStyle } from '../../../styles/container_style';
import { LabelStyle } from '../../../styles/label_style';
import { ButtonStyle } from '../../../styles/button_style';
import { AlertGeneration } from '@dynaslope/commons';
import moment from 'moment';
import MobileCaching from '../../../utils/MobileCaching';
import NetworkUtils from '../../../utils/NetworkUtils';

function AlertValidation() {

    const [candidateComponent, setCandidateComponent] = useState([]);
    const [ewi_data, setEwiData] = useState([]);
    const [ewiDate, setEwiDate] = useState(moment().format('MMMM Do YYYY, h:mm:ss a'));
    const [isDisabled, setDisabled] = useState(false);

    useEffect(()=> {
    }, []);

    const fetchLatestData = async () => {
    }


    const validateAlertTrigger = (trigger, status) => async () => {
        let alert_validity = 0;
        let remark = "";
        if (status) {
            alert_validity = 1;
            remark = "valid trigger";
        } else {
            alert_validity = -1;
            remark = "invalid trigger";
        }

        const payload = {
            trigger_id: trigger["trigger_id"],
            alert_status: alert_validity,
            remarks: remark,
            user_id: 1,
            ts_last_retrigger: trigger["date_time"]
        };

        const response = null;
    }
    

    const PrepareTriggers = (triggers) => {
    }

    const init = async (data) => {
        let temp = [];
        const alert_style = [LabelStyle.large_label, LabelStyle.brand, {textAlign: 'center', fontWeight: 'bold'}];

        if (data.length > 0 && data[0]) {
            if (data[0].public_alert_level === 1) alert_style.push(LabelStyle.level_one);
            else if (data[0].public_alert_level === 2) alert_style.push(LabelStyle.level_two);
            else if (data[0].public_alert_level === 3) alert_style.push(LabelStyle.level_three);

            let status = data[0].status;
            if (status === "new") status = "Onset"

            temp.push(
                <View key={'container'}>
                    <Text> </Text>
                    {
                        PrepareTriggers(data[0].release_triggers)
                    }
                    {
                        status !== "no_alert" && (
                            <Text key={'alert_level_value'} style={alert_style}>
                                Candidate Alert Level { data[0].public_alert_level }
                                </Text>
                        )
                    }
                    {/* <View key="trigger_timestamp">
                        <Text  style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left', fontWeight: 'bold'}]}>
                            Time of trigger
                        </Text>
                        <Text style={[LabelStyle.small_label, LabelStyle.brand, {textAlign: 'center'}]}>
                            {row.date_time}
                        </Text>
                    </View> */}
                    <View key={'site_status_container'}>
                        <Text key="site_status_label" style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'center'}]}>
                            Site Status
                        </Text>
                        {
                            status === "extended" ? (
                                <Text key="site_status_value" style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'center', fontWeight: 'bold'}]}>
                                    Day { data[0].day } of Extended Monitoring
                                </Text>
                            ) : (
                                <Text key={'site_status_value'} style={[LabelStyle.large_label, LabelStyle.brand, {textAlign: 'center', fontWeight: 'bold'}]}>
                                    { status === 'no_alert' ? "No candidate as of the moment" : status }
                                </Text>
                            )
                        }
                    </View>
                    {
                        ![null, ''].includes(data[0].validity) && (
                            <View key={'validity_container'}>
                                <Text key="validity_label" style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'center'}]}>
                                    Validity 
                                </Text>
                                <Text key={'validity_value'} style={[LabelStyle.large_label, LabelStyle.brand, {textAlign: 'center', fontWeight: 'bold'}]}>
                                    { moment(data[0].validity).format("H:mm A, D MMMM YYYY, dddd") }
                                </Text>
                            </View>
                        )
                    }
                    {
                        data[0]["extend_rain_x"] == true && (
                            <View key={'rx_container'}>
                                <Text key={'rx_value'} style={[LabelStyle.large_label, LabelStyle.brand, {textAlign: 'center', color: '#FF7B00'}]}>
                                    { data[0]["rx_data"]["message"] }
                                </Text>
                            </View>
                        )
                    }

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
        setCandidateComponent(temp)
    }

    const releaseEWI = async (data) => {
    }

    const getButton = (data) => {
    }

    return(
        <ScrollView>
            <View style={ContainerStyle.content}>
                <Text style={[LabelStyle.medium_label, LabelStyle.brand]}>Latest EWI Data as of { ewiDate } </Text>
                <View style={{ padding: 20}}>
                    { candidateComponent }
                </View>
                {
                    ewi_data.length > 0 && (
                        <View>
                            {
                                ["valid", "new", "on-going", "extended", "routine", "lowering"].includes(ewi_data[0].status) && (
                                    <View style={{alignItems: 'center'}}>
                                        <View style={{ alignItems: 'center'}}>
                                            {getButton(ewi_data[0])}
                                        </View>
                                    </View>
                                )
                            }
                        </View>
                    )
                }
            </View>
        </ScrollView>
    )
}

export default AlertValidation