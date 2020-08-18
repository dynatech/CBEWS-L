import React from 'react';
import { Container, Grid, Typography } from '@material-ui/core';
import UmiHeader from './UmiHeader';
import UmiBody from './UmiBody';
import UmiFooter from './UmiFooter';

export default function UmiDashboard (props) {
    return (
        <Grid container>
            <UmiHeader {...props} />
            <UmiBody />
            <UmiFooter />
        </Grid>
    )
}