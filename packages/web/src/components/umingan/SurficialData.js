import React, { useEffect, Fragment } from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";

import Summary from './surficial_data/Summary';
import MonitoringLogs from './surficial_data/MonitoringLogs';
import LatestMeasurement from './surficial_data/LatestMeasurement';

import { UmiGroundData } from "@dynaslope/commons";

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

export default function SurficialData() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const [latestMeas, setLatestMeas] = React.useState(null);
    const [latestMoms, setLatestMoms] = React.useState(null);

    useEffect(() => {
        init();
    }, []);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const init = async () => {
        const surficial_response = await UmiGroundData.GetSurficialMarkersData();
        console.log("surficial_response", surficial_response);
        if (surficial_response.status === true) {
            if (surficial_response.data.length > 0) {
                const latest_meas = surficial_response.data[0];
                const key = Object.keys(latest_meas)[0];
                const obj = {
                    markers: surficial_response.markers,
                    data: latest_meas[key]
                };
                obj.data.ts = moment(obj.data.ts).format("dddd,  MMMM Do YYYY, h:mm a");
                setLatestMeas(obj);
            }
        } else {
            console.error(surficial_response.message);
        }

        const moms_response = await UmiGroundData.GetMOMSData();
        console.log("moms_response", moms_response);
        if (moms_response.status === true) {
            if (moms_response.data.length > 0) {
                const latest_moms = moms_response.data[0];
                setLatestMoms(latest_moms);
            }
        } else {
            console.error(moms_response.message);
        }

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
                    <Tab label="Latest Surficial Data" {...a11yProps(1)} />
                    <Tab label="Monitoring Logs" {...a11yProps(2)} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <Summary 
                    classes={classes}
                    latestMeas={latestMeas}
                    latestMoms={latestMoms}
                />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <LatestMeasurement 
                    classes={classes}
                    latestMeas={latestMeas}
                />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <MonitoringLogs 
                    classes={classes}
                />
            </TabPanel>
        </div>
    );
}
