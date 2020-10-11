import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
import { ContainerStyle } from '../../../styles/container_style';
import { LabelStyle } from '../../../styles/label_style';
import { ButtonStyle } from '../../../styles/button_style';
import HighchartsReactNative from '@highcharts/highcharts-react-native'

function SurficialSummary() {
    return(
        <ScrollView>
            <View style={ContainerStyle.content}>
                <Text style={[LabelStyle.large_label, LabelStyle.brand]}>Surficial Data Summary</Text>
                <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Latest Reports and Surficial Graphs</Text>
            </View>
            <View style={ContainerStyle.content}>
                <Text style={[LabelStyle.medium_label, LabelStyle.brand]}>Latest Surficial Data Report</Text>
                <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Date: YYYY-MM-DD HH:mm:ss</Text>
                <View style={{alignItems: 'center', padding: 10}}>
                    <HighchartsReactNative
                        styles={{
                            backgroundColor: '#fff',
                            justifyContent: 'center',
                            flex: 1
                        }}
                        useCDN={true}
                        options={{
                            series: [{
                                data: [1, 2, 3]
                            }]
                        }}
                    />
                </View>
            </View>
        </ScrollView>
    )
}

export default SurficialSummary