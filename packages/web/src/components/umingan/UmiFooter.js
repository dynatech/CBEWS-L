import React from 'react';
import {
    AppBar, Container, Grid, Typography,
} from '@material-ui/core';
import {useStyles } from '../../styles/general_styles';

export default function MarFooter () {
    const classes = useStyles();
    console.log("This is the footer");

    return (
        <div className={classes.footer}>
            <Typography variant="h6" align="center">Email: pdrrmo@gmail.com</Typography>
            <Typography variant="h6" align="center">Hotline: 09123456789</Typography>
        </div>
    )
}