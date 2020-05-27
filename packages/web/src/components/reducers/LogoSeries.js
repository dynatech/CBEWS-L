import React, { Fragment } from "react";
import { Container, Grid, CardMedia } from "@material-ui/core";
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
    console.log("siteCode", siteCode);

    let site_preference;
    switch (siteCode) {
        case "umi":
            site_preference = (
                <Grid item xs={4} md={2}>
                    <img className={classes.xs_image} src={umi_seal} />
                </Grid>
            );
            break;
        case "mar":
            site_preference = (
                <Grid item xs={4} md={2}>
                    <img className={classes.xs_image} src={mar_seal} />
                </Grid>
            );
            break;
        default:
            site_preference = (
                <Fragment>
                    <Grid item xs={4} md={2}>
                        <img className={classes.xs_image} src={mar_seal} />
                    </Grid>
                    <Grid item xs={4} md={2}>
                        <img className={classes.xs_image} src={leon_seal} />
                    </Grid>
                    <Grid item xs={4} md={2}>
                        <img className={classes.xs_image} src={umi_seal} />
                    </Grid>
                </Fragment>
            );
    }
    return (
        <Container className={classes.logo_container}>
            <Grid container spacing={0} alignItems="center" justify="center">
                <Grid item xs={4} md={2}>
                    <img className={classes.xs_image} src={dost_seal} />
                </Grid>
                <Grid item xs={4} md={2}>
                    <CardMedia />
                    <img className={classes.xs_image} src={dynaslope_seal} />
                </Grid>
                <Grid item xs={4} md={2}>
                    <img className={classes.xs_image} src={mar_seal} />
                </Grid>
                <Grid item xs={4} md={2}>
                    <img className={classes.xs_image} src={leon_seal} />
                </Grid>
                <Grid item xs={4} md={2}>
                    <img className={classes.xs_image} src={umi_seal} />
                </Grid>
            </Grid>
        </Container>
    );
}

export { LogoSeries };
