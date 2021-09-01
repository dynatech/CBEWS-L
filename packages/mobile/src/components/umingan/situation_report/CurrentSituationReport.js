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

    const init = (data) => {

    }

    const download = async () => {
        // TODO: Dev this function when the Web functionality is available
    }

    const email = async () => {
        // TODO: Dev this function when the Web functionality is available
    }

    useEffect(()=> {
        init();
    }, []);

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