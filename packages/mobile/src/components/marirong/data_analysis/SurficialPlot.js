import React, {useEffect, useState} from 'react'
import { View, Text, ScrollView } from 'react-native';
import { LabelStyle } from '../../../styles/label_style';
import { ContainerStyle } from '../../../styles/container_style';
import { MarDataAnalysis } from '@dynaslope/commons';
import SurficialMarkerGraph from '../../utils/SurficialMarkerGraph';
import NetworkUtils from '../../../utils/NetworkUtils';
import moment from 'moment';

function SurficialPlot() {
    const [currentDate, setCurrentDate] = useState(moment().format("YYYY/MM/DD HH:mm:ss"));
    const [surficialData, setSurficialData] = useState(null);

    const initSurficial = async () => {
        const response = await MarDataAnalysis.GetSurficialPlotData();
        if (response.status == true) {
            console.log("response:", response);
            setSurficialData(response);
            MobileCaching.setItem('MarSensorGraphsSurficialData', response);
        } else {
            ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
        }
    }

    useEffect(()=> {
        setTimeout( async () => {
            const isConnected = await NetworkUtils.isNetworkAvailable()
            if (isConnected != true) {
                MobileCaching.getItem('MarSensorGraphsSurficialData').then(response => {
                    console.log("Getting data from MarSensorGraphsSurficialData cache")
                    setSurficialData(response);
                });
            } else {
                initSurficial();
            }
        }, 100);
    }, []);

    return (
        <ScrollView>
            <View style={ContainerStyle.content}>
                <Text style={[LabelStyle.large_label, LabelStyle.brand]}>Surficial Plots</Text>
                <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Latest data as of {currentDate}</Text>
                <ScrollView horizontal={true}>
                    <View style={{alignItems: 'center', padding: 10}}>
                        {
                            surficialData &&
                                <SurficialMarkerGraph 
                                    props={surficialData}
                                />
                        }
                    </View>
                </ScrollView>
            </View>
        </ScrollView>
    )
}

export default SurficialPlot;