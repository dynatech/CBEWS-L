import React, { Component, useState, Fragment } from 'react';
import {
    Container, Grid, Paper, Box, CardMedia, Fab, Table,
    TableBody, TableCell, TableHead,
    TableRow, Tabs, Tab, Button, makeStyles
} from '@material-ui/core';

import UmiCRA from '../umi/cra';
import MarCRA from '../mar/cra'

const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1),
    },
    input: {
        display: 'none',
    },
}));




function CRA() {
    const classes = useStyles();
    const [siteSelected, setSiteSelected] = useState(<Grid container align="center" style={{ padding: 10 }}>
        <Grid item xs={4} />
        <Grid item xs={2}>
            <Button variant="outlined" color="primary" className={useStyles.button}>
                Umingan
    </Button>
        </Grid>
        <Grid item xs={2}>
            <Button variant="outlined" className={useStyles.button} onClick={() => { handleSite("mar") }}>
                Marirong
    </Button>
        </Grid>
        <Grid item xs={4} />
    </Grid>);

    const [siteBody, setSiteBody] = useState(<UmiCRA/>);

    function handleSite(site) {
        let ret_val = [];
        let ret_body = [];
        if (site === "mar") {
            ret_val.push(

                <Grid container align="center" style={{ padding: 10 }}>
                    <Grid item xs={4} />
                    <Grid item xs={2}>
                        <Button variant="outlined"  className={useStyles.button} onClick={() => { handleSite("umi") }}>
                            Umingan
                </Button>
                    </Grid>
                    <Grid item xs={2}>
                        <Button variant="outlined" color="primary"className={useStyles.button} >
                            Marirong
                </Button>
                    </Grid>
                    <Grid item xs={4} />
                </Grid>
            )
            ret_body.push(<MarCRA/>);
        } else {
            ret_val.push(
            <Grid container align="center" style={{ padding: 10 }}>
                <Grid item xs={4} />
                <Grid item xs={2}>
                    <Button variant="outlined" color="primary" className={useStyles.button}>
                        Umingan
            </Button>
                </Grid>
                <Grid item xs={2}>
                    <Button variant="outlined" className={useStyles.button} onClick={() => { handleSite("mar") }}>
                        Marirong
            </Button>
                </Grid>
                <Grid item xs={4} />
            </Grid>
            )
            ret_body.push(<UmiCRA/>);
        }
        setSiteSelected(ret_val);
        setSiteBody(ret_body);
    }

    return (
        <Fragment>
            <Container>
                {siteSelected}
            </Container>
            {siteBody}
        </Fragment>
    )
}

export default CRA