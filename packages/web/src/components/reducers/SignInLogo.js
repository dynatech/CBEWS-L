import React, { Fragment } from "react";
import { Container, Grid, CardMedia, Typography } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";

import dost_seal from "../../assets/dost_seal.png";
import dynaslope_seal from "../../assets/dynaslope_seal.png";
import leon_seal from "../../assets/leon_seal.png";
import mar_seal from "../../assets/mar_seal.png";
import umi_seal from "../../assets/umi_seal.png";

const useStyles = makeStyles((theme) => ({
    md_image: {
        length: "110px",
        width: "110px",
    },
}));

function SignInLogo(props) {
    const classes = useStyles();

    return (
        <Container>
            <Grid
                container
                spacing={1}
                alignItems="center"
                justify="space-evenly"
                style={{ paddingBottom: "5%", paddingRight: "10%" }}
            >
                <Grid item xs={1} md={1}>
                    <img className={classes.md_image} src={dost_seal} />
                </Grid>
                <Grid item xs={1} md={1}>
                    <img className={classes.md_image} src={dynaslope_seal} />
                </Grid>
                <Grid item xs={1} md={1}>
                    <img className={classes.md_image} src={mar_seal} />
                </Grid>
                <Grid item xs={1} md={1}>
                    <img className={classes.md_image} src={leon_seal} />
                </Grid>
                <Grid item xs={1} md={1}>
                    <img className={classes.md_image} src={umi_seal} />
                </Grid>
            </Grid>
        </Container>
    );
}

export { SignInLogo };
