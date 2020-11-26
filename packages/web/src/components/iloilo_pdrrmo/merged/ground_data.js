import React, { Fragment, useState } from 'react';
import { Container, Grid, Paper, Box, Tabs, Tab } from '@material-ui/core';
import SurficialMarker from '../general/surficial_marker';
import SurficialPlot from '../general/surficial_plot';
import MoMs from '../general/moms';
import ODMonitoring from '../general/od_monitoring';

function GroundData() {

    function getWindowDimensions() {
        const { innerWidth: width, innerHeight: height } = window;
        return {
            width,
            height
        };
    }

    const [value, setValue] = useState("surficial_markers");
    const [content, setContent] = useState(surficial());

    const handleChange = (event, app_module) => {

        switch (app_module) {
            case "surficial_markers":
                setContent(surficial());
                break;
            case "moms":
                setContent(moms());
                break;
            case "on_demand":
                setContent(onDemand());
                break;
            default:
                break;
        }
        setValue(app_module);
    };

    function surficial() {
        return (<Grid container spacing={2} style={{ padding: 20, minHeight: getWindowDimensions().height * 0.677, maxHeight: getWindowDimensions().height * 0.677 }}>
            <Grid item xs={12}>
                <Paper>
                    <Box fontSize={30} align="left" fontWeight="bold" style={{ padding: 20 }}>
                        Surficial data
                    </Box>
                    <Box fontSize={30} align="left" fontWeight="bold" style={{ padding: 20 }}>
                        <SurficialPlot site={"UMI"}/>
                        <SurficialMarker />
                    </Box>
                    <Box fontSize={30} align="left" fontWeight="bold" style={{ padding: 20 }}>
                        <SurficialPlot site={"MAR"}/>
                        <SurficialMarker />
                    </Box>
                    <Box borderTop={2} borderRadius="50%" borderColor="#17526d" />
                </Paper>
            </Grid>
        </Grid>)
    }

    function moms() {
        return (
            <Grid container spacing={2} style={{ padding: 20, minHeight: getWindowDimensions().height * 0.677, maxHeight: getWindowDimensions().height * 0.677 }}>
                <Grid item xs={12}>
                    <Paper>
                        <Box fontSize={30} align="left" fontWeight="bold" style={{ padding: 20 }}>
                            Manifestation of Movements for Umingan
                        </Box>
                        <Box fontSize={30} align="left" fontWeight="bold" style={{ padding: 20 }}>
                            <MoMs />
                        </Box>
                        <Box borderTop={2} borderRadius="50%" borderColor="#17526d" />
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                <Paper>
                        <Box fontSize={30} align="left" fontWeight="bold" style={{ padding: 20 }}>
                            Manifestation of Movements for Marirong
                        </Box>
                        <Box fontSize={30} align="left" fontWeight="bold" style={{ padding: 20 }}>
                            <MoMs />
                        </Box>
                        <Box borderTop={2} borderRadius="50%" borderColor="#17526d" />
                    </Paper>
                </Grid>
            </Grid>
        )
    }

    function onDemand() {
        return (
            <Grid container spacing={2} style={{ padding: 20, minHeight: getWindowDimensions().height * 0.677, maxHeight: getWindowDimensions().height * 0.677 }}>
                <Grid item xs={12}>
                    <Paper>
                        <Box fontSize={30} align="left" fontWeight="bold" style={{ padding: 20 }}>
                            On-demand Monitoring for Umingan
                            </Box>
                        <Box fontSize={30} align="left" fontWeight="bold" style={{ padding: 20 }}>
                            <ODMonitoring />
                        </Box>
                        <Box borderTop={2} borderRadius="50%" borderColor="#17526d" />
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper>
                        <Box fontSize={30} align="left" fontWeight="bold" style={{ padding: 20 }}>
                            On-demand Monitoring for Marirong
                            </Box>
                        <Box fontSize={30} align="left" fontWeight="bold" style={{ padding: 20 }}>
                            <ODMonitoring />
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
                            <Tab value={"surficial_markers"} style={{ paddingTop: '10%', paddingBottom: '10%' }} label="Surficial Markers" />
                            <Tab value={"moms"} style={{ paddingTop: '10%', paddingBottom: '10%' }} label="Manifestation of Movements" />
                            <Tab value={"on_demand"} style={{ paddingTop: '10%', paddingBottom: '10%' }} label="On-demand Monitoring" />
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

export default GroundData