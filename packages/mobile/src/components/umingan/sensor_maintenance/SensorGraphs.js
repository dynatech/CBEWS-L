import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
import { ContainerStyle } from '../../../styles/container_style';
import { LabelStyle } from '../../../styles/label_style';
import { ButtonStyle } from '../../../styles/button_style';

function SensorGraphs() {
    return(
        <ScrollView>
            <View style={ContainerStyle.content}>
                <Text style={[LabelStyle.large_label, LabelStyle.brand]}>Rainfall and Subsurface Graphs</Text>
                <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Latest data as of YYYY-MM-DD HH:mm:ss</Text>
            </View>
        </ScrollView>
    )
}

export default SensorGraphs