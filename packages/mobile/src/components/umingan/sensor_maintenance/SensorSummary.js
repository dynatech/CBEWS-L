import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
import { ContainerStyle } from '../../../styles/container_style';
import { LabelStyle } from '../../../styles/label_style';
import { ButtonStyle } from '../../../styles/button_style';
import { UmiSensorMaintenance } from '@dynaslope/commons';
import MobileCaching from '../../../utils/MobileCaching';
import NetworkUtils from '../../../utils/NetworkUtils';
import moment from 'moment';

function SensorSummary() {
    const [isDisabled, setDisabled] = useState(false);
    const [sensorMaintenanceLogs, setSensorMaintenanceLogs] = useState([]);
    const [latestTs, setTs] = useState(moment().format('MMMM Do YYYY, h:mm:ss a'))
    const [summary, setSummary] = useState(null); 

    const listTable = [{
        'id': 0,
        'timestamp': moment().add(-1,'days').format('MMMM Do YYYY, h:mm:ss a'),
        'working_nodes': '14',
        'anomalous_nodes': '1',
        'rain_gauge_status': 'still working',
        'remarks': 'test',
        'report_date': moment()
    }];

    const download = () => {
    }

    const email = () => {
    }

    const init = async (data) => {
        let temp = [];
        if (data.length != 0) {
            temp.push(
                <View key={'container'}>
                    <View key={'timestamp'}>
                        <Text key={'timestamp'} style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left', fontWeight: 'bold'}]}>
                            Maintenance Timestamp
                        </Text>
                        <Text key={'timestamp_value'}style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left'}]}>
                            { data[0].timestamp }
                        </Text>
                    </View>
                    <View key={'working_nodes'}>
                        <Text key={'working_nodes'} style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left', fontWeight: 'bold'}]}>
                            Working nodes
                        </Text>
                        <Text key={'working_nodes_value'}style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left'}]}>
                            { data[0].working_nodes }
                        </Text>
                    </View>
                    <View key={'anomalous_nodes'}>
                        <Text key={'anomalous_nodes'} style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left', fontWeight: 'bold'}]}>
                            Anomalous nodes
                        </Text>
                        <Text key={'anomalous_nodes_value'}style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left'}]}>
                            { data[0].anomalous_nodes }
                        </Text>
                    </View>
                    <View key={'rain_gauge_status'}>
                        <Text key={'rain_gauge_status'} style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left', fontWeight: 'bold'}]}>
                            Rain Gauge Status
                        </Text>
                        <Text key={'rain_gauge_status_value'}style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left'}]}>
                            { data[0].rain_gauge_status }
                        </Text>
                    </View>
                    <View key={'remarks'}>
                        <Text key={'remarks'} style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left', fontWeight: 'bold'}]}>
                            Remarks
                        </Text>
                        <Text key={'remarks_value'}style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left'}]}>
                            { data[0].remarks }
                        </Text>
                    </View>
                </View>
            )
            setTs(moment(data[0].report_date).format('MMMM Do YYYY, h:mm:ss a'));
        } else {
            temp.push(
                <Text key={0} style={[LabelStyle.medium_label, LabelStyle.brand, {fontWeight: 'bold'}]}>
                    No Sensor Maintenance Logs report available.
                </Text>
            )
            setDisabled(true);
        }
        setSummary(temp)
    }

    const fetchLatestData = async () => {
        init(listTable);
    };

    useEffect(()=> {
        fetchLatestData();
    }, []);

    return(
        <ScrollView>
            <View style={ContainerStyle.content}>
                <Text style={[LabelStyle.large_label, LabelStyle.brand]}>Sensor Report Summary</Text>
                <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Latest report as of {latestTs}</Text>
                <View style={{ padding: 20}}>
                    { summary }
                </View>
                <View style={{alignItems: 'center'}}>
                    <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                        <TouchableOpacity style={ButtonStyle.small} onPress={download} disabled={isDisabled}>
                            <Text style={ButtonStyle.medium_text}>Download</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={ButtonStyle.small} onPress={email} disabled={isDisabled}>
                            <Text style={ButtonStyle.medium_text}>Send</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default SensorSummary