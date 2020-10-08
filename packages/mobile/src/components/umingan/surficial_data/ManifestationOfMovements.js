import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
import { ContainerStyle } from '../../../styles/container_style';
import { LabelStyle } from '../../../styles/label_style';
import { ButtonStyle } from '../../../styles/button_style';

function ManifestationOfMovements() {
    return(
        <ScrollView>
            <View style={ContainerStyle.content}>
                <Text style={[LabelStyle.large_label, LabelStyle.brand]}>Manifestation of Movements</Text>
                <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Add / Edit / Delete Manifestation of Movements Data</Text>
            </View>
        </ScrollView>
    )
}

export default ManifestationOfMovements