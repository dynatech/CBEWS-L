import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, ScrollView, processColor } from 'react-native';
import { ContainerStyle } from '../../../styles/container_style';
import { LabelStyle } from '../../../styles/label_style';
import { ButtonStyle } from '../../../styles/button_style';
import SurficialMarkerGraph from '../../utils/SurficialMarkerGraph';
import moment from 'moment';

function SurficialSummary() {

    const [currentDate, setCurrentDate] = useState(moment(Date()).format("YYYY/MM/DD HH:mm:ss"))
    const sample_surficial_marker_json = {
        "site_code": "mar",
        "status": true,
        "surficial_plot": [
            {
                "data": [
                    {
                        "data_id": "229218",
                        "marker_id": "90",
                        "mo_id": "58429",
                        "x": 1601505180.0,
                        "y": 11.0
                    },
                    {
                        "data_id": "229214",
                        "marker_id": "90",
                        "mo_id": "58427",
                        "x": 1601818297.0,
                        "y": 10.0
                    }
                    ,
                    {
                        "data_id": "229214",
                        "marker_id": "90",
                        "mo_id": "58427",
                        "x": 1601792455.0,
                        "y": 13.0
                    }
                    ,
                    {
                        "data_id": "229214",
                        "marker_id": "90",
                        "mo_id": "58427",
                        "x": 1602051655.0,
                        "y": 14.0
                    }
                    ,
                    {
                        "data_id": "229214",
                        "marker_id": "90",
                        "mo_id": "58427",
                        "x": 1602138055.0,
                        "y": 15.0
                    }
                ],
                "marker_id": "90",
                "marker_name": "A",
                "name": "A"
            },
            {
                "data": [
                    {
                        "data_id": "229219",
                        "marker_id": "92",
                        "mo_id": "58429",
                        "x": 1601505180.0,
                        "y": 22.0
                    },
                    {
                        "data_id": "229215",
                        "marker_id": "92",
                        "mo_id": "58427",
                        "x": 1601818297.0,
                        "y": 21.0
                    },
                    {
                        "data_id": "229215",
                        "marker_id": "92",
                        "mo_id": "58427",
                        "x": 1601792455.0,
                        "y": 25.0
                    },
                    {
                        "data_id": "229215",
                        "marker_id": "92",
                        "mo_id": "58427",
                        "x": 1602051655.0,
                        "y": 26.0
                    },
                    {
                        "data_id": "229215",
                        "marker_id": "92",
                        "mo_id": "58427",
                        "x": 1602138055.0,
                        "y": 22.0
                    }
                ],
                "marker_id": "92",
                "marker_name": "B",
                "name": "B"
            },
            {
                "data": [
                    {
                        "data_id": "229220",
                        "marker_id": "91",
                        "mo_id": "58429",
                        "x": 1601505180.0,
                        "y": 32.0
                    },
                    {
                        "data_id": "229216",
                        "marker_id": "91",
                        "mo_id": "58427",
                        "x": 1601818297.0,
                        "y": 30.0
                    },
                    {
                        "data_id": "229216",
                        "marker_id": "91",
                        "mo_id": "58427",
                        "x": 1601792455.0,
                        "y": 32.0
                    },
                    {
                        "data_id": "229216",
                        "marker_id": "91",
                        "mo_id": "58427",
                        "x": 1602051655.0,
                        "y": 36.0
                    },
                    {
                        "data_id": "229216",
                        "marker_id": "91",
                        "mo_id": "58427",
                        "x": 1602138055.0,
                        "y": 37.0
                    }
                ],
                "marker_id": "91",
                "marker_name": "C",
                "name": "C"
            },
            {
                "data": [
                    {
                        "data_id": "229221",
                        "marker_id": "93",
                        "mo_id": "58429",
                        "x": 1601505180.0,
                        "y": 41.0
                    },
                    {
                        "data_id": "229217",
                        "marker_id": "93",
                        "mo_id": "58427",
                        "x": 1601818297.0,
                        "y": 40.0
                    },
                    {
                        "data_id": "229217",
                        "marker_id": "93",
                        "mo_id": "58427",
                        "x": 1601792455.0,
                        "y": 41.0
                    },
                    {
                        "data_id": "229217",
                        "marker_id": "93",
                        "mo_id": "58427",
                        "x": 1602051655.0,
                        "y": 45.0
                    },
                    {
                        "data_id": "229217",
                        "marker_id": "93",
                        "mo_id": "58427",
                        "x": 1602138055.0,
                        "y": 47.0
                    }
                ],
                "marker_id": "93",
                "marker_name": "D",
                "name": "D"
            }
        ],
        "ts_end": "2020-10-12 14:30:26",
        "ts_start": "2020-03-26 14:30:26"
    }
    
    return(
        <ScrollView>
            <View style={ContainerStyle.content}>
                <Text style={[LabelStyle.large_label, LabelStyle.brand]}>Surficial Data Summary</Text>
                <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Latest Reports and Surficial Graphs</Text>
            </View>
            <View style={ContainerStyle.content}>
                <Text style={[LabelStyle.medium_label, LabelStyle.brand]}>Latest Surficial Data Report</Text>
                <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Date: {currentDate}</Text>
                <ScrollView horizontal={true}>
                    <View style={{alignItems: 'center', padding: 10}}>
                        <SurficialMarkerGraph 
                            props={sample_surficial_marker_json}
                        />
                    </View>
                </ScrollView>
            </View>
        </ScrollView>
    )
}

export default SurficialSummary