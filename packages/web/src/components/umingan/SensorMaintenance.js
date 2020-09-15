import React, { useState, Fragment } from "react";

import Summary from './sensor_maintenance/Summary';
import MaintenanceLogs from './sensor_maintenance/MaintenanceLogs';
import SensorStatus from './sensor_maintenance/SensorStatus';
import RainfallGraph from './sensor_maintenance/RainfallPlot';

import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`nav-tabpanel-${index}`}
            aria-labelledby={`nav-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Fragment>{children}</Fragment>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `nav-tab-${index}`,
        "aria-controls": `nav-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        marginTop: 10,
        backgroundColor: theme.palette.background.paper,
    },
}));

export default function SensorMaintenance() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className={classes.root}>
            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="Situation Report"
                >
                    <Tab label="Summary" {...a11yProps(0)} />
                    <Tab label="Sensor Status" {...a11yProps(1)} />
                    <Tab label="Maintenance Logs" {...a11yProps(2)} />
                    <Tab label="Rainfall Graph" {...a11yProps(3)} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <Summary 
                    classes={classes}
                />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <SensorStatus 
                    classes={classes}
                />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <MaintenanceLogs 
                    classes={classes}
                />
            </TabPanel>
            <TabPanel value={value} index={3}>
                <RainfallGraph 
                    classes={classes}
                    feature="data_analysis"
                />
            </TabPanel>
        </div>
    );
}
