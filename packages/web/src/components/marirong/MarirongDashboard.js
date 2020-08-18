import React from 'react';
import { Container, Grid, Typography } from '@material-ui/core';
import MarHeader from './MarHeader';
import MarBody from './MarBody';
import MarFooter from './MarFooter';

export default function MarDashboard (props) {
    return (
        <Grid container>
            <MarHeader {...props} />
            <MarBody />
            <MarFooter />
        </Grid>
    )
}