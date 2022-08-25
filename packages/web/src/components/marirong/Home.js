import React, { Fragment, useEffect } from "react";
import { Grid, Paper, Typography } from "@material-ui/core";
import moment from "moment";

import { MarDataAnalysis, MarGroundData } from "@dynaslope/commons";

function LatestRainfall() {
    const [data, setData] = React.useState("loading");

    React.useEffect(() => {
        console.log("dd");
        init();
    }, []);

    const init = async () => {
        const response = MarDataAnalysis.GetRainfallAnalysis();
        // if (response.status === true) {
        //     console.log("success");
        // setData(response.data);
        console.log(response);

        let rainData = response.data;
        if (rainData.length > 0) {
            setData(rainData[0]);
        }
    };

    if (data === "loading") {
        return (
            <Grid item xs={12} align="center">
                <Typography variant="h5" align="center" color="primary">
                    Loading...
                </Typography>
            </Grid>
        );
    } else if (data === null) {
        return (
            <Grid item xs={12} align="center">
                <Typography variant="h5" align="center" color="secondary">
                    No data available
                </Typography>
            </Grid>
        );
    } else {
        return (
            <Grid item align="center">
                <Typography variant="h6">
                    <span style={{ fontWeight: 900 }}>{data.rain_gauge}</span>
                    {` as of `}
                    <span style={{ fontWeight: 900 }}>
                        {moment(data.data_ts).format("LLL")}
                    </span>
                </Typography>
                <Typography variant="h6" color="primary">
                    {`1-day cumulative rainfall: ${
                        data["1D cml"]
                    } mm (${Math.round(
                        (data["1D cml"] / data["half of 2yr max"]) * 100,
                    )}% of threshold)`}
                </Typography>
                <Typography variant="h6" color="primary">
                    {`3-day cumulative rainfall: ${
                        data["3D cml"]
                    } mm (${Math.round(
                        (data["3D cml"] / data["2yr max"]) * 100,
                    )}% of threshold)`}
                </Typography>
                <Typography variant="body1">
                    DATA ANALYSIS:{"\n"}
                    {data["DataSource"]}
                </Typography>
            </Grid>
        );
    }
}

function LatestGroundMeas() {
    const [data, setData] = React.useState("No data available");

    React.useEffect(() => {
        console.log("ss");
        init();
    }, []);

    const init = async () => {
        const response = MarDataAnalysis.GetSurficialPlotAnalysis();
        // if (response.status === true) {
        //     console.log(response.message);
        //     setData(response.data);
        // } else {
        //     console.error(response.message);
        // }
        // setData(response.data);
    };

    return data === "loading" ? (
        <Grid item xs={12} align="center">
            <Typography variant="h5" align="center" color="primary">
                Loading...
            </Typography>
        </Grid>
    ) : data === "No data available" ? (
        <Grid item xs={12} align="center">
            <Typography variant="h5" align="center" color="secondary">
                No data available
            </Typography>
        </Grid>
    ) : (
        <Grid item align="center">
            {console.log("data.surficial_plot:", data.surficial_plot)}
            <Typography variant="body1">{data.surficial_plot}</Typography>
            <br />
            <br />
            <Typography variant="body1">{data.analysis}</Typography>
        </Grid>
    );
}

function LatestMoms() {
    const [data, setData] = React.useState("loading");

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
    };

    if (data === "loading") {
        return (
            <Grid item xs={12} align="center">
                <Typography variant="h5" align="center" color="primary">
                    Loading...
                </Typography>
            </Grid>
        );
    } else if (data.length === 0) {
        return (
            <Grid item xs={12} align="center">
                <Typography variant="h5" align="center" color="secondary">
                    No data available
                </Typography>
            </Grid>
        );
    } else {
        console.log(data);
        return (
            <Fragment>
                <Grid container>
                    <Grid item xs={6} align="center">
                        <Typography variant="button" color="primary">
                            Observance Timestamp
                        </Typography>
                        <br />
                        <Typography variant="body1">
                            <span style={{ fontWeight: 900 }}>
                                {data[0].observance_ts}
                            </span>
                        </Typography>
                    </Grid>
                    <Grid item xs={6} align="center">
                        <Typography variant="button" color="primary">
                            Remarks
                        </Typography>
                        <br />
                        <Typography variant="body1">
                            <span style={{ fontWeight: 900 }}>
                                {data[0].remarks}
                            </span>
                        </Typography>
                    </Grid>
                    <Grid item xs={6} align="center">
                        <Typography variant="button" color="primary">
                            Feature Type
                        </Typography>
                        <br />
                        <Typography variant="body1">
                            <span style={{ fontWeight: 900 }}>
                                {data[0].feature_type}
                            </span>
                        </Typography>
                    </Grid>
                    <Grid item xs={6} align="center">
                        <Typography variant="button" color="primary">
                            Feature Name
                        </Typography>
                        <br />
                        <Typography variant="body1">
                            <span style={{ fontWeight: 900 }}>
                                {data[0].feature_name}
                            </span>
                        </Typography>
                    </Grid>
                </Grid>
            </Fragment>
        );
    }
}

export default function Home() {
    return (
        <Grid container spacing={5} style={{ paddingTop: "5%" }}>
            <Grid item xs={12} justify="center" style={{ paddingTop: "3%" }}>
                <Typography variant="h3" align="center">
                    Marirong, Leon, Iloilo
                    <span style={{ color: "#fa971f" }}> | </span>Current Alert
                    Status as of {moment().format("LLL")}
                </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
                <Paper style={{ height: "150px", padding: "5%" }}>
                    <Typography variant="h6" align="center">
                        Latest Rainfall data
                    </Typography>
                    <LatestRainfall />
                </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
                <Paper style={{ height: "150px", padding: "5%" }}>
                    <Typography variant="h6" align="center">
                        Latest Ground Measurement data
                    </Typography>
                    <LatestGroundMeas />
                </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
                <Paper style={{ height: "150px", padding: "5%" }}>
                    <Typography variant="h6" align="center">
                        Latest Manifestations of Movement data
                    </Typography>
                    {/* <LatestMoms /> */}
                </Paper>
            </Grid>
        </Grid>
    );
}
