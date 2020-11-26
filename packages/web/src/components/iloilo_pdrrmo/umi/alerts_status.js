import React, { Fragment, useState } from 'react';
import { Container, Grid, Paper, Box, Fab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TransitionalModal from '../../reducers/pdrrmo_iloilo/loading';

const useStyles = makeStyles(theme => ({
    buttons: {
        width: '90%'
    }
}));

function AlertStatus() {
    const classes = useStyles();

    const [modal, setModal] = useState([<TransitionalModal status={false} />])

    function download() {
        setModal([<TransitionalModal status={true} />])
        setTimeout(() => {
            setModal([<TransitionalModal status={false} />])
            alert("Download success!")
        }, 3000)
    }

    function print() {
        setModal([<TransitionalModal status={true} />])
        setTimeout(() => {
            setModal([<TransitionalModal status={false} />])
            alert("Print success!")
        }, 3000)
    }

    return (
        <Fragment>
            <Container align="center">
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Paper>
                            <Box fontSize={30} align="left" fontWeight="bold" style={{ padding: 20 }}>
                                Current Alert Status
                            </Box>
                            <Box fontSize={50} color="#f5981c" fontWeight="bold" style={{ padding: 20 }}>
                                Alert 1
                            </Box>
                            <Box style={{ padding: 15 }}>
                                <Box style={{ display: 'inline-flex' }}>
                                    <Box fontSize={25}>
                                        Start of event:
                                            </Box>
                                    <Box fontSize={25} fontWeight={"bold"} style={{ marginLeft: 5 }}>
                                        October 1, 2019 04:00:00
                                    </Box>
                                </Box>
                            </Box>
                            <Box style={{ padding: 15 }}>
                                <Box style={{ display: 'inline-flex' }}>
                                    <Box fontSize={25}>
                                        Latest trigger:
                                    </Box>
                                    <Box fontSize={25} fontWeight={"bold"} style={{ marginLeft: 5 }}>
                                        October 1, 2019 08:00:00
                                    </Box>
                                </Box>
                            </Box>
                            <Box style={{ padding: 15 }}>
                                <Box style={{ display: 'inline-flex' }}>
                                    <Box fontSize={25}>
                                        Validity:
                                        </Box>
                                    <Box fontSize={25} fontWeight={"bold"} style={{ marginLeft: 5 }}>
                                        October 2, 2019 08:00:00
                                        </Box>
                                </Box>
                            </Box>
                            <Box style={{ padding: 15 }}>
                                <Box style={{ display: 'inline-flex' }} maxWidth="70%" >
                                    <Box fontSize={25}>
                                        Details:
                                        </Box>
                                    <Box fontSize={25} fontWeight={"bold"} style={{ marginLeft: 3 }}>
                                        RAIN_UMIG 1-day cumulative is above threshold level with a value of 120.00mm
                                    </Box>
                                </Box>
                            </Box>
                            <Grid container style={{ padding: 20 }}>
                                <Grid item xs={4} />
                                <Grid item xs={2}>
                                    <Fab variant="extended"
                                        color={"primary"}
                                        className={classes.buttons}
                                        aria-label="add"
                                        onClick={()=>{download()}}>
                                        Download
                                    </Fab>
                                </Grid>
                                <Grid item xs={2}>
                                    <Fab variant="extended"
                                        color={"primary"}
                                        className={classes.buttons}
                                        aria-label="add"
                                        onClick={()=>{print()}}>
                                        Print
                                    </Fab>
                                </Grid>
                                <Grid item xs={4} />
                            </Grid>
                            <Box borderTop={2} borderRadius="50%" borderColor="#17526d" />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
            {modal}
        </Fragment>
    )
}

export default AlertStatus