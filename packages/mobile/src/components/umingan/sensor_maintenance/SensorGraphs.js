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
    const [rainfallData, setRainfallData] = useState([]);
    const [latestRainTs, setLatestRainTs] = useState(null);
    const [subsurfaceData, setSubsurfaceData] = useState([]);
    const [latestSubTs, setLatestSubTs] = useState(null);

    const initRainfall = async () => {
    };

    const initSubsurface = async () => {
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