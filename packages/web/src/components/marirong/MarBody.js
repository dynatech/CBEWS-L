import React, { useState, Fragment } from "react";
import { Box, Container, Paper, Tabs, Tab, Grid } from "@material-ui/core";
import {
    AlertGeneration,
    CommunityRiskAssessmentPage,
    DataAnalysis,
    Events,
    GroundData,
    Home,
    Maintenance,
    SensorData,
} from "./menu";

function handleContent(app_key) {
    const lookup_obj = {
        alertGen: <AlertGeneration />,
        cra: <CommunityRiskAssessmentPage />,
        dataAnalysis: <DataAnalysis />,
        events: <Events />,
        groundData: <GroundData />,
        home: <Home />,
        maintenance: <Maintenance />,
        sensorData: <SensorData />,
    };
    return lookup_obj[app_key];
}

function Content({ app_key }) {
    return <Fragment>{handleContent(app_key)}</Fragment>;
}

const useStyles = () => {};
export default function MarBody() {
    const classes = useStyles();
    const [value, setValue] = useState("home");
    const [body, setBody] = useState(<Content app_key={value} />);

    const handleChange = (event, app_module) => {
        const content = <Content app_key={app_module} />;
        setValue(app_module);
        setBody(content);
    };

    return (
        <Grid item container xs={12}
            style={{ paddingTop: 93, paddingBottom: 100}}
            width="100%"
        >
            <Grid item xs={12}>
                <Tabs
                    value={value}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={handleChange}
                    centered
                    style={{backgroundColor: '#fa971f', height: 70}}
                >
                    <Tab value="home" label={<span style={{fontSize: 19, paddingTop: 15, fontWeight: 900}}>Home</span>} />
                    <Tab
                        value="cra"
                        label={<span style={{fontSize: 19, paddingTop: 15, fontWeight: 900}}>Community Risk Assessment</span>}
                    />
                    <Tab value="alertGen" label={<span style={{fontSize: 19, paddingTop: 15, fontWeight: 900}}>Alert Generation</span>} />
                    <Tab value="dataAnalysis" label={<span style={{fontSize: 19, paddingTop: 15, fontWeight: 900}}>Data Analysis</span>} />
                    <Tab value="sensorData" label={<span style={{fontSize: 19, paddingTop: 15, fontWeight: 900}}>Sensor Data</span>} />
                    <Tab value="groundData" label={<span style={{fontSize: 19, paddingTop: 15, fontWeight: 900}}>Ground Data</span>} />
                    <Tab value="events" label={<span style={{fontSize: 19, paddingTop: 15, fontWeight: 900}}>Events</span>} />
                    <Tab value="maintenance" label={<span style={{fontSize: 19, paddingTop: 15, fontWeight: 900}}>Maintenance</span>} />
                </Tabs>
            </Grid>
            <Grid item xs={12} style={{paddingLeft: '10%', paddingRight: '10%', height: window.innerHeight}}>
                {body}
            </Grid>
        </Grid>
    );
}
