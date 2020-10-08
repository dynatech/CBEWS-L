import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
import { ContainerStyle } from '../../../styles/container_style';
import { LabelStyle } from '../../../styles/label_style';
import { ButtonStyle } from '../../../styles/button_style';

function SurficialSummary() {
    return(
        <ScrollView>
            <View style={ContainerStyle.content}>
                <Text style={[LabelStyle.large_label, LabelStyle.brand]}>Surficial Data Summary</Text>
                <Text style={[LabelStyle.small_label, LabelStyle.brand]}>View Surficial Graphs</Text>
            </View>
        </ScrollView>
    )
}

export default SurficialSummary