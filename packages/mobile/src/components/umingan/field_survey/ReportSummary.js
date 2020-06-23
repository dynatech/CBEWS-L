import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
import { DataTable } from 'react-native-paper';
import { ContainerStyle } from '../../../styles/container_style';
import { LabelStyle } from '../../../styles/label_style';
import { ButtonStyle } from '../../../styles/button_style';
import { Calendar } from 'react-native-calendars';
import Forms from '../../utils/Forms';
import MobileCaching from '../../../utils/MobileCaching';

function ReportSummary() {
    return(
        <ScrollView>
            <View style={ContainerStyle.content}>
                <Text style={[LabelStyle.large_label, LabelStyle.brand]}>Latest Field Survey Report as of (insert_last_ts) </Text>
                <View style={{ padding: 20}}>
                    <Text style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left'}]}>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                    </Text>
                </View>
                <View style={{alignItems: 'center'}}>
                    <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                        <TouchableOpacity style={ButtonStyle.small}>
                            <Text style={ButtonStyle.medium_text}>Download</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={ButtonStyle.small}>
                            <Text style={ButtonStyle.medium_text}>Send</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default ReportSummary