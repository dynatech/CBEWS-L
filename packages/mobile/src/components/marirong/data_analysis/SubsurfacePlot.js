import React, {useEffect, useState} from 'react'
import { View, Text, ScrollView } from 'react-native';
import { LabelStyle } from '../../../styles/label_style';
import { ContainerStyle } from '../../../styles/container_style';
import { ColPos, Displacement } from '../../utils/SubsurfaceGraph';

function SubsurfacePlot() {
    
    const temp = require('../../../assets/blcsb.json');
    useEffect(()=> {

    },[]);

    return (
        <ScrollView>
            <View style={ContainerStyle.content}>
                <Text style={[LabelStyle.large_label, LabelStyle.brand]}>Subsurface Plots</Text>
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

export default SubsurfacePlot;