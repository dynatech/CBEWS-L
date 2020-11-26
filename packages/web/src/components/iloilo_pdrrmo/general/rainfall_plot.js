import React, { useState, Fragment } from 'react';
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import * as moment from "moment";
import {
    Grid, Paper, Container,
    Fab, makeStyles, Table,
    TableBody, TableCell, TableHead,
    TableRow
} from "@material-ui/core";
import { sample_rain_data_umi } from "../general/jsons/umi_sample_rain_data._not_final";
import {sample_rain_data_mar} from "../general/jsons/mar_sample_rain_data._not_final";
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';

import MomentUtils from '@date-io/moment';
import { isLoop } from '@babel/types';

import TransitionalModal from '../../reducers/pdrrmo_iloilo/loading';

window.moment = moment;

const rainfall_colors = {
    "24h": "rgba(73, 105, 252, 0.9)",
    "72h": "rgba(239, 69, 50, 0.9)",
    rain: "rgba(0, 0, 0, 0.9)"
};

const useStyles = makeStyles(theme => ({
    button_fluid: {
        width: '90%',
        padding: 10
    },
}));

const tableStyle = makeStyles(theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
        overflowX: 'auto',
    },
    table: {
        minWidth: 100,
    },
}));



function prepareRainfallData(set) {
    const { null_ranges } = set;
    const series_data = [];
    const max_rval_data = [];

    Object.keys(rainfall_colors).forEach((name) => {
        const color = rainfall_colors[name];
        const entry = {
            name,
            step: true,
            data: set[name],
            color,
            id: name,
            fillOpacity: 1,
            lineWidth: 1
        };

        if (name !== "rain") series_data.push(entry);
        else max_rval_data.push(entry);
    });

    const null_processed = null_ranges.map(({ from, to }) => ({ from, to, color: "rgba(68, 170, 213, 0.3)" }));
    return { set, series_data, max_rval_data, null_processed };
}

function prepareInstantaneousRainfallChartOption(row, input) {
    const { set, max_rval_data, null_processed } = row;
    const {
        distance, max_rval, gauge_name
    } = set;
    const { ts_start, ts_end, site_code } = input;

    return {
        series: max_rval_data,
        chart: {
            type: "column",
            zoomType: "x",
            panning: true,
            resetZoomButton: {
                position: {
                    x: 0,
                    y: -30
                }
            },
            spacingTop: 16,
            spacingRight: 24
        },
        title: {
            text: `<b>Instantaneous Rainfall Chart of ${site_code.toUpperCase()}</b>`,
            style: { fontSize: "1rem" },
            margin: 26,
            y: 20
        },
        subtitle: {
            text: `Source : <b>${createRainPlotSubtitle(distance, gauge_name)}</b><br/>As of: <b>${moment(ts_end).format("D MMM YYYY, HH:mm")}</b>`,
            style: { fontSize: "0.80rem" }
        },
        xAxis: {
            min: Date.parse(ts_start),
            max: Date.parse(ts_end),
            plotBands: null_processed,
            type: "datetime",
            dateTimeLabelFormats: {
                month: "%e %b %Y",
                year: "%Y"
            },
            title: {
                text: "<b>Date</b>"
            },
            events: {
                setExtremes: syncExtremes
            }
        },
        yAxis: {
            max: max_rval,
            min: 0,
            title: {
                text: "<b>Value (mm)</b>"
            }
        },
        tooltip: {
            shared: true,
            crosshairs: true
        },
        plotOptions: {
            series: {
                marker: {
                    radius: 3
                },
                cursor: "pointer"
            }
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        time: { timezoneOffset: -8 * 60 }
    };
}

function prepareCumulativeRainfallChartOption(row, input) {
    const { set, series_data } = row;
    const {
        distance, max_72h,
        threshold_value: max_rain_2year, gauge_name
    } = set;
    const { ts_start, ts_end, site_code } = input;

    return {
        series: series_data,
        chart: {
            type: "line",
            zoomType: "x",
            panning: true,
            panKey: "shift",
            resetZoomButton: {
                position: {
                    x: 0,
                    y: -30
                }
            },
            spacingTop: 16,
            spacingRight: 24
        },
        title: {
            text: `<b>Cumulative Rainfall Chart of ${site_code.toUpperCase()}</b>`,
            style: { fontSize: "1rem" },
            margin: 20,
            y: 20
        },
        subtitle: {
            text: `Source: <b>${createRainPlotSubtitle(distance, gauge_name)}</b><br/>As of: <b>${moment(ts_end).format("D MMM YYYY, HH:mm")}</b>`,
            style: { fontSize: "0.80rem" }
        },
        xAxis: {
            min: Date.parse(ts_start),
            max: Date.parse(ts_end),
            type: "datetime",
            dateTimeLabelFormats: {
                month: "%e %b %Y",
                year: "%Y"
            },
            title: {
                text: "<b>Date</b>"
            },
            events: {
                setExtremes: syncExtremes
            }
        },
        yAxis: {
            title: {
                text: "<b>Value (mm)</b>"
            },
            max: Math.max(0, (max_72h - parseFloat(max_rain_2year))) + parseFloat(max_rain_2year),
            min: 0,
            plotBands: [{
                value: Math.round(parseFloat(max_rain_2year / 2) * 10) / 10,
                color: rainfall_colors["24h"],
                dashStyle: "shortdash",
                width: 2,
                zIndex: 0,
                label: {
                    text: `24-hr threshold (${max_rain_2year / 2})`

                }
            }, {
                value: max_rain_2year,
                color: rainfall_colors["72h"],
                dashStyle: "shortdash",
                width: 2,
                zIndex: 0,
                label: {
                    text: `72-hr threshold (${max_rain_2year})`
                }
            }]
        },
        tooltip: {
            shared: true,
            crosshairs: true
        },
        plotOptions: {
            series: {
                marker: {
                    radius: 3
                },
                cursor: "pointer"
            }
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        time: { timezoneOffset: -8 * 60 }
    };
}

function createRainPlotSubtitle(distance, gauge_name) {
    const source = gauge_name.toUpperCase();
    const subtitle = distance === null ? source : `${source} (${distance} KM)`;
    return subtitle;
}

function syncExtremes(e) {
    const this_chart = this.chart;
    const { charts } = Highcharts;

    if (e.trigger !== "syncExtremes") { // Prevent feedback loop
        Highcharts.each(charts, (chart) => {
            if (chart !== this_chart) {
                if (chart.xAxis[0].setExtremes) { // It is null while updating
                    chart.xAxis[0].setExtremes(e.min, e.max, undefined, false, { trigger: "syncExtremes" });
                }
            }
        });
    }
}

function RainfallPlot(props) {
    const { site } = props;
    let rainfall_data = "";
    const input = { ts_end: "2019-06-24 01:00:00", ts_start: "2019-06-17 01:00:00", site_code: site.toUpperCase() };
    const [selectedStartDate, setSelectedStartDate] = useState(new Date());
    const [selectedEndDate, setSelectedEndDate] = useState(new Date());

    if (site === "umi") {
        rainfall_data = sample_rain_data_umi;
    } else {
        rainfall_data = sample_rain_data_mar;
    }

    const processed_data = [];
    rainfall_data.forEach(set => {
        const data = prepareRainfallData(set);
        processed_data.push(data);
    });

    const [options, setOptions] = useState(renderGraph());
    const classes = useStyles();
    const dt_classes = tableStyle();

    function renderGraph() {
        const temp = [];

        processed_data.forEach(data => {
            const cumulative = prepareCumulativeRainfallChartOption(data, input);
            const instantaneous = prepareInstantaneousRainfallChartOption(data, input);
            temp.push({ cumulative });
            temp.push({ instantaneous });
        });
        return temp
    }

    const handleSelectedStartDate = date => {
        setSelectedStartDate(date);
    };

    const handleSelectedEndDate = date => {
        setSelectedEndDate(date);
    };

    function enableDownloadPrint(site) {

        if (site != "umi") {
            return (
                <Grid container align="center" style={{ paddingTop: 20 }}>
                    <Grid item xs={3} />
                    <Grid item xs={3}>
                        <Fab variant="extended"
                            color="primary"
                            aria-label="add" className={classes.button_fluid}
                            onClick={() => {download()}}>
                            Download
                    </Fab>
                    </Grid>
                    <Grid item xs={3}>
                        <Fab variant="extended"
                            color="primary"
                            aria-label="add" className={classes.button_fluid}
                            onClick={() => {print()}}>
                            Print
                    </Fab>
                    </Grid>
                    <Grid item xs={3} />
                </Grid>
            )
        }

    }

    function enableDataGeneratorOptions(site) {
        let ret_val = [];
        if (site != "umi") {
            ret_val.push(
                <Grid container align="center" style={{ paddingTop: 20 }}>
                    <Grid item xs={2} />
                    <Grid item xs={3}>
                        <MuiPickersUtilsProvider utils={MomentUtils}>
                            <KeyboardDatePicker
                                disableToolbar
                                variant="inline"
                                format="MM-DD-YYYY HH:mm:ss"
                                margin="normal"
                                id="date-picker-start"
                                label="Date Start"
                                value={selectedStartDate}
                                onChange={handleSelectedStartDate}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item xs={3}>
                        <MuiPickersUtilsProvider utils={MomentUtils}>
                            <KeyboardDatePicker
                                disableToolbar
                                variant="inline"
                                format="MM-DD-YYYY HH:mm:ss"
                                margin="normal"
                                id="date-picker-end"
                                label="Date End"
                                value={selectedEndDate}
                                onChange={handleSelectedEndDate}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item xs={2}>
                        <Fab variant="extended"
                            color="primary"
                            aria-label="add" className={classes.button_fluid}
                            onClick={() => { }}>
                            Generate
                            </Fab>
                    </Grid>
                    <Grid item xs={2} />
                </Grid>
            )
            return ret_val;
        }
    };

    function createData(date_time, mm) {
        return { date_time, mm };
    }

    const rows = [
        createData('2019-10-06 04:00:00', '30 mm'),
        createData('2019-10-06 03:30:00', '02 mm'),
        createData('2019-10-06 03:00:00', '07 mm'),
        createData('2019-10-06 02:30:00', '10 mm'),
        createData('2019-10-06 02:00:00', '00 mm'),
        createData('2019-10-06 01:30:00', '01 mm'),
        createData('2019-10-06 01:00:00', '00 mm'),
    ];

    const [modal, setModal] = useState([<TransitionalModal status={false} />])

function download() {
    setModal([<TransitionalModal status={true} />])
    setTimeout(() => {
        setModal([<TransitionalModal status={false} />])
        alert("Download success!")
    }, 3000)
}

function print() {
    setModal([<TransitionalModal status={true} />])
    setTimeout(() => {
        setModal([<TransitionalModal status={false} />])
        alert("Print success!")
    }, 3000)
}

    return (
        <Fragment>
            <Container>
                <Grid container spacing={4}>
                    {
                        options.map((option, i) => {
                            console.log("LOOP: ", i)
                            console.log("DATA: ", option)
                            let graph = [];
                            if ('cumulative' in option) {
                                graph.push(<Grid item xs={4} md={4}>
                                    <Paper>
                                        <HighchartsReact
                                            highcharts={Highcharts}
                                            options={option.cumulative}
                                        />
                                    </Paper>
                                </Grid>);
                            } else {
                                graph.push(
                                    <Grid item xs={4} md={4}>
                                        <Paper>
                                            <HighchartsReact
                                                highcharts={Highcharts}
                                                options={option.instantaneous}
                                            />
                                        </Paper>
                                    </Grid>
                                );
                                graph.push(
                                    <Grid item xs={4} md={4}>
                                    <Paper>
                                        <Table className={dt_classes.table}>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Date and time</TableCell>
                                                    <TableCell>Rain (mm / 30 mins)</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {rows.map(row => (
                                                    <TableRow key={row.date_time}>
                                                        <TableCell component="th" scope="row">
                                                            {row.date_time}
                                                        </TableCell>
                                                        <TableCell>{row.mm}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </Paper>
                                </Grid>
                                )
                            }
                            return (
                                <Fragment key={i}>
                                    {graph}
                                </Fragment>
                            );
                        })
                    }
                    <Grid item xs={12}>
                        {enableDataGeneratorOptions(site)}
                        {enableDownloadPrint(site)}
                    </Grid>
                </Grid>
            </Container>
            {modal}
        </Fragment>
    );
}

export default RainfallPlot;