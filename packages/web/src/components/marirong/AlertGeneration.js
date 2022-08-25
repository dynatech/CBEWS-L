import React, { useState, Fragment } from 'react';
import { Container, Grid, Fab } from '@material-ui/core';
import { AlertValidation, LatestCurrentAlert } from './AlertGenerationFeature';
import { useStyles } from '../../styles/general_styles';

export default function AlertGeneration () {

    // const [feature, setFeature] = useState(<LatestCurrentAlert />);
    const [feature, setFeature] = useState();
    const [av, avActive] = useState("");
    const [lca, lcaActive] = useState("primary");

    function handleFeatureNav(feature) {
        let return_feat = []
        switch (feature) {
            case "latest_current_alert":
                lcaActive("primary");
                avActive("");
                // return_feat = <LatestCurrentAlert />
                break;
            case "alert_validation":
                lcaActive("");
                avActive("primary");
                // return_feat = <AlertValidation />
                break;
            default:
                lcaActive("primary")
                avActive("");
                // return_feat = <LatestCurrentAlert />
                break;
        }
        setFeature(return_feat)
    }

    const classes = useStyles();
    return (
        <Fragment>
            <Container maxWidth="xl" className={classes.root} spacing={24} style={{paddingTop: '5%'}}>
                <Grid container alignItems="flex-start" justify="center">
                    <Grid item xs={3} >
                        <Grid container direction="column" className={classes.menuContainer}>
                            <Grid item={true} xs={12} style={{ marginTop: '25%' }}>
                                <Fab variant="extended"
                                    color={lca}
                                    aria-label="add"
                                    className={classes.menu}
                                    onClick={() => { 
                                        handleFeatureNav("latest_current_alert") 
                                    }}>
                                    Latest Current Alert
                                </Fab>
                            </Grid>
                            {/* <Grid item={true} xs={3} style={{ marginTop: '30%' }} /> */}
                            <Grid item={true} xs={12} style={{ marginTop: '25%' }}>
                                <Fab variant="extended"
                                    color={av}
                                    aria-label="add"
                                    className={classes.menu}
                                    onClick={() => { 
                                        handleFeatureNav("alert_validation") 
                                    }}>
                                    Alert Validation
                                </Fab>
                            </Grid>
                            {/* <Grid item={true} xs={3} style={{ marginTop: '30%' }} /> */}
                        </Grid>
                    </Grid>
                    <Grid item xs={9} >
                    <div style={{overflow: 'auto', height: 660}}>
                        {feature}
                    </div>
                    </Grid>
                </Grid>
            </Container>
        </Fragment>
    )
}
