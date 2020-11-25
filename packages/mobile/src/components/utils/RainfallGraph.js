import React, { useState, useEffect, useRef, Fragment } from 'react';
import { View, Text } from 'react-native';
import { processColor } from 'react-native';
import { BarChart} from 'react-native-charts-wrapper';
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

    return display
}


const RainfallInstantaneousGraph = (props) => {
    const [display, setDisplay] = useState([]);
    const [noData, setNoData] = useState(false);
    const {
        data,
        data_source,
        distance,
        gauge_name,
        threshold_value
    } = props.props;

    useEffect(()=> {
        let {dataset , formatter} = constructDataSet(data)
        if (dataset.length !=0 ) {
            setDisplay([
                <Fragment>
                     {console.log(noData)}
                    <Text style={[LabelStyle.medium_label, LabelStyle.brand]}>{`${gauge_name.toUpperCase()} (${distance}km away)`}</Text>
                        <BarChart style={{height: 250, width: '100%'}}
                            data={{
                                dataSets: dataset
                            }}
                            xAxis={{
                                valueFormatter: formatter,
                                granularityEnabled: true,
                                granularity : 1,
                            }}
                           
                            gridBackgroundColor={noData ? processColor('#c7e5f2') : processColor('#fff')}
                            legend={{wordWrapEnabled: true}}
                        />
                </Fragment>
            ])
        }
    },[]);

    const constructDataSet = (data) => {
        let dataset = [];
        let formatter = [];
        let reconstruct_dataset = [];
        setNoData(false);
        data.forEach(element => {
            formatter.push(moment(element.ts).format("HH:mm"))
            if (element.rain != null) {
                reconstruct_dataset.push(
                    {y: element.rain}
                );
            } else {
                reconstruct_dataset.push(
                    {y: 0}
                );
                setNoData(true);
            }
        });

        dataset.push({
            label: `data`,
            config: {
                color: processColor('black'),
                barShadowColor: processColor('lightgrey'),
                highlightAlpha: 90,
                highlightColor: processColor('red'),
            },
            xAxis: {
                drawLabels: false,
            },
            values: reconstruct_dataset  
        })
        return {dataset, formatter};
    }

    return display;
}

export { RainfallGraph, RainfallInstantaneousGraph }