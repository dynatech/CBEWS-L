import React from 'react';
import {
    AppBar, Container, Grid, Typography,
} from '@material-ui/core';
import {useStyles } from '../../styles/general_styles';

export default function MarFooter () {
    const classes = useStyles();
    console.log("This is the footer");

    return (
        <AppBar className={classes.footer} color="inherit" position="fixed">
            <Container className={classes.footerContainer}>
                <Grid container spacing={0} justify="center">
                    <Grid item xs={12}>
                        <Typography variant="h6" align="center">Email: pdrrmo@gmail.com</Typography>
                        <Typography variant="h6" align="center">Hotline: 09123456789</Typography>
                    </Grid>
                </Grid>
            </Container>
        </AppBar>
    )
}