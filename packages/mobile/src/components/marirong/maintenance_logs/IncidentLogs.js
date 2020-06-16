import React, { useState, useEffect } from 'react';
import { View, Text, ToastAndroid, TouchableOpacity, ScrollView } from 'react-native';
import { List, ListItem } from 'react-native-elements'
import { ContainerStyle } from '../../../styles/container_style';
import { LabelStyle } from '../../../styles/label_style';
import { ButtonStyle } from '../../../styles/button_style';
import { MarCommunityRiskAssessment } from '@dynaslope/commons';
import MobileCaching from '../../../utils/MobileCaching';

function IncidentLogs () {
    return(
        <View style={ContainerStyle.content}>
            <Text style={[LabelStyle.large_label, LabelStyle.brand]}>Incident Logs</Text>
            <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Logs and Reports</Text>
        </View>
    )
}

export default IncidentLogs;