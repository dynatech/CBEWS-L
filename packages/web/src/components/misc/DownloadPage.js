import React from 'react';
import { Box, Grid, Typography, Fab } from '@material-ui/core';
import phone_download from "../../assets/phone_download.png";
import phiv_dyna from "../../assets/phiv_dyna.png";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import {ThemeProvider}  from "@material-ui/core/styles";

const theme = createMuiTheme();

theme.typography.h3 = {
    fontSize: '2.3rem',
    '@media (min-width:600px)': {
        fontSize: '2.3rem',
    },
    [theme.breakpoints.up('md')]: {
        fontSize: '3.4rem',
    },
};

theme.typography.h6 = {
    fontSize: '1rem',
    '@media (min-width:600px)': {
        fontSize: '1rem',
    },
    [theme.breakpoints.up('md')]: {
        fontSize: '1.4rem',
    },
};

const useStyles = makeStyles((theme) => ({
    xs_image: {
        width: '30%',
        minWidth: '170px'
    },
    xxs_image: {
        // height: '150px',
        width: '15%',
        minWidth: '200px'
    },
    button_fluid: {
        width: '100%',
        padding: 10,
        backgroundColor: '#f8981d',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '20px'
    },
}));

export default function DownloadPage (props) {
    const classes = useStyles();

    const downloadApk = () => {

    }

    return (
        <ThemeProvider theme={theme}>
            <Grid container spacing={2}>
                <Grid item xs={12} style={{backgroundColor: '#f9d9b2', padding: 20, width: '100%'}} />
                <Grid item xs={12}>
                    <Grid container spacing={2} style={{padding: '5%', textAlign: 'center'}}>
                        <Grid item md={1} xs={0}/>
                        <Grid item md={10} xs={12}>
                            <Typography variant="h3" style={{color: '#182945'}}>Monitor Landslide Risk in your Community</Typography>
                        </Grid>
                        <Grid item md={1} xs={0}/>
                        <Grid item md={3} xs={0}/>
                        <Grid item md={6} xs={12}>
                            <Typography variant="h6" style={{fontWeight: 'normal', color: '#182945'}}>With this app, Community-based enabled Dynaslope Project sites can explore and operate Early Warning System for Landslide</Typography>
                        </Grid>
                        <Grid item md={3} xs={0}/>
                        <Grid item md={4} xs={3}/>
                        <Grid item md={4} xs={6}>
                            <img className={classes.xs_image} src={phone_download} />
                        </Grid>
                        <Grid item md={4} xs={3}/>
                        <Grid item md={5} xs={0}/>
                        <Grid item md={2} xs={6} style={{paddingTop: 20}}>
                            <Fab variant="extended"
                                aria-label="download"
                                className={classes.button_fluid}
                                onClick={() => {downloadApk()}}>
                                Download
                            </Fab>
                        </Grid>
                        <Grid item md={5} xs={3}/>
                    </Grid>
                </Grid>
                <Grid item xs={12} style={{padding: 20, width: '100%', backgroundColor: '#f9d9b2'}} />
                <Grid item xs={12} style={{bottom: 0,paddingTop: '2%', paddingBottom: '2%', width: '100%', backgroundColor: '#16526e', textAlign: 'center'}}>
                    <Typography variant="h6" style={{color: 'white', paddingBottom: '1%', fontWeight: 'normal'}}>To know more about Early Warning System for Landslide in the Philippines, follow and contact us in Facebook at <Box fontWeight='bold' display='inline'>/DynaslopeCommunity</Box></Typography>
                    <img className={classes.xxs_image} src={phiv_dyna} />
                </Grid>
            </Grid>
        </ThemeProvider>
    )
}