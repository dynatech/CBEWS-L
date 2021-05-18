import React, { useState, useEffect, Fragment, useRef } from 'react';
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import * as moment from "moment";
import {
    Grid, Paper, Container,
    Fab, makeStyles, Table,
    TableBody, TableCell, TableHead,
    TableRow, Typography
} from "@material-ui/core";
// import { sample_rain_data } from "./sample_rain_data._not_final";
import { useCookies } from 'react-cookie';
import { MarDataAnalysis } from "@dynaslope/commons";
import { UmiDataAnalysis } from "@dynaslope/commons";

require("highcharts/modules/exporting")(Highcharts);

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
    const series_data = [];
    const max_rval_data = [];
    const hr_24 = [];
    const hr_72 = [];
    const rain = [];
    const max_72h = 0;

    set.data.forEach((hr24) => {
        hr_24.push([moment(hr24.ts).unix(), hr24['24hr cumulative rainfall']])
    })

    set.data.forEach((hr72) => {
        hr_72.push([moment(hr72.ts).unix(), hr72['72hr cumulative rainfall']])
    })

    set.data.forEach((data) => {
        rain.push([moment(data.ts).unix(), data['rain']])
    })

    delete set['data']

    set['24h'] = hr_24;
    set['72h'] = hr_72;
    set['rain'] = rain;
    let null_ranges = [{ from: moment(set['ts_start']).unix(), to: moment(set['ts_end']).unix() }]
    set['null_ranges'] = null_ranges;
    Object.keys(rainfall_colors).forEach((name) => {
        set[name].forEach(element => {
            if (element[1] == undefined) {
                element[1] = 0;
            }
        });
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
        exporting: { enabled: true},
        time: { timezoneOffset: -8 * 60 }
    };
}

function prepareCumulativeRainfallChartOption(row, input) {
    const { set, series_data } = row;
    const {
        distance,
        threshold_value: max_rain_2year, gauge_name
    } = set;
    const max_72h = 0;

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
        exporting: { enabled: true},
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

export default function RainfallPlot(props) {
    const { feature } = props
    const [rainfallData, setRainfallData] = useState();
    const [options, setOptions] = useState();
    const [loadGraph, setLoadGraph] = useState(false);
    const processed_data = [];
    const [instantaneousDt, setInstantaneousDt] = useState([]);
    const [cookies, setCookie] = useCookies(['credentials']);

    const classes = useStyles();
    const dt_classes = tableStyle();

    useEffect(() => {
        initRainfall(cookies.credentials.site_code)
    }, [])

    const initRainfall = async () => {
        let func
        if (cookies.credentials.site_code === "mar") {
            func = MarDataAnalysis
        }
        const response = await MarDataAnalysis.GetRainfallPlotData();
        if (response.status === true) {
            let rainfall_data = response.data[0];
            setRainfallData(rainfall_data);
            prepRainPlot(rainfall_data.plot, rainfall_data.ts_start, rainfall_data.ts_end);
        } else {
            console.error(response.message);
        }
    }

    const prepRainPlot = (rainfall, ts_start, ts_end) => {
        rainfall.forEach(set => {
            const data = prepareRainfallData(set, ts_start, ts_end);
            processed_data.push(data);
        });
        setOptions(renderGraph(processed_data, ts_start, ts_end))
        setLoadGraph(true);
    }

    const renderGraph = (processed_data, start, end) => {
        const temp = [];
        // STATIC CODE HERE but HELL
        const input = { ts_end: end, ts_start: start, site_code: "mar".toUpperCase() }
        processed_data.forEach(data => {
            if (feature === "data_analysis" || feature === "alert_validation") {
                const cumulative = prepareCumulativeRainfallChartOption(data, input);
                temp.push({ cumulative });
            } else {
                const instantaneous = prepareInstantaneousRainfallChartOption(data, input);
                let temp_raw_dt = [];
                let last_five_data_points = data.max_rval_data[0].data.slice(-6 );
                last_five_data_points.forEach(element => {
                    temp_raw_dt.push(createData(moment.unix(element[0]).format("YYYY-MM-DD HH:mm:ss"), `${element[1]} mm`))
                });
                temp.push({ instantaneous });
                setInstantaneousDt(temp_raw_dt.reverse());
            }
        });
        return temp
    }

    const createData = (date_time, mm) => {
        return { date_time, mm };
    }
    
    return (
        <Fragment>
        <br/>
            <Container>
                <Grid container spacing={4}>
                    {
                        loadGraph ? options.map((option, i) => {
                            let opt;
                            let grid_size;
                            let instantaneous_table = []
                            if (feature === "data_analysis" || feature === "alert_validation") {
                                opt = option.cumulative;
                                grid_size = 12
                            } else {
                                opt = option.instantaneous;
                                grid_size = 6
                                instantaneous_table.push(

                                    <Grid item xs={grid_size}>
                                        <Paper>
                                            <Table className={dt_classes.table}>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Date and time</TableCell>
                                                        <TableCell>Rain (mm / 30 mins)</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {instantaneousDt.map(row => (
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
                                    <Grid item xs={grid_size} md={6}>
                                        <Paper>
                                            <HighchartsReact
                                                highcharts={Highcharts}
                                                options={opt}
                                            />
                                        </Paper>
                                    </Grid>
                                    {instantaneous_table}
                                </Fragment>
                            );
                        }) :
                            <Grid item xs={12}>
                                <Paper>
                                    <Typography align='center'>
                                            Loading rainfall graphs
                                    </Typography>
                                </Paper>
                            </Grid>
                    }
                </Grid>
            </Container>
        </Fragment>
    )
}
