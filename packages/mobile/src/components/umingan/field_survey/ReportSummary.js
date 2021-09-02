import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
import { ContainerStyle } from '../../../styles/container_style';
import { LabelStyle } from '../../../styles/label_style';
import { ButtonStyle } from '../../../styles/button_style';
import { UmiFieldSurvey } from '@dynaslope/commons';
import moment from 'moment';
import MobileCaching from '../../../utils/MobileCaching';
import NetworkUtils from '../../../utils/NetworkUtils';

function ReportSummary() {

    const [fieldSurveyReport, setFieldSurveyReport] = useState([]);
    const [fieldSurvey, setFieldSurvey] = useState([]);
    const [fieldSurveyReportDate, setFieldSurveyReportDate] = useState(moment().format('MMMM Do YYYY, h:mm:ss a'));
    const [isDisabled, setDisabled] = useState(false);

    const listTable = [{
        'id': 0,
        'feature': 'feat',
        'materials_characterization': 'mc',
        'mechanism': 'mech',
        'exposure': 'exp',
        'report_narrative': 'notes',
        'report_date': moment()
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
                        <Text key={'feature'} style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left', fontWeight: 'bold'}]}>
                            Feature
                        </Text>
                        <Text key={'feature_value'}style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left'}]}>
                            { data[0].feature }
                        </Text>
                    </View>
                    <View key={'materials_characterization_container'}>
                        <Text key={'materials_characterization'} style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left', fontWeight: 'bold'}]}>
                            Materials Characterization
                        </Text>
                        <Text key={'materials_characterization_value'}style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left'}]}>
                            { data[0].materials_characterization }
                        </Text>
                    </View>
                    <View key={'mechanism_container'}>
                        <Text key={'mechanism'} style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left', fontWeight: 'bold'}]}>
                            Mechanism
                        </Text>
                        <Text key={'mechanism_value'}style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left'}]}>
                            { data[0].mechanism }
                        </Text>
                    </View>
                    <View key={'exposure_container'}>
                        <Text key={'exposure'} style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left', fontWeight: 'bold'}]}>
                            Exposure
                        </Text>
                        <Text key={'exposure_value'}style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left'}]}>
                            { data[0].exposure }
                        </Text>
                    </View>
                    <View key={'note_container'}>
                        <Text key={'note'} style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left', fontWeight: 'bold', color: 'red'}]}>
                            Note
                        </Text>
                        <Text key={'note_value'}style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left', color: 'red'}]}>
                            { data[0].report_narrative }
                        </Text>
                    </View>
                </View>
            )
            setFieldSurveyReportDate(moment(data[0].report_date).format('MMMM Do YYYY, h:mm:ss a'));
        } else {
            temp.push(
                <Text key={0} style={[LabelStyle.medium_label, LabelStyle.brand, {fontWeight: 'bold'}]}>
                    No field survey report available.
                </Text>
            )
            setDisabled(true);
        }
        setFieldSurveyReport(temp)
    }

    const download = async () => {
    }

    const email = async () => {
    }

    return(
        <ScrollView>
            <View style={ContainerStyle.content}>
                <Text style={[LabelStyle.large_label, LabelStyle.brand]}>Latest Field Survey Report as of { fieldSurveyReportDate } </Text>
                <View style={{ padding: 20}}>
                    { fieldSurveyReport }
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

export default ReportSummary