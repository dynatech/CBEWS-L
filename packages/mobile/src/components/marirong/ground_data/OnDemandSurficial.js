import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
import { Input } from 'react-native-elements';
import { Picker } from '@react-native-community/picker';
import { ContainerStyle } from '../../../styles/container_style';
import { LabelStyle } from '../../../styles/label_style';
import { ButtonStyle } from '../../../styles/button_style';
import NetworkUtils from '../../../utils/NetworkUtils';
import MobileCaching from '../../../utils/MobileCaching';

function OnDemandSurficial() {
    
    return(
        <ScrollView>
            <View style={ContainerStyle.content}>
                <Text style={[LabelStyle.large_label, LabelStyle.brand]}>On-Demand Monitoring</Text>
                <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Raise an on-demand alert</Text>
                <View style={{padding: 20}}>
                    
                </View>
            </View>
        </ScrollView>
    )
}

export default OnDemandSurficial