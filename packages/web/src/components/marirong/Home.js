import React, { Fragment, useEffect } from 'react';
import { Grid, Paper, Typography, } from '@material-ui/core';
import moment from 'moment';

import { MarDataAnalysis } from '@dynaslope/commons';


function LatestRainfall () {
    const [data, setData] = React.useState(null);
    
    React.useEffect(() => {
        init();
    }, []);

    const init = async () => {
        const response = MarDataAnalysis.GetRainfallAnalysis();
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
                        <Typography variant="h6">{`${data.rain_gauge.toUpperCase()} as of ${moment(data.data_ts).format("D MMM YYYY HH:mm")}`}</Typography>
                        <Typography variant="h6">{`1-day cumulative rainfall: ${data["1_day_cumulative"]} (${data["1_day_percent"]} of threshold)`}</Typography>
                        <Typography variant="h6">{`3-day cumulative rainfall: ${data["3_day_cumulative"]} (${data["3_day_percent"]} of threshold)`}</Typography>
                        <Typography variant="h6">{data.analysis}</Typography>
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
                    <Fragment>
                        <Typography variant="body">{data.latest_data}</Typography>
                        <br /><br />
                        <Typography variant="body">{data.analysis}</Typography>
                    </Fragment>

                ) : (
                    <Typography variant="h5" align="center" color="secondary">No data available</Typography>
                )
            }
        </Fragment>
    );
}

function LatestMoms () {
    return (
        <Typography variant="h5" align="center" color="secondary">No Moms Data Available</Typography>
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
                    <Typography variant="h6" align="center">Latest Subsurface data</Typography>
                    <Typography variant="h5" align="center" color="secondary">No subsurface data available</Typography>
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