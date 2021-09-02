import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
import { DataTable } from 'react-native-paper';
import { ContainerStyle } from '../../../styles/container_style';
import { LabelStyle } from '../../../styles/label_style';
import { ButtonStyle } from '../../../styles/button_style';
import { UmiSituationReport } from '@dynaslope/commons';
import moment from 'moment';
import { Calendar } from 'react-native-calendars';
import Forms from '../../utils/Forms';
import MobileCaching from '../../../utils/MobileCaching';
import NetworkUtils from '../../../utils/NetworkUtils';

function CurrentSituationReport() {

    const [situationReport, setSituationReport] = useState([]);
    const [situationReportContainer, setSituationReportContainer] = useState([]);
    const [situationReportDate, setSituationReportDate] = useState(moment().format('MMMM Do YYYY, h:mm:ss a'));
    const [isDisabled, setDisabled] = useState(false);

    const listTable = [{
        'id': 0,
        'attachment_path': 'N/A',
        'report_summary': 'Summary',
        'report_ts': moment()
    }];

    useEffect(()=> {  
        fetchLatestData(); 
    }, []);

    const fetchLatestData = async () => {
        init(listTable);
    }

    const init = async (data) => {
        let temp = [];
        if (data.length != 0) {
            temp.push(
                <View key={'container'}>
                    <View key={'feature_container'}>
                        <Text key={'situation_report_summary'} style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left', fontWeight: 'bold'}]}>
                            Situation Report Summary
                        </Text>
                        <Text key={'feature_value'}style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left'}]}>
                            { data[0].report_summary }
                        </Text>
                    </View>
                    <View key={'attachments'}>
                        <Text key={'materials_characterization'} style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left', fontWeight: 'bold'}]}>
                            Attachments
                        </Text>
                        <Text key={'materials_characterization_value'}style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left'}]}>
                            { data[0].attachment_path }
                        </Text>
                    </View>
                </View>
            )
            setSituationReportDate(moment(data[0].report_ts).format('MMMM Do YYYY, h:mm:ss a'));
        }
        setSituationReportContainer(temp);
    }

    const download = async () => {

    }

    const email = async () => {

    }
    
    return(
        <ScrollView>
            <View style={ContainerStyle.content}>
                <Text style={[LabelStyle.large_label, LabelStyle.brand]}>Latest Situation Report as of { situationReportDate } </Text>
                <View style={{ padding: 20}}>
                    { situationReportContainer }
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

export default CurrentSituationReport;