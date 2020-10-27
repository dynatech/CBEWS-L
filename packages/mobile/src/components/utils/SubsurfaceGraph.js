import React, { useState, useEffect, useRef } from 'react';

import { processColor } from 'react-native';
import {LineChart} from 'react-native-charts-wrapper';
import moment from 'moment';

const ColPos = (props) => {

    const {
        data,
        orientation
    } = props.props;

    const constructDataSet = (data) => {
        let temp = [];
        data.forEach(element => {
            let temp_values = [];
            let color_code = Math.floor(Math.random()*16777215).toString(16);
            element.data.forEach(set => {
                temp_values.push({
                    y: set.y,
                    x: moment.unix(set.x).valueOf()
                })
            });
            temp.push({
                label: `${element.name}`,
                config: {
                    color: processColor(`#${color_code}`),
                    drawValues: true,
                    valueTextSize: 10,
                    valueTextColor: processColor(`#${color_code}`)
                },
                values: temp_values
            })
        });
        return temp
    }

    return(
        <LineChart style={{height: 250, width: '100%'}}
            data={{
                dataSets: constructDataSet(data)
            }}
            xAxis={{
                valueFormatter: 'date',
                valueFormatterPattern: 'HH:mm',
                position: 'BOTTOM',
            }}
        />
    )
}

const Displacement = (props) => {

    const {
        annotations,
        data,
        orientation
    } = props.props;

    const constructDataSet = (data) => {
        let temp = [];
        data.forEach((element, index) => {
            let temp_values = [];
            let color_code = Math.floor(Math.random()*16777215).toString(16);
            if (index != 0) {
                element.data.forEach((value, index) => {
                    temp_values.push({
                        y: value.y,
                        x: moment.unix(value.x).valueOf()
                    })
                });
                temp.push({
                    label: `${element.name}`,
                    config: {
                        color: processColor(`#${color_code}`),
                        drawValues: true,
                        valueTextSize: 10,
                        valueTextColor: processColor(`#${color_code}`)
                    },
                    values: temp_values
                })
            }
        });
        return temp
    }

    return(
        <LineChart style={{height: 250, width: 2000}}
            data={{
                dataSets: constructDataSet(data)
            }}
            xAxis={{
                valueFormatter: 'date',
                valueFormatterPattern: 'HH:mm',
                position: 'BOTTOM',
            }}
        />
    )
}

const Velocity = (props) => {

    const {
        surficial_plot,
        site_code,
        ts_end,
        ts_start
    } = props.props;

    const constructDataSet = (surficial_plot) => {
        let temp = [];
        surficial_plot.forEach(element => {
            let temp_values = [];
            let color_code = Math.floor(Math.random()*16777215).toString(16);
            element.data.forEach(set => {
                temp_values.push({
                    y: set.y,
                    x: moment.unix(set.x).valueOf()
                })
            });
            temp.push({
                label: `${element.marker_name}`,
                config: {
                    color: processColor(`#${color_code}`),
                    drawValues: true,
                    valueTextSize: 10,
                    valueTextColor: processColor(`#${color_code}`)
                },
                values: temp_values
            })
        });
        console.log(temp);
        return temp
    }

    return(
        <LineChart style={{height: 250, width: 750}}
            data={{
                dataSets: constructDataSet(surficial_plot)
            }}
            xAxis={{
                valueFormatter: 'date',
                valueFormatterPattern: 'HH:mm',
                position: 'BOTTOM',
            }}
        />
    )
}

export { ColPos, Displacement, Velocity }