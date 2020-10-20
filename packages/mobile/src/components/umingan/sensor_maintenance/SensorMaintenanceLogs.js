import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
import { ContainerStyle } from '../../../styles/container_style';
import { LabelStyle } from '../../../styles/label_style';
import { ButtonStyle } from '../../../styles/button_style';

function SensorMaintenanceLogs() {
    return(
        <ScrollView>
            <View style={ContainerStyle.content}>
                <Text style={[LabelStyle.large_label, LabelStyle.brand]}>Sensor Maintenance Logs</Text>
                <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Add / Update / Delete Maintenance logs</Text>
            </View>
        </ScrollView>
    )
}

export default SensorMaintenanceLogs