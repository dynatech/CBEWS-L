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
            <Typography variant="h6" align="center">Email: pdrrmo@gmail.com</Typography>
            <Typography variant="h6" align="center">Hotline: 09123456789</Typography>
        </BottomNavigation>
    )
}