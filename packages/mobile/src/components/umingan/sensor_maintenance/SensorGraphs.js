import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
import { ContainerStyle } from '../../../styles/container_style';
import { LabelStyle } from '../../../styles/label_style';
import { ButtonStyle } from '../../../styles/button_style';
import { ColPos, Displacement, Velocity } from '../../utils/SubsurfaceGraph';
import { RainfallGraph } from '../../utils/RainfallGraph';

function SensorGraphs() {
    const temp = require('../../../assets/blcsb.json');
    const temp_rain = require('../../../assets/rain_data_mar.json');

    useEffect(()=> {
    },[]);

    return(
        <ScrollView>
            <View style={ContainerStyle.content}>
                <Text style={[LabelStyle.large_label, LabelStyle.brand]}>Rainfall Graphs</Text>
                <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Latest data as of YYYY-MM-DD HH:mm:ss</Text>
                {
                    temp_rain.data.map((element)=> {
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
                <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Latest data as of YYYY-MM-DD HH:mm:ss</Text>
                {
                    temp.data[0].map((element)=> {
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