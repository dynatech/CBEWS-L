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

    useEffect(()=> {
        initRainfall();
        initSubsurface();
    }, []);

    const dummyRainfall = {
        "data": [
          {
            "1D cml": null, 
            "2yr max": 113.43, 
            "3D cml": null, 
            "DataSource": "rain_umig", 
            "alert": -1, 
            "half of 2yr max": 56.71, 
            "plot": [
              {
                "data": [
                  {
                    "24hr cumulative rainfall": 0.5, 
                    "72hr cumulative rainfall": 2.0, 
                    "rain": 0.0, 
                    "ts": "2019-01-05 12:00"
                  }, 
                  {
                    "24hr cumulative rainfall": 0.5, 
                    "72hr cumulative rainfall": 2.0, 
                    "rain": 0.0, 
                    "ts": "2019-01-05 12:30"
                  }, 
                  {
                    "24hr cumulative rainfall": 0.5, 
                    "72hr cumulative rainfall": 2.0, 
                    "rain": 0.0, 
                    "ts": "2019-01-05 13:00"
                  },
                ], 
                "data_source": "senslope", 
                "distance": 9.6, 
                "gauge_name": "rain_marg", 
                "threshold_value": 113.427
              }, 
              {
                "data": [
                  {
                    "24hr cumulative rainfall": null, 
                    "72hr cumulative rainfall": null, 
                    "rain": null, 
                    "ts": "2019-01-05 12:00"
                  }, 
                  {
                    "24hr cumulative rainfall": null, 
                    "72hr cumulative rainfall": null, 
                    "rain": null, 
                    "ts": "2019-01-05 12:30"
                  }, 
                  {
                    "24hr cumulative rainfall": null, 
                    "72hr cumulative rainfall": null, 
                    "rain": null, 
                    "ts": "2019-01-05 13:00"
                  }, 
                ], 
                "data_source": "senslope", 
                "distance": 0.07, 
                "gauge_name": "rain_umig", 
                "threshold_value": 113.427
              }, 
              {
                "data": [
                  {
                    "24hr cumulative rainfall": null, 
                    "72hr cumulative rainfall": null, 
                    "rain": null, 
                    "ts": "2019-01-05 12:00"
                  }, 
                  {
                    "24hr cumulative rainfall": null, 
                    "72hr cumulative rainfall": null, 
                    "rain": null, 
                    "ts": "2019-01-05 12:30"
                  }, 
                  {
                    "24hr cumulative rainfall": null, 
                    "72hr cumulative rainfall": null, 
                    "rain": null, 
                    "ts": "2019-01-05 13:00"
                  }, 
                ], 
                "data_source": "noah", 
                "distance": 9.95, 
                "gauge_name": "rain_noah_1795", 
                "threshold_value": 113.427
              }, 
              {
                "data": [
                  {
                    "24hr cumulative rainfall": 21.0, 
                    "72hr cumulative rainfall": 170.5, 
                    "rain": 1.0, 
                    "ts": "2019-01-05 12:00"
                  }, 
                  {
                    "24hr cumulative rainfall": 21.0, 
                    "72hr cumulative rainfall": 170.5, 
                    "rain": 0.5, 
                    "ts": "2019-01-05 12:30"
                  }, 
                  {
                    "24hr cumulative rainfall": 21.0, 
                    "72hr cumulative rainfall": 170.5, 
                    "rain": 0.5, 
                    "ts": "2019-01-05 13:00"
                  }, 
                ], 
                "data_source": "senslope", 
                "distance": 9.25, 
                "gauge_name": "rain_blcsb", 
                "threshold_value": 113.427
              }
            ], 
            "site_code": "umi", 
            "site_id": 50.0, 
            "ts_end": "2019-01-12 12:00:00", 
            "ts_start": "2019-01-05 12:00:00"
          }
        ], 
        "message": "Success generating rain data", 
        "status": true
      }
    const dummySubsurface = {
        "data": [
        ],
        "status": true
      }
      
    const initRainfall = async () => {
        const response = dummyRainfall;
        if (response.status == true) {
            setLatestRainTs(rainfallData.ts_end);
            setRainfallData(response.data);
        }
    };

    const initSubsurface = async () => {
        const response = dummySubsurface;
        if (response.status == true) {
            let subsurface_data = response.data[0];
            setLatestSubTs(null);
            setSubsurfaceData(response.data);
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