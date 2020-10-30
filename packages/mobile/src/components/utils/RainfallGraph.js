import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Text } from 'react-native';
import { processColor } from 'react-native';
import {LineChart} from 'react-native-charts-wrapper';
import { LabelStyle } from '../../styles/label_style';
import moment from 'moment';

const RainfallGraph = (props) => {

    const [display, setDisplay] = useState([]);
    const {
        data,
        data_source,
        distance,
        gauge_name,
        threshold_value
    } = props.props;

    useEffect(()=> {
        let temp = constructDataSet(data)
        // Add costum legend
        if (temp.length !=0 ) {
            setDisplay([
                <Fragment>
                    <Text style={[LabelStyle.medium_label, LabelStyle.brand]}>{`${gauge_name.toUpperCase()} (${distance}km away)`}</Text>
                        <LineChart style={{height: 250, width: '100%'}}
                        data={{
                            dataSets: temp
                        }}
                        xAxis={{
                            valueFormatter: 'date',
                            valueFormatterPattern: 'HH:mm',
                            position: 'BOTTOM',
                        }}
                        legend={{wordWrapEnabled: true}}
                    />
                </Fragment>
            ])
        }
    },[]);

    const constructDataSet = (data) => {
        let ret = [];
        let oneDay = [];
        let threeDay = [];
        let temp_1_day = [];
        let temp_3_days = [];
        let threshold_1_day = [];
        let threshold_3_day = [];

        data.forEach(element => {
            let color_code = Math.floor(Math.random()*16777215).toString(16);
            if (element['24hr cumulative rainfall'] != null && element['72hr cumulative rainfall'] != null) {
                temp_1_day.push({
                    y: element['24hr cumulative rainfall'],
                    x: moment(element.ts).valueOf()
                });
                threshold_1_day.push({
                    y: threshold_value/2,
                    x: moment(element.ts).valueOf()
                });
                temp_3_days.push({
                    y: element['72hr cumulative rainfall'],
                    x: moment(element.ts).valueOf()
                });
                threshold_3_day.push({
                    y: threshold_value,
                    x: moment(element.ts).valueOf()
                });
            }

        });

        if (temp_1_day.length != 0) {
            ret.push({
                label: `1-day cumulative`,
                config: {
                    color: processColor(`blue`),
                    drawValues: true,
                    drawCircles: false,
                    valueTextSize: 10,
                    valueTextColor: processColor(`blue`)
                },
                values: temp_1_day
            });

            ret.push({
                label: `1-day threshold`,
                config: {
                    color: processColor(`#5c5cfa`),
                    drawValues: true,
                    drawCircles: false,
                    valueTextSize: 10,
                    dashedLine: {
                        lineLength: 1,
                        spaceLength: 20},
                    valueTextColor: processColor(`#5c5cfa`)
                },
                values: threshold_1_day  
            })
        }

        if (temp_3_days.length != 0) {
            ret.push( {
                label: `3-day cumulative`,
                config: {
                    color: processColor(`red`),
                    drawValues: true,
                    drawCircles: false,
                    valueTextSize: 10,
                    valueTextColor: processColor(`red`)
                },
                values: temp_3_days
            })
            ret.push({
                label: `3-day threshold`,
                config: {
                    color: processColor(`#ff4040`),
                    drawValues: true,
                    drawCircles: false,
                    valueTextSize: 10,
                    dashedLine: {
                        lineLength: 1,
                        spaceLength: 100},
                    valueTextColor: processColor(`#ff4040`)
                },
                values: threshold_3_day  
            })
        }

        return ret;
    }
    
    const constructConfig = () => {

    }

    return display
}

export { RainfallGraph }