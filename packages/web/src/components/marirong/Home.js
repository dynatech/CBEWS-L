import React, { Fragment, useEffect } from 'react';
import { Grid, Paper, Typography, } from '@material-ui/core';
import moment from 'moment';

import { MarDataAnalysis, MarGroundData } from '@dynaslope/commons';


function LatestRainfall () {
    const [data, setData] = React.useState(null);
    
    React.useEffect(() => {
        init();
    }, []);

    const init = async () => {
        const response = await MarDataAnalysis.GetRainfallAnalysis();
        if (response.status === true) {
            console.log("success");
            setData(response.data);
        }
    }
    
    return (
        <Fragment>
            {
                data !== null ? (
                    <Fragment>
                        <Grid item align="center">
                            <Typography variant="h6">{`${data.rain_gauge.toUpperCase()} as of ${moment(data.data_ts).format("D MMM YYYY HH:mm")}`}</Typography>
                            <Typography variant="h6" color="primary">{`1-day cumulative rainfall: ${data["1_day_cumulative"]} (${data["1_day_percent"]}% of threshold)`}</Typography>
                            <Typography variant="h6" color="secondary">{`3-day cumulative rainfall: ${data["3_day_cumulative"]} (${Math.round((parseInt(data["3_day_cumulative"]) + Number.EPSILON) * 100) / 100}% of threshold)`}</Typography>
                            <Typography variant="body1">DATA ANALYSIS: {data.analysis}</Typography>
                        </Grid>
                    </Fragment>

                ) : (
                    <Typography variant="h5" align="center" color="secondary">No data available</Typography>
                )
            }
        </Fragment>
    );
}


function LatestGroundMeas () {
    const [data, setData] = React.useState(null);
    
    React.useEffect(() => {
        init();
    }, []);

    const init = async () => {
        const response = await MarDataAnalysis.GetSurficialPlotAnalysis();
        console.log("response", response);
        if (response.status === true) {
            console.log(response.message);
            setData(response.data);
        } else {
            console.error(response.message);
        }
    }

    console.log("data", data)

    return (
        <Fragment>
            {
                data !== null ? (
                    <Grid item align="center">
                        <Typography variant="body">{data.latest_data}</Typography>
                        <br /><br />
                        <Typography variant="body">{data.analysis}</Typography>
                    </Grid>

                ) : (
                    <Typography variant="h5" align="center" color="secondary">No data available</Typography>
                )
            }
        </Fragment>
    );
}

function LatestMoms () {
    const [data, setData] = React.useState(null);
    
    React.useEffect(() => {
        init();
    }, []);

    const init = async () => {
        const response = await MarGroundData.GetMOMSData();
        if (response.status === true) {
            setData(response.data);
        } else {
            console.error(response.message);
        }
    }

    console.log("data", data)

    return (
        <Fragment>
            {
                data !== null ? (
                    <Fragment>
                        <Grid container>
                            <Grid item xs={6} align="center">
                                <Typography variant="button" color="primary">Observance Timestamp</Typography>
                                <br />
                                <Typography variant="body1">{data[0].observance_ts}</Typography>
                            </Grid>
                            <Grid item xs={6} align="center">
                                <Typography variant="button" color="primary">Remarks</Typography>
                                <br />
                                <Typography variant="body1">{data[0].remarks}</Typography>
                            </Grid>
                            <Grid item xs={6} align="center">
                                <Typography variant="button" color="primary">Feature Type</Typography>
                                <br />
                                <Typography variant="body1">{data[0].feature_type}</Typography>
                            </Grid>
                            <Grid item xs={6} align="center">
                                <Typography variant="button" color="primary">Feature Name</Typography>
                                <br />
                                <Typography variant="body1">{data[0].feature_name}</Typography>
                            </Grid>
                        </Grid>
                    </Fragment>
                ) : (
                    <Typography variant="h5" align="center" color="secondary">No data available</Typography>
                )
            }
        </Fragment>
    );
}

export default function Home () {

    return (
        <Grid container spacing={1} >
            <Grid item xs={12} justify="center">
                <br/>
                <Paper>
                    <Typography variant="h3" align="center">CURRENT ALERT</Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
                <Paper style={{ height: "150px", padding: "5%"}}>
                    <Typography variant="h6" align="center">Latest Rainfall data</Typography>
                    <LatestRainfall />
                </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
                <Paper style={{ height: "150px", padding: "5%"}}>
                    <Typography variant="h6" align="center">Latest Ground Measurement data</Typography>
                    <LatestGroundMeas />
                </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
                <Paper style={{ height: "150px", padding: "5%"}}>
                    <Typography variant="h6" align="center">Latest Manifestations of Movement data</Typography>
                    <LatestMoms />
                </Paper>
            </Grid>
        </Grid>

    )
}