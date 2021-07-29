import React, { useState, useEffect, useRef, Fragment } from 'react';

import { ScrollView, Text, TouchableOpacity, View, processColor, Dimensions  } from 'react-native';
import { Input } from 'react-native-elements';
import { ButtonStyle } from '../../styles/button_style';
import { ContainerStyle } from '../../styles/container_style';
import { LabelStyle } from '../../styles/label_style';
import { Formik } from 'formik';
import FilePickerManager from 'react-native-file-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import NetworkUtils from '../../utils/NetworkUtils';

import {LineChart} from 'react-native-charts-wrapper';

import moment from 'moment';

const SurficialMarkerGraph = (props) => {

    const {
        surficial_plot,
        site_code,
        ts_end,
        ts_start
    } = props.props;

    const [flagEmpty, setFlag] = useState(true);
    const [dataset, setDataset] = useState([]);

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
        setDataset(temp);
    }
    
    const checkIfNoData = (data) => {
        let temp = true;
        data.forEach(element => {
            if (element.values.length != 0) {
                temp = false;
            }
        });
        setFlag(temp);
    }

    useEffect(() => {
        if (surficial_plot) {
            constructDataSet(surficial_plot);
        }
    }, [surficial_plot]);

    useEffect(() => {
        if (dataset.length != 0) {
            checkIfNoData(dataset);
        }
    }, [dataset]);

    return(
        <Fragment>
            {
                dataset.length != 0 &&
                    <LineChart style={{height: 250, width: Dimensions.get('window').width - 20}}
                        data={{
                            dataSets: dataset
                        }}
                        xAxis={{
                            valueFormatter: 'date',
                            valueFormatterPattern: 'yyyy/MM/dd HH:mm',
                            position: 'BOTTOM',
                        }}
                    />
            }
            {
                flagEmpty && <Text style={[LabelStyle.medium_label, LabelStyle.brand]}>No available ground data</Text>
            }
        </Fragment>
    )
}

export default SurficialMarkerGraph