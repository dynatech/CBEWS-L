import React, {useEffect, useState} from 'react'
import { View, Text, ScrollView } from 'react-native';
import { LabelStyle } from '../../../styles/label_style';
import { ContainerStyle } from '../../../styles/container_style';
import { ColPos, Displacement } from '../../utils/SubsurfaceGraph';

function SubsurfacePlot() {
    
    const temp = require('../../../assets/blcsb.json');
    const [subsurfaceData, setSubsurfaceData] = useState([]);
    const [latestSubTs, setLatestSubTs] = useState(null);

    useEffect(()=> {
        // console.log("temp_rain", temp_rain);
        setTimeout( async () => {
            const isConnected = await NetworkUtils.isNetworkAvailable()
            if (isConnected != true) {
                MobileCaching.getItem('MarDataAnalyisSubsurfaceData').then(response => {
                    console.log("Getting data from MarDataAnalyisSubsurfaceData cache")
                    init(response);
                    setSubsurfaceData(response);
                });
            } else {
                initRainfall();
                initSubsurface();
            }
        }, 100);
    }, []);

    const initSubsurface = async () => {
        const response = await UmiDataAnalysis.GetSubsurfacePlotData();
        console.log("response", response)
        if (response.status == true) {
            let subsurface_data = response.data[0];
            console.log("temp subs", temp);
            console.log("subsurface_data", subsurface_data)
            setLatestSubTs(null);
            setSubsurfaceData(response.data);
            MobileCaching.setItem('MarDataAnalyisSubsurfaceData', response.data);
        } else {
            ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
        }
    };

    return (
        <ScrollView>
            <View style={ContainerStyle.content}>
                <Text style={[LabelStyle.large_label, LabelStyle.brand]}>Subsurface Plots</Text>
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

export default SubsurfacePlot;