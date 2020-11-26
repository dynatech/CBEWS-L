import React, { Fragment, useState } from 'react';
import { Container, Grid, Paper, Box, Tab, Tabs } from '@material-ui/core';
import RainfallPlot from '../general/rainfall_plot';
import SubsurfacePlot from '../general/subsurface_plot';
import EarthquakeTables from '../general/eq_tables';

function SensorData() {


    function getWindowDimensions() {
        const { innerWidth: width, innerHeight: height } = window;
        return {
            width,
            height
        };
    }

    const [value, setValue] = useState("rain_plot");
    const [content, setContent] = useState(Rainfall());

    const handleChange = (event, app_module) => {

        switch (app_module) {
            case "rain_plot":
                setContent(Rainfall());
                break;
            case "subsurface_plot":
                setContent(Subsurface());
                break;
            case "eq_plot":
                setContent(Earthquake());
                break;
            default:
                break;
        }
        setValue(app_module);
    };

    function Rainfall() {
        return (
            <Grid container spacing={2} style={{ padding: 20, minHeight: getWindowDimensions().height * 0.677, maxHeight: getWindowDimensions().height * 0.677 }}>
                <Grid item xs={12}>
                    <Paper>
                        <Box fontSize={30} align="left" fontWeight="bold" style={{ padding: 20 }}>
                            Rainfall data
                    </Box>
                        <Box fontSize={30} align="left" fontWeight="bold" style={{ padding: 20 }}>
                            <RainfallPlot site={"mar"} />
                        </Box>
                        <Box borderTop={2} borderRadius="50%" borderColor="#17526d" />
                    </Paper>
                </Grid>
            </Grid>)
    }

    function Subsurface() {
        return (
            <Grid container spacing={2} style={{ padding: 20, minHeight: getWindowDimensions().height * 0.677, maxHeight: getWindowDimensions().height * 0.677 }}>
                <Grid item xs={12}>
                    <Paper>
                        <Box fontSize={30} align="left" fontWeight="bold" style={{ padding: 20 }}>
                            Subsurface sensor data
                        </Box>
                        <Box fontSize={30} align="left" fontWeight="bold" style={{ padding: 20 }}>
                            <SubsurfacePlot site={"mar"} feature={"sensor_data"} />
                        </Box>
                        <Box fontSize={30} align="left" fontWeight="bold" style={{ padding: 20 }}>
                            <SubsurfacePlot site={"mar"} feature={"data_analysis"} />
                        </Box>
                        <Box borderTop={2} borderRadius="50%" borderColor="#17526d" />
                    </Paper>
                </Grid>
            </Grid>

        )
    }

    function Earthquake() {
        return (
            <Grid container spacing={2} style={{ padding: 20, minHeight: getWindowDimensions().height * 0.677, maxHeight: getWindowDimensions().height * 0.677 }}>
                <Grid item xs={12}>
                    <Paper>
                        <Box fontSize={30} align="left" fontWeight="bold" style={{ padding: 20 }}>
                            Earthquake data
            </Box>
                        <Box fontSize={30} align="left" fontWeight="bold" style={{ padding: 20 }}>
                            <EarthquakeTables />
                        </Box>
                        <Box borderTop={2} borderRadius="50%" borderColor="#17526d" />
                    </Paper>
                </Grid>
            </Grid>

        )
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
                            <Tab value={"rain_plot"} style={{ paddingTop: '10%', paddingBottom: '10%' }} label="Rainfall Plot" />
                            <Tab value={"subsurface_plot"} style={{ paddingTop: '10%', paddingBottom: '10%' }} label="Subsurface Plot" />
                            <Tab value={"eq_plot"} style={{ paddingTop: '10%', paddingBottom: '10%' }} label="Earthquake" />
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

export default SensorData