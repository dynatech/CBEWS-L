import React, { Fragment } from 'react';
import '../../styles/css/App.css';
import {
    AppBar, Container, Grid, Typography, Paper
} from '@material-ui/core';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import { useStyles } from '../../styles/general_styles';

export default function MarFooter () {
    const classes = useStyles();
    console.log("This is the footer");

    return (
        <BottomNavigation className={classes.footer}>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Typography variant="h6" align="center">Email: pdrrmo@gmail.com</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6" align="center">Hotline: 09123456789</Typography>
                </Grid>
            </Grid>
        </BottomNavigation>
    )
}