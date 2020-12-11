import React, { useState, Fragment } from 'react';
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

        const init = () => {
            const response = AlertGeneration.GetOngoingAndExtendedMonitoring();
            const { data, status } = response;
            if (status) {
                let key = "";
                const { latest, overdue, extended } = data;
                const alert_list = [ ...latest, ...overdue, ...extended ];
    
                const umi_site_data = alert_list.find(site_data => site_data.site_id === 50);
                const mar_site_data = alert_list.find(site_data => site_data.site_id === 29);
                setBody({
                    umi: umi_site_data,
                    mar: mar_site_data
                });
            } else {
                console.error("There is something wrong with the code in latest current alert");
            }
        }
    
    
        return (
            <Fragment>
                <Container style={{ marginTop: '5%' }}>
                    <Grid container align="center" spacing={2}>
                        <Grid item xs={3}/>
                        <Grid item xs={3}>
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
                                                    {moment(body.umi.event_start, "MMMM D, YYYY HH:mm:SS")}
                                                </Box>
                                            </Box>
                                            <Box style={{display: 'inline-flex'}}>
                                                <Box fontSize={15}>
                                                    Latest trigger:
                                                </Box>
                                                <Box fontSize={15} fontWeight={"bold"} style={{marginLeft: 5}}>
                                                    {moment(body.umi.latest_event_triggers[0].timestamp, "MMMM D, YYYY HH:mm:SS")}
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
                        <Grid item xs={3}>
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
                                                        {moment(body.umi.event_start, "MMMM D, YYYY HH:mm:SS")}
                                                    </Box>
                                                </Box>
                                                <Box style={{display: 'inline-flex'}}>
                                                    <Box fontSize={15}>
                                                        Latest trigger:
                                                    </Box>
                                                    <Box fontSize={15} fontWeight={"bold"} style={{marginLeft: 5}}>
                                                        {moment(body.umi.latest_event_triggers[0].timestamp, "MMMM D, YYYY HH:mm:SS")}
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
                        <Grid item xs={3} />
                    </Grid>
                </Container>
            </Fragment>
        );

    
}

export default AlertStatus
