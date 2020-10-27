import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
import { ContainerStyle } from '../../../styles/container_style';
import { LabelStyle } from '../../../styles/label_style';
import { ButtonStyle } from '../../../styles/button_style';
import { ColPos, Displacement, Velocity } from '../../utils/SubsurfaceGraph';

function SensorGraphs() {
    const temp = require('../../../assets/blcsb.json');
    useEffect(()=> {
        console.log();
    },[]);

    return(
        <ScrollView>
            <View style={ContainerStyle.content}>
                <Text style={[LabelStyle.large_label, LabelStyle.brand]}>Rainfall Graphs</Text>
                <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Latest data as of YYYY-MM-DD HH:mm:ss</Text>
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
                            console.log(element)
                            element.data.forEach(row => {
                                ret_val.push(
                                    <ScrollView horizontal={true}>
                                        <View style={{alignItems: "center"}}>
                                            <Text style={[LabelStyle.medium_label, LabelStyle.brand]}>{row.orientation == "downslope" ?
                                                "Downslope" :
                                            "Across Slope"}</Text>
                                            <Displacement props={row}/>
                                        </View>
                                    </ScrollView>
                                )
                            });

                        } else if (element.type == "velocity") {

                        }
                        return ret_val
                    })
                } 
            </View>
        </ScrollView>
    )
}

export default SensorGraphs 