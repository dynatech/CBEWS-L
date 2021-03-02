import React, { Fragment } from "react";
import { Container, Grid, CardMedia, Typography } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";

import dost_seal from "../../assets/dost_seal.png";
import dynaslope_seal from "../../assets/dynaslope_seal.png";
import leon_seal from "../../assets/leon_seal.png";
import mar_seal from "../../assets/mar_seal.png";
import umi_seal from "../../assets/umi_seal.png";

const useStyles = makeStyles((theme) => ({
    xs_image: {
        length: '80px',
        width: '80px',
    },
}));

function LogoSeries(props) {
    const { siteCode } = props;
    const classes = useStyles();

    let site_preference;
    switch (siteCode) {
        case "umi":
            site_preference = (
                <Grid item xs={2} md={2}>
                    <img className={classes.xs_image} src={umi_seal} />
                </Grid>
            );
            break;
        case "mar":
            site_preference = (
                <Grid item xs={2} md={2}>
                    <img className={classes.xs_image} src={mar_seal} />
                </Grid>
            );
            break;
        default:
            site_preference = (
                <Fragment>
                    
                        <Grid item xs={1} md={1}>
                            <img className={classes.xs_image} src={mar_seal} />
                        </Grid>
                        <Grid item xs={1} md={1}>
                            <img className={classes.xs_image} src={leon_seal} />
                        </Grid>
                        <Grid item xs={1} md={1}>
                            <img className={classes.xs_image} src={umi_seal} />
                        </Grid>
                    
                </Fragment>
            );
    }
    return (
        <Container className={classes.logo_container}>
            <Grid container spacing={1} alignItems="center" justify="space-evenly">
                <Grid item xs={1} md={1}>
                    <img className={classes.xs_image} src={dost_seal} />
                </Grid>
                <Grid item xs={1} md={1}>
                    <CardMedia />
                    <img className={classes.xs_image} src={dynaslope_seal} />
                </Grid>
                {site_preference}
                <Grid item xs={8}>
                    <Typography variant="h4" style={{color: 'white'}}>Community Based Early Warning System for Landslides</Typography>
                </Grid>
            </Grid>
        </Container>
    );
}

export { LogoSeries };
