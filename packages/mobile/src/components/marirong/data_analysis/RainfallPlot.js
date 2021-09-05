import React, {useEffect, useState} from 'react'
import { View, Text, ScrollView } from 'react-native';
import { LabelStyle } from '../../../styles/label_style';
import { ContainerStyle } from '../../../styles/container_style';
import { RainfallGraph } from '../../utils/RainfallGraph';
import { MarDataAnalysis } from '@dynaslope/commons';
import MobileCaching from '../../../utils/MobileCaching';
import NetworkUtils from '../../../utils/NetworkUtils';

function RainfallPlot() {
    const [rainfallData, setRainfallData] = useState([]);
    const [latestRainTs, setLatestRainTs] = useState(null);

    useEffect(()=> {
        setTimeout( async () => {
            const isConnected = await NetworkUtils.isNetworkAvailable()
            if (isConnected != true) {
                MobileCaching.getItem('MarSensorGraphsRainfallData').then(response => {
                    console.log("Getting data from MarSensorGraphsRainfallData cache")
                    setRainfallData(response);
                });
            } else {
                initRainfall();
            }
        }, 100);
    }, []);

    const initRainfall = async () => {
        const response = await MarDataAnalysis.GetRainfallPlotData();
        if (response.status == true) {
            setLatestRainTs(response.data[0].ts_end);
            setRainfallData(response.data);
            MobileCaching.setItem('MarSensorGraphsRainfallData', response.data);
        } else {
            ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
        }
    };

    return (
        <ScrollView>
            <View style={ContainerStyle.content}>
                <Text style={[LabelStyle.large_label, LabelStyle.brand]}>Rainfall Plots</Text>
                {
                    latestRainTs !== null ?
                        <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Latest data as of {latestRainTs}</Text>
                        :
                        <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Loading rainfall data...</Text>
                }
                {
                    rainfallData.map((element)=> {
                        let ret_val = [];
                        element.plot.forEach((row, index) => {
                            ret_val.push(
                                <View style={{alignItems: "center"}} key={index}>
                                    <RainfallGraph props={row} />
                                </View>
                            );
                        }); 
                        return ret_val;
                    })
                }
            </View>
        </ScrollView>
    )
}

export default RainfallPlot;