import React, { useState, Fragment } from 'react';
import { Container, Paper, Grid, CardMedia, Box, makeStyles, Fab } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
    buttons: {
        width: '90%'
    }
}));

function AlertStatus(props) {
        const classes = useStyles();
        const [body, setBody] = useState([]);
        const [menuUmiSize, setMenuUmiSize] = useState({height: window.innerHeight * 0.2, width: window.innerHeight * 0.2});
        const [menuMarSize, setMenuMarSize] = useState({height: window.innerHeight * 0.2, width: window.innerHeight * 0.2});
    
    
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
                                <Grid item xs={12} style={{paddingTop: 20, paddingBottom: 20}}>
                                   <Box style={{display: 'inline-flex'}}>
                                        <Box fontSize={20} style={{paddingTop: 10, paddingBottom: 10}}>
                                            Current Alert:
                                        </Box>
                                        <Box fontSize={20} color="#f5981c" fontWeight={"bold"} style={{paddingTop: 10, paddingBottom: 10, marginLeft: 5}}>
                                            Alert 1
                                        </Box>
                                   </Box>
                                   <Box style={{display: 'inline-flex'}}>
                                        <Box fontSize={15}>
                                            Start of event:
                                        </Box>
                                        <Box fontSize={15} fontWeight={"bold"} style={{marginLeft: 5}}>
                                            October 1, 2019 04:00:00
                                        </Box>
                                   </Box>
                                   <Box style={{display: 'inline-flex'}}>
                                        <Box fontSize={15}>
                                            Latest trigger:
                                        </Box>
                                        <Box fontSize={15} fontWeight={"bold"} style={{marginLeft: 5}}>
                                            October 1, 2019 08:00:00
                                        </Box>
                                   </Box>
                                   <Box style={{display: 'inline-flex'}}>
                                        <Box fontSize={15}>
                                            Validity:
                                        </Box>
                                        <Box fontSize={15} fontWeight={"bold"} style={{marginLeft: 5}}>
                                            October 2, 2019 08:00:00
                                        </Box>
                                   </Box>
                                   <Box style={{display: 'inline-flex'}}>
                                        <Box fontSize={15}>
                                            Details:
                                        </Box>
                                        <Box fontSize={15} fontWeight={"bold"} style={{marginLeft: 5}}>
                                            RAIN_UMIG 1-day cumulative is above threshold level with a value of 120.00mm
                                        </Box>
                                   </Box>
                                </Grid>
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
                                <Grid item xs={12} style={{paddingTop: 20, paddingBottom: 20}}>
                                   <Box style={{display: 'inline-flex'}}>
                                        <Box fontSize={20} style={{paddingTop: 10, paddingBottom: 10}}>
                                            Current Alert:
                                        </Box>
                                        <Box fontSize={20} color="#7ebf7f" fontWeight={"bold"} style={{paddingTop: 10, paddingBottom: 10, marginLeft: 5}}>
                                            Alert 0
                                        </Box>
                                   </Box>
                                </Grid>
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
