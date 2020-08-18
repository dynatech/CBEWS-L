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
            style={{ paddingTop: 100, paddingBottom: 100 }}
            width="100%"
        >
            <Grid item xs={12}>
                <Paper square>
                    <Tabs
                        value={value}
                        indicatorColor="primary"
                        textColor="primary"
                        // variant="fullWidth"
                        onChange={handleChange}
                        centered
                    >
                        <Tab value="home" label="Home" />
                        <Tab
                            value="cra"
                            label="Community Risk Assessment"
                        />
                        <Tab value="alertGen" label="Alert Generation" />
                        <Tab value="dataAnalysis" label="Data Analysis" />
                        <Tab value="sensorData" label="Sensor Data" />
                        <Tab value="groundData" label="Ground Data" />
                        <Tab value="events" label="Events" />
                        <Tab value="maintenance" label="Maintenance" />
                    </Tabs>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                {body}
            </Grid>
        </Grid>
    );
}
