import React, {useEffect, useState} from 'react'
import { View, Text, ScrollView } from 'react-native';
import { LabelStyle } from '../../../styles/label_style';
import { ContainerStyle } from '../../../styles/container_style';

function EarthquakeData() {

    useEffect(()=> {
    }, []);

    return (
        <ScrollView>
            <View style={ContainerStyle.content}>
                <Text style={[LabelStyle.large_label, LabelStyle.brand]}>Earthquake data</Text>
                <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Latest data as of YYYY-MM-DD HH:mm:ss</Text>
                {/* {
                    temp_rain.data.map((element)=> {
                        let ret_val = [];
                        element.plot.forEach(row => {
                            ret_val.push(
                                <View style={{alignItems: "center"}}>
                                    <RainfallInstantaneousGraph props={row} />
                                </View>
                            );
                        }); 
                        return ret_val;
                    })
                } */}
            </View>
        </ScrollView>
    )
}

export default EarthquakeData;