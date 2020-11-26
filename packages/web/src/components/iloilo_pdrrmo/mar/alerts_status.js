import React, { Fragment, useState } from 'react';
import { Container, Grid, Paper, Box, Fab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    buttons: {
        width: '90%'
    }
}));

function AlertStatus() {
    const classes = useStyles();
    return (
        <Fragment>
            <Container align="center">
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Paper>
                            <Box fontSize={30} align="left" fontWeight="bold" style={{ padding: 20 }}>
                                Current Alert Status
                            </Box>
                            <Box fontSize={50} color="#7ebf7f" fontWeight="bold" style={{ padding: 20 }}>
                                Alert 0
                            </Box>
                            <Box style={{ padding: 15 }}>
                                <Box style={{ display: 'inline-flex' }}>
                                    <Box fontSize={25} fontWeight={"bold"} style={{ marginLeft: 5 }}>
                                        Ground data: No observable ground movements
                                    </Box>
                                </Box>
                            </Box>
                            <Box style={{ padding: 15 }}>
                                <Box style={{ display: 'inline-flex' }}>
                                    <Box fontSize={25} fontWeight={"bold"} style={{ marginLeft: 5 }}>
                                        Rainfall Data: 1-day and 3-day cumulative are below threshold level
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
                                        onClick={()=>{ }}>
                                        Download
                                    </Fab>
                                </Grid>
                                <Grid item xs={2}>
                                    <Fab variant="extended"
                                        color={"primary"}
                                        className={classes.buttons}
                                        aria-label="add"
                                        onClick={()=>{ }}>
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
        </Fragment>
    )
}

export default AlertStatus