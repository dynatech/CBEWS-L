import React, { useState, Fragment, useEffect } from 'react';
import moment from 'moment';
import { Container, Paper, Grid, CardMedia, Box, makeStyles, Fab } from '@material-ui/core';
import { AlertGeneration } from '@dynaslope/commons';


const useStyles = makeStyles(theme => ({
    buttons: {
        width: '90%'
    }
}));

function AlertStatus(props) {
        const classes = useStyles();
        const [body, setBody] = useState({ umi: null, mar: null });
        const [menuUmiSize, setMenuUmiSize] = useState({height: window.innerHeight * 0.2, width: window.innerHeight * 0.2});
        const [menuMarSize, setMenuMarSize] = useState({height: window.innerHeight * 0.2, width: window.innerHeight * 0.2});

        useEffect(() => {
            init();
        }, []);

        const init = async () => {
            // MAR INIT
            const mar_response = await AlertGeneration.MarGetOngoingAndExtendedMonitoring();
            const { data, status } = mar_response;
            if (status) {
                const { latest, overdue, extended } = data;
                const temp_list = [ ...latest, ...overdue, ...extended ];
                const mar_data = temp_list.length > 0 ? temp_list[0] : null;
                setBody({ ...body, umi: mar_data });
            } else {
                console.error("There is something wrong with the code in alert status");
            }

            // UMI INIT
            const umi_response = await AlertGeneration.UmiGetOngoingAndExtendedMonitoring();
            const { data: umiData, status: umiStatus } = umi_response;
            if (umiStatus) {
                const { latest, overdue, extended } = umiData;
                const temp_list = [ ...latest, ...overdue, ...extended ];
                const umi_data = temp_list.length > 0 ? temp_list[0] : null;
                setBody({ ...body, umi: umi_data });
            } else {
                console.error("There is something wrong with the code in alert status");
            }
        }
    
        return (
            <Fragment>
                <Container style={{ marginTop: '5%' }}>
                    <Grid container align="center" spacing={2}>
                        <Grid item xs={2}/>
                        <Grid item xs={4}>
                            <Grid container direction="column">
                                <Grid item xs={12}>
                                    <CardMedia
                                        image={require('../../../assets/umi_seal.png')}
                                        style={menuUmiSize}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Box fontSize={25}>
                                        Umingan, Alimodian, Iloilo
                                    </Box>
                                </Grid>
                                {
                                    body.umi !== null ? (
                                        <Grid item xs={12} style={{paddingTop: 20, paddingBottom: 20}}>
                                            <Box style={{display: 'inline-flex'}}>
                                                <Box fontSize={20} style={{paddingTop: 10, paddingBottom: 10}}>
                                                    Current Alert:
                                                </Box>
                                                <Box fontSize={20} color="#f5981c" fontWeight={"bold"} style={{paddingTop: 10, paddingBottom: 10, marginLeft: 5}}>
                                                    Alert {body.umi.public_alert_level}
                                                </Box>
                                            </Box>
                                            <Box style={{display: 'inline-flex'}}>
                                                <Box fontSize={15}>
                                                    Start of event:
                                                </Box>
                                                <Box fontSize={15} fontWeight={"bold"} style={{marginLeft: 5}}>
                                                    {moment(body.umi.event_start).format("MMMM D, YYYY HH:mm:SS")}
                                                </Box>
                                            </Box>
                                            <Box style={{display: 'inline-flex'}}>
                                                <Box fontSize={15}>
                                                    Latest trigger:
                                                </Box>
                                                <Box fontSize={15} fontWeight={"bold"} style={{marginLeft: 5}}>
                                                    {moment(body.umi.latest_event_triggers[0].timestamp).format("MMMM D, YYYY HH:mm:SS")}
                                                </Box>
                                            </Box>
                                            <Box style={{display: 'inline-flex'}}>
                                                <Box fontSize={15}>
                                                    Validity:
                                                </Box>
                                                <Box fontSize={15} fontWeight={"bold"} style={{marginLeft: 5}}>
                                                    {body.umi.validity}
                                                </Box>
                                            </Box>
                                            <Box style={{display: 'inline-flex'}}>
                                                <Box fontSize={15}>
                                                    Details:
                                                </Box>
                                                <Box fontSize={15} fontWeight={"bold"} style={{marginLeft: 5}}>
                                                    {body.umi.latest_event_triggers[0].info}
                                                </Box>
                                            </Box>
                                        </Grid>
                                    ) : (
                                        <Grid item xs={12} style={{paddingTop: 20, paddingBottom: 20}}>
                                            <Box style={{display: 'inline-flex'}}>
                                                <Box fontSize={15} fontWeight={"bold"} style={{marginLeft: 5}}>
                                                    No alert on site
                                                </Box>
                                            </Box>
                                        </Grid>
                                    )
                                }

                            </Grid>
                            <Grid container>
                                <Grid item xs={6}>
                                    <Fab variant="extended"
                                        color={"primary"}
                                        className={classes.buttons}
                                        aria-label="add">
                                        Download
                                    </Fab>
                                </Grid>
                                <Grid item xs={6}>
                                    <Fab variant="extended"
                                        color={"primary"}
                                        className={classes.buttons}
                                        aria-label="add">
                                        Print
                                    </Fab>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={4}>
                            <Grid container direction="column">
                                <Grid item xs={12}>
                                    <CardMedia
                                        image={require('../../../assets/mar_seal.png')}
                                        style={menuMarSize}    
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Box fontSize={25}>
                                        Marirong, Leon, Iloilo
                                    </Box>
                                </Grid>
                                    {
                                        body.mar !== null ? (
                                            <Grid item xs={12} style={{paddingTop: 20, paddingBottom: 20}}>
                                                <Box style={{display: 'inline-flex'}}>
                                                    <Box fontSize={20} style={{paddingTop: 10, paddingBottom: 10}}>
                                                        Current Alert:
                                                    </Box>
                                                    <Box fontSize={20} color="#f5981c" fontWeight={"bold"} style={{paddingTop: 10, paddingBottom: 10, marginLeft: 5}}>
                                                        Alert {body.umi.public_alert_level}
                                                    </Box>
                                                </Box>
                                                <Box style={{display: 'inline-flex'}}>
                                                    <Box fontSize={15}>
                                                        Start of event:
                                                    </Box>
                                                    <Box fontSize={15} fontWeight={"bold"} style={{marginLeft: 5}}>
                                                        {moment(body.umi.event_start).format("MMMM D, YYYY HH:mm:SS")}
                                                    </Box>
                                                </Box>
                                                <Box style={{display: 'inline-flex'}}>
                                                    <Box fontSize={15}>
                                                        Latest trigger:
                                                    </Box>
                                                    <Box fontSize={15} fontWeight={"bold"} style={{marginLeft: 5}}>
                                                        {moment(body.umi.latest_event_triggers[0].timestamp).format("MMMM D, YYYY HH:mm:SS")}
                                                    </Box>
                                                </Box>
                                                <Box style={{display: 'inline-flex'}}>
                                                    <Box fontSize={15}>
                                                        Validity:
                                                    </Box>
                                                    <Box fontSize={15} fontWeight={"bold"} style={{marginLeft: 5}}>
                                                        {body.umi.validity}
                                                    </Box>
                                                </Box>
                                                <Box style={{display: 'inline-flex'}}>
                                                    <Box fontSize={15}>
                                                        Details:
                                                    </Box>
                                                    <Box fontSize={15} fontWeight={"bold"} style={{marginLeft: 5}}>
                                                        {body.umi.latest_event_triggers[0].info}
                                                    </Box>
                                                </Box>
                                            </Grid>
                                        ) : (
                                            <Grid item xs={12} style={{paddingTop: 20, paddingBottom: 20}}>
                                                <Box style={{display: 'inline-flex'}}>
                                                    <Box fontSize={15} fontWeight={"bold"} style={{marginLeft: 5}}>
                                                        No alert on site
                                                    </Box>
                                                </Box>
                                            </Grid>
                                        )
                                    }
                            </Grid>
                            <Grid container>
                                <Grid item xs={6}>
                                    <Fab variant="extended"
                                        color={"primary"}
                                        className={classes.buttons}
                                        aria-label="add">
                                        Download
                                    </Fab>
                                </Grid>
                                <Grid item xs={6}>
                                    <Fab variant="extended"
                                        color={"primary"}
                                        className={classes.buttons}
                                        aria-label="add">
                                        Print
                                    </Fab>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={2} />
                    </Grid>
                </Container>
            </Fragment>
        );

    
}

export default AlertStatus
