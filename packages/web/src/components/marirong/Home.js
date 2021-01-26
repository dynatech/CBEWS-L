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
                            <Typography variant="h6"><span style={{fontWeight: 900}}>{data.rain_gauge.toUpperCase()}</span>{` as of `}<span style={{fontWeight: 900}}>{moment(data.data_ts).format("LLL")}</span></Typography>
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

    return (
        <Fragment>
            {
                data !== null ? (
                    <Fragment>
                        <Grid container>
                            <Grid item xs={6} align="center">
                                <Typography variant="button" color="primary">Observance Timestamp</Typography>
                                <br />
                                <Typography variant="body1"><span style={{fontWeight: 900}}>{data[0].observance_ts}</span></Typography>
                            </Grid>
                            <Grid item xs={6} align="center">
                                <Typography variant="button" color="primary">Remarks</Typography>
                                <br />
                                <Typography variant="body1"><span style={{fontWeight: 900}}>{data[0].remarks}</span></Typography>
                            </Grid>
                            <Grid item xs={6} align="center">
                                <Typography variant="button" color="primary">Feature Type</Typography>
                                <br />
                                <Typography variant="body1"><span style={{fontWeight: 900}}>{data[0].feature_type}</span></Typography>
                            </Grid>
                            <Grid item xs={6} align="center">
                                <Typography variant="button" color="primary">Feature Name</Typography>
                                <br />
                                <Typography variant="body1"><span style={{fontWeight: 900}}>{data[0].feature_name}</span></Typography>
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
        <Grid container spacing={5} >
            <Grid item xs={12} justify="center" style={{paddingTop: '3%'}}>
                <Typography variant="h3" align="center">Marirong, Leon, Iloilo<span style={{color: '#fa971f'}}> | </span>Current Alert Status as of {moment().format("LLL")}</Typography>
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