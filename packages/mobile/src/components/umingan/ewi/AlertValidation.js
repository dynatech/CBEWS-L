import React, { useState, useRef, useEffect } from 'react';
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
                    MobileCaching.getItem('UmiCurrentAlert').then(response => {
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
        let { status, data } = await AlertGeneration.UmiGetOngoingAndExtendedMonitoring();
        console.log("response data", data);
        if (status == true) {
            let key = "";
            if (data.latest.length > 0) key = "latest";
            else if (data.overdue.length > 0) key = "overdue";
            else if (data.extended.length > 0) key = "extended";
            if (key in data) {
                const site_data = data[key].find(site_data => site_data.site_id === 50);
                init([site_data]);
                setEwiData([site_data]);
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
            return triggers.map(row => {
                const { is_invalid, has_alert_status } = row;
                return (
                    <View key="trigger-container">
                        <View key="trigger_timestamp">
                            <Text  style={[LabelStyle.large_label, LabelStyle.brand, {textAlign: 'center', fontWeight: 'bold'}]}>
                                Time of trigger
                                <Text style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left'}]}>
                                    {row.date_time}
                                </Text>
                            </Text>
                        </View>
                        <View key="trigger_type">
                            <Text style={[LabelStyle.large_label, LabelStyle.brand, {textAlign: 'center', fontWeight: 'bold'}]}>
                                Trigger Type"
                                <Text style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left'}]}>
                                    {row.trigger}
                                </Text>
                            </Text>
                        </View>
                        <View key="data_source">
                            <Text style={[LabelStyle.large_label, LabelStyle.brand, {textAlign: 'center', fontWeight: 'bold'}]}>
                                Data Source
                                <Text style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left'}]}>
                                    {row.data_source}
                                </Text>
                            </Text>
                        </View>
                        <View key="description">
                            <Text style={[LabelStyle.large_label, LabelStyle.brand, {textAlign: 'center', fontWeight: 'bold'}]}>
                                Description
                                <Text style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left'}]}>
                                    {row.description}
                                </Text>
                            </Text>
                        </View>
                        <View style={{alignItems: 'center'}}>
                            <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                <TouchableOpacity style={ButtonStyle.small} onPress={validateTrigger(trigger, true)} disabled={row.is_invalid}>
                                    <Text style={ButtonStyle.medium_text}>Validate Trigger</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={ButtonStyle.small} onPress={validateTrigger(trigger, false)} disabled={!row.is_invalid}>
                                    <Text style={ButtonStyle.medium_text}>Invalidate Trigger</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )
            });
        } else {
            return (
                <Text style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left', color: 'red'}]} >
                    No retrigger
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
                    <View key={'timestamp_container'}>
                        <Text key="timestamp_label" style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left'}]}>
                            Latest data as of
                            <Text key={'timestamp_value'} style={[LabelStyle.large_label, LabelStyle.brand, {textAlign: 'center', fontWeight: 'bold'}]}>
                                { moment(data[0].as_of_ts).format("H:mm A, D MMMM YYYY, dddd") }
                            </Text>
                        </Text>
                    </View>
                    <View key={'alert_level_container'}>
                        <Text key="alert_level_label" style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left'}]}>
                            CANDIDATE ALERT LEVEL
                            <Text key={'alert_level_value'} style={[LabelStyle.large_label, LabelStyle.brand, {textAlign: 'center', fontWeight: 'bold'}]}>
                                { data[0].public_alert_level }
                            </Text>
                        </Text>
                    </View>{candidate_status === 'no_alert' ? "No candidate as of the moment" : candidate_status.toUpperCase()}
                    <View key={'alert_level_container'}>
                        <Text key="alert_level_label" style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left'}]}>
                            Site Status
                            <Text key={'alert_level_value'} style={[LabelStyle.large_label, LabelStyle.brand, {textAlign: 'center', fontWeight: 'bold'}]}>
                                { data[0].status === 'no_alert' ? "No candidate as of the moment" : data[0].status.toUpperCase() }
                            </Text>
                        </Text>
                    </View>
                    {
                        ![null, ''].includes(validity) && (
                            <View key={'status'}>
                                <Text key="validity" style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left'}]}>
                                    Validity
                                    <Text key={'alert_level_value'} style={[LabelStyle.large_label, LabelStyle.brand, {textAlign: 'center', fontWeight: 'bold'}]}>
                                        { moment(data[0].validity).format("H:mm A, D MMMM YYYY, dddd") }
                                    </Text>
                                </Text>
                            </View>
                        )
                    }
                    {
                        "day" in data[0] !== null && (
                            <View key={'day'}>
                                <Text key="validity" style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left'}]}>
                                    Day
                                    <Text key={'alert_level_value'} style={[LabelStyle.large_label, LabelStyle.brand, {textAlign: 'center', fontWeight: 'bold'}]}>
                                        { data[0].day }
                                    </Text>
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
        setCurrentAlert(temp)
    }

    const releaseEWI = async () => {
        // TODO: Release EWI
        console.log("EWI RELEASE CLICKED");
    }

    const releaseEWI = async (data) => {
        // TODO: Connect to messaging APP?
        const response = await AlertGeneration.InsertEWI(data);
        if (response.status) {
            // setNotifText("Successfully released EWI");
            // setOpenNotif(true);
            // setNotifStatus("success");
            updateAlertGen();
        } else {
            console.error(response.message);
            setOpenNotif(true);
                setNotifStatus("error");
                setNotifText("Failed to release EWI. Please contact the developers or file a bug report");
        };
    }

    return(
        <ScrollView>
            <View style={ContainerStyle.content}>
                <Text style={[LabelStyle.medium_label, LabelStyle.brand]}>Latest EWI Data as of { ewiDate } </Text>
                <View style={{ padding: 20}}>
                    { candidateComponent }
                </View>
                {
                    ["valid", "new", "on-going", "extended", "routine", "lowering"].includes(data[0].status) && (
                    // is_release_time && (
                        <View style={{alignItems: 'center'}}>
                            <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                <TouchableOpacity style={ButtonStyle.small} onPress={() => releaseEWI(ewi_data)} disabled={!(all_validated && is_release_time)}>
                                    <Text style={ButtonStyle.medium_text}>Release EWI</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                }
            </View>
        </ScrollView>
    )
}

export default AlertValidation