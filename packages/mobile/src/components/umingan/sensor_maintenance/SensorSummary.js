import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
import { ContainerStyle } from '../../../styles/container_style';
import { LabelStyle } from '../../../styles/label_style';
import { ButtonStyle } from '../../../styles/button_style';

function SensorSummary() {
    return(
        <ScrollView>
            <View style={ContainerStyle.content}>
                <Text style={[LabelStyle.large_label, LabelStyle.brand]}>Sensor Report Summary</Text>
                <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Latest report as of YYYY-MM-DD HH:mm:ss</Text>
            </View>
        </ScrollView>
    )
}

export default SensorSummary