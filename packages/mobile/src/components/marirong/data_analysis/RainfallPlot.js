import React, {useEffect, useState} from 'react'
import { View, Text, ScrollView } from 'react-native';
import { LabelStyle } from '../../../styles/label_style';
import { ContainerStyle } from '../../../styles/container_style';
import { RainfallGraph } from '../../utils/RainfallGraph';

function RainfallPlot() {
    const temp_rain = require('../../../assets/rain_data_mar.json');

    useEffect(()=> {
        console.log(temp_rain);
    }, []);

    return (
        <ScrollView>
            <View style={ContainerStyle.content}>
                <Text style={[LabelStyle.large_label, LabelStyle.brand]}>Rainfall Plots</Text>
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
        </ScrollView>
    )
}

export default RainfallPlot;