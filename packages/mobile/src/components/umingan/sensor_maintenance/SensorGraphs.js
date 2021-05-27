import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
import { ContainerStyle } from '../../../styles/container_style';
import { LabelStyle } from '../../../styles/label_style';
import { ButtonStyle } from '../../../styles/button_style';
import { ColPos, Displacement, Velocity } from '../../utils/SubsurfaceGraph';
import { RainfallGraph } from '../../utils/RainfallGraph';
import MobileCaching from '../../../utils/MobileCaching';
import NetworkUtils from '../../../utils/NetworkUtils';

import { UmiDataAnalysis } from "@dynaslope/commons";


function SensorGraphs() {
    const temp = require('../../../assets/blcsb.json');
    const temp_rain = require('../../../assets/rain_data_mar.json');
    const [rainfallData, setRainfallData] = useState([]);
    const [latestRainTs, setLatestRainTs] = useState(null);
    const [subsurfaceData, setSubsurfaceData] = useState([]);
    const [latestSubTs, setLatestSubTs] = useState(null);

    useEffect(()=> {
        // console.log("temp_rain", temp_rain);
        setTimeout( async () => {
            const isConnected = await NetworkUtils.isNetworkAvailable()
            if (isConnected != true) {
                MobileCaching.getItem('UmiSensorGraphsRainfallData').then(response => {
                    console.log("Getting data from UmiSensorGraphsRainfallData cache")
                    setRainfallData(response);
                });
                MobileCaching.getItem('UmiSensorGraphsSubsurfaceData').then(response => {
                    console.log("Getting data from UmiSensorGraphsSubsurfaceData cache")
                    init(response);
                    setSubsurfaceData(response);
                });
            } else {
                initRainfall();
                initSubsurface();
            }
        }, 100);
    }, []);

    const initRainfall = async () => {
        const response = await UmiDataAnalysis.GetRainfallPlotData();
        console.log("response", response)
        if (response.status == true) {
            let rainfall_data = response.data[0];
            console.log("temp_rain", temp_rain);
            console.log("rainfall_data", rainfall_data);
            setLatestRainTs(rainfallData.ts_end);
            setRainfallData(response.data);
            MobileCaching.setItem('UmiSensorGraphsRainfallData', response.data);
        } else {
            ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
        }
    };

    const initSubsurface = async () => {
        const response = await UmiDataAnalysis.GetSubsurfacePlotData();
        console.log("response", response)
        if (response.status == true) {
            let subsurface_data = response.data[0];
            console.log("temp subs", temp);
            console.log("subsurface_data", subsurface_data)
            setLatestSubTs(null);
            setSubsurfaceData(response.data);
            MobileCaching.setItem('UmiSensorGraphsSubsurfaceData', response.data);
        } else {
            ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
        }
    };

    return(
        <ScrollView>
            <View style={ContainerStyle.content}>
                <Text style={[LabelStyle.large_label, LabelStyle.brand]}>Rainfall Graphs</Text>
                {
                    latestRainTs !== null ?
                        <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Latest data as of {latestRainTs}</Text>
                        :
                        <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Loading rainfall data...</Text>
                }
                {
                    rainfallData.map((element)=> {
                        let ret_val = [];
                        element.plot.forEach(row => {
                            ret_val.push(
                                <View style={{alignItems: "center"}}>
                                    <RainfallGraph props={row} />
                                </View>
                            );
                        });
                        return ret_val;
                    })
                }
            </View>
            <View style={ContainerStyle.content}>
                <Text style={[LabelStyle.large_label, LabelStyle.brand]}>Subsurface Graphs</Text>
                {
                    latestSubTs !== null ? 
                        <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Latest data as of YYYY-MM-DD HH:mm:ss</Text> 
                        : 
                        <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Loading subsurface data...</Text>
                }
                {
                    subsurfaceData.map((element)=> {
                        let ret_val = [];
                        if (element.type == "column_position") {
                            element.data.data.forEach(row => {
                                ret_val.push(
                                    <View style={{alignItems: "center"}}>
                                        <Text style={[LabelStyle.medium_label, LabelStyle.brand]}>{row.orientation == "downslope" ?
                                        "Downslope" :
                                    "Across Slope"}</Text>
                                        <ColPos props={row}/>
                                    </View>
                                )
                            });
                        } else if (element.type == "displacement") {
                            element.data.forEach(row => {
                                ret_val.push(
                                    <View style={{alignItems: "center"}}>
                                        <Text style={[LabelStyle.medium_label, LabelStyle.brand]}>{row.orientation == "downslope" ?
                                            "Downslope" :
                                        "Across Slope"}</Text>
                                        <Displacement props={row}/>
                                    </View>
                                )
                            });

                        } else if (element.type == "velocity") {
                            console.log(element);
                        }
                        return ret_val
                    })
                } 
            </View>
        </ScrollView>
    )
}

export default SensorGraphs 