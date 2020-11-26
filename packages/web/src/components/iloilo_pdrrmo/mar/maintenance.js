import React, { Fragment, useState } from 'react';
import { Container, Grid, Paper, Box, Tabs, Tab } from '@material-ui/core';
import MaintenanceLogs from '../general/maintenance_logs';
import IncidentReports from '../general/incident_reports';


function Maintenance() {

    function getWindowDimensions() {
        const { innerWidth: width, innerHeight: height } = window;
        return {
            width,
            height
        };
    }

    const [value, setValue] = useState("maintenance_logs");
    const [content, setContent] = useState(Maintenance());

    const handleChange = (event, app_module) => {

        switch (app_module) {
            case "maintenance_logs":
                setContent(Maintenance());
                break;
            case "incident_reports":
                setContent(Incident());
                break;
            default:
                break;
        }
        setValue(app_module);
    };


    function Maintenance() {
        return (
            <Grid container spacing={2} style={{ padding: 20, minHeight: getWindowDimensions().height * 0.677, maxHeight: getWindowDimensions().height * 0.677 }}>
                <Grid item xs={12}>
                    <Paper>
                        <Box fontSize={30} align="left" fontWeight="bold" style={{ padding: 20 }}>
                            Maintenance Logs
                            </Box>
                        <Box align="left" fontWeight="bold" style={{ padding: 20 }}>
                            <MaintenanceLogs />
                        </Box>
                        <Box borderTop={2} borderRadius="50%" borderColor="#17526d" />
                    </Paper>
                </Grid>
            </Grid>
        )
    }

    function Incident() {
        return (<Grid container spacing={2} style={{ padding: 20, minHeight: getWindowDimensions().height * 0.677, maxHeight: getWindowDimensions().height * 0.677 }}>
            <Grid item xs={12}>
                <Paper>
                    <Box fontSize={30} align="left" fontWeight="bold" style={{ padding: 20 }}>
                        Incident Logs
                            </Box>
                    <Box align="left" fontWeight="bold" style={{ padding: 20 }}>
                        <IncidentReports />
                    </Box>
                    <Box borderTop={2} borderRadius="50%" borderColor="#17526d" />
                </Paper>
            </Grid>
        </Grid>)
    }


    return (
        <Fragment>
            <Grid container>
                <Grid item xs={2} >
                    <Paper square>
                        <Tabs
                            orientation="vertical"
                            variant="scrollable"
                            value={value}
                            indicatorColor="primary"
                            textColor="primary"
                            onChange={handleChange}
                            centered
                            style={{ minHeight: getWindowDimensions().height * 0.845, maxHeight: getWindowDimensions().height * 0.85 }}
                        >
                            <Tab value={"maintenance_logs"} style={{ paddingTop: '10%', paddingBottom: '10%' }} label="Maintenance Logs" />
                            <Tab value={"incident_reports"} style={{ paddingTop: '10%', paddingBottom: '10%' }} label="Incident Reports" />
                        </Tabs>
                    </Paper>
                </Grid>
                <Grid item xs={9} style={{ height: getWindowDimensions().height * 0.845, overflowX: 'auto' }}>
                    {content}
                </Grid>
            </Grid>
        </Fragment>
    )
}

export default Maintenance