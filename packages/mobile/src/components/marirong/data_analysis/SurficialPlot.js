import React, {useEffect, useState} from 'react'
import { View, Text, ScrollView } from 'react-native';
import { LabelStyle } from '../../../styles/label_style';
import { ContainerStyle } from '../../../styles/container_style';
import SurficialMarkerGraph from '../../utils/SurficialMarkerGraph';
import moment from 'moment';

function SurficialPlot() {
    const [currentDate, setCurrentDate] = useState(moment(Date()).format("YYYY/MM/DD HH:mm:ss"))
    const temp = require('../../../assets/surficial.json');
    useEffect(()=> {
        console.log(temp);
    },[]);
    return (
        <ScrollView>
            <View style={ContainerStyle.content}>
                <Text style={[LabelStyle.large_label, LabelStyle.brand]}>Surficial Plots</Text>
                <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Latest data as of {currentDate}</Text>
                <ScrollView horizontal={true}>
                    <View style={{alignItems: 'center', padding: 10}}>
                        <SurficialMarkerGraph 
                            props={temp}
                        />
                    </View>
                </ScrollView>
            </View>
        </ScrollView>
    )
}

export default SurficialPlot;