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
        setTimeout( async ()=> {
            const isConnected = await NetworkUtils.isNetworkAvailable()
            if (isConnected != true) {
              Alert.alert(
                'CBEWS-L is not connected to the internet',
                'CBEWS-L Local data will be used.',
                [
                  { text: 'Ok', onPress: () => {
                    MobileCaching.getItem('UmiCandidateAlert').then(response => {
                        init(response);
                        setEwiData(response);
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
        let { status, data, message } = await AlertGeneration.GetUmiAlertValidationData();
        if (status) {
            init([data]);
            setEwiData([data]);
            MobileCaching.setItem('UmiCandidateAlert', [data]);
            ToastAndroid.showWithGravity(message, ToastAndroid.LONG, ToastAndroid.BOTTOM)
        } else {
            ToastAndroid.showWithGravity(message, ToastAndroid.LONG, ToastAndroid.BOTTOM)
        }
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

        const response = await AlertGeneration.ValidateTrigger(payload);
        if (status) {
            ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.BOTTOM)
            fetchLatestData();
        } else {
            ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.BOTTOM)
        };
    }
    

    const PrepareTriggers = (triggers) => {
        if (triggers !== undefined) {
            if (triggers.length > 0) {
                return triggers.map(row => {
                    const { is_invalid, has_alert_status } = row;
                    const validate_btn_style = [ButtonStyle.small];
                    const invalidate_btn_style = [ButtonStyle.small];
                    if (is_invalid && has_alert_status) invalidate_btn_style.push(ButtonStyle.invalid);
                    else if (!is_invalid && has_alert_status) validate_btn_style.push(ButtonStyle.valid);
    
                    return (
                        <View key="trigger-container">
                            <View key="trigger_timestamp">
                                <Text  style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left', fontWeight: 'bold'}]}>
                                    Time of trigger
                                </Text>
                                <Text style={[LabelStyle.small_label, LabelStyle.brand, {textAlign: 'center'}]}>
                                    {row.date_time}
                                </Text>
                            </View>
                            <View key="trigger_type">
                                <Text style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left', fontWeight: 'bold'}]}>
                                    Trigger Type"
                                </Text>
                                <Text style={[LabelStyle.small_label, LabelStyle.brand, {textAlign: 'center'}]}>
                                    {row.trigger}
                                </Text>
                            </View>
                            <View key="data_source">
                                <Text style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left', fontWeight: 'bold'}]}>
                                    Data Source
                                </Text>
                                <Text style={[LabelStyle.small_label, LabelStyle.brand, {textAlign: 'center'}]}>
                                    {row.data_source}
                                </Text>
                            </View>
                            <View key="description">
                                <Text style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left', fontWeight: 'bold'}]}>
                                    Description
                                </Text>
                                <Text style={[LabelStyle.small_label, LabelStyle.brand, {textAlign: 'center'}]}>
                                    {row.description}
                                </Text>
                            </View>
                            <View style={{alignItems: 'center'}}>
                                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                    <TouchableOpacity style={validate_btn_style} onPress={validateAlertTrigger(row, true)} disabled={row.is_invalid}>
                                        <Text style={ButtonStyle.medium_text}>Validate Trigger</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={invalidate_btn_style} onPress={validateAlertTrigger(row, false)} disabled={!row.is_invalid}>
                                        <Text style={ButtonStyle.medium_text}>Invalidate Trigger</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )
                });
            }
        } else {
            return (
                <Text style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'center', color: 'red'}]} >
                    No retrigger
                </Text>
            )
        }   
    }

    const init = async (data) => {
        let temp = [];
        const alert_style = [LabelStyle.large_label, LabelStyle.brand, {textAlign: 'center', fontWeight: 'bold'}];

        if (data.length != 0) {
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
                                `Candidate Alert Level { data[0].public_alert_level }`
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
        const response = await AlertGeneration.InsertEWI(data);
        if (response.status) {
            fetchLatestData();
        } else console.error("Problem in releasing ewi: ", response.message);
        ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.BOTTOM)
    }

    const getButton = (data) => {
        const issues = [];
        if (!data.all_validated) issues.push("Triggers should be validated");
        if (!data.is_release_time) issues.push("It is not yet release time");

        let ui = <Text>Test</Text>
        if (issues.length > 0) ui = issues.map((item, index) => <Text key={`issue-${index}`} style={[{color: "red"}]}>{item}</Text>)
        else ui = (
            <TouchableOpacity style={ButtonStyle.small} onPress={() => releaseEWI(data)}>
                <Text style={ButtonStyle.medium_text}>Release EWI</Text>
            </TouchableOpacity>
        )
        return ui;
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