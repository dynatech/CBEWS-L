import React, { useState, Fragment } from "react";
import { Box, Container, Paper, Tabs, Tab, Grid } from "@material-ui/core";
import {
    RiskAssessment,
    FieldSurvey,
    SituationReport,
    SensorMaintenance,
    SurficialData,
    EWI,
    Reports,
} from "./menu";

function handleContent(app_key) {
    const lookup_obj = {
        riskAssessment: <RiskAssessment />,
        fieldSurvey: <FieldSurvey />,
        situationReport: <SituationReport />,
        sensorMaintenance: <SensorMaintenance />,
        surficialData: <SurficialData />,
        EWI: <EWI />,
        reports: <Reports />,
    };
    return lookup_obj[app_key];
}

function Content({ app_key }) {
    return <Fragment>{handleContent(app_key)}</Fragment>;
}

const useStyles = () => {};
export default function MarBody() {
    const classes = useStyles();
    const [value, setValue] = useState("riskAssessment");
    const [body, setBody] = useState(<Content app_key={value} />);

    const handleChange = (event, app_module) => {
        const content = <Content app_key={app_module} />;
        setValue(app_module);
        setBody(content);
    };

    return (
        <Box style={{ paddingTop: 230, paddingBottom: 100 }}>
            <Paper square>
                <Tabs
                    value={value}
                    indicatorColor="primary"
                    textColor="primary"
                    // variant="fullWidth"
                    onChange={handleChange}
                    centered
                >
                    <Tab value="riskAssessment" label="Risk Assessment" />
                    <Tab value="fieldSurvey" label="Field Survey" />
                    <Tab value="situationReport" label="Situation Report" />
                    <Tab value="sensorMaintenance" label="Sensor Maintenance" />
                    <Tab value="surficialData" label="Surficial Data" />
                    <Tab value="EWI" label="EWI" />
                    <Tab value="reports" label="Reports" />
                </Tabs>
            </Paper>

            <Container>
                {body}
            </Container>
        </Box>
    );
}
