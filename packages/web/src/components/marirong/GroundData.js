import React, { useState, Fragment } from 'react';
import { Container, Grid, Fab } from '@material-ui/core';
import SurficialMarkers from './GroundData/SurficialMarkers';
import MoMs from './GroundData/MOMS';
import OnDemand from './GroundData/OnDemand';
import { useStyles } from '../../styles/general_styles';

export default function GroundData(props) {
    // const { classes } = props;
    const classes = useStyles();

    const [feature, setFeature] = useState([<SurficialMarkers />]);
    const [rp, rpActive] = useState("primary");
    const [sfp, sfpActive] = useState("");
    const [sbp, sbpActive] = useState("");

    function handleFeatureNav(feature) {
        let return_feat = []
        switch (feature) {
            case "surficial_marker":
                rpActive("primary");
                sfpActive("");
                sbpActive("");
                return_feat = [<SurficialMarkers />];
                break;
            case "moms":
                sfpActive("primary");
                rpActive("");
                sbpActive("");
                return_feat = [<MoMs />];
                break;
            case "od_monitoring":
                sfpActive("");
                rpActive("");
                sbpActive("primary");
                return_feat = [<OnDemand />];
                break;
            default:
                rpActive("primary")
                sfpActive("");
                sbpActive("");
                return_feat = [<SurficialMarkers />];
                break;
        }
        setFeature(return_feat);
    }

    return (
        <Fragment>
            <Container maxWidth="xl" className={classes.root} spacing={24}>
                <Grid container alignItems="flex-start" justify="center">
                    <Grid item xs={3}>
                        <Grid container direction="column" className={classes.menuContainer}>
                            <Grid item={true} xs={3} style={{ marginTop: '15%' }} />
                            <Grid item={true} xs={12} style={{ marginTop: '20%' }}>
                                <Fab variant="extended"
                                    color={rp}
                                    aria-label="add"
                                    className={classes.menu}
                                    onClick={()=>{handleFeatureNav("surficial_marker")}}>
                                    SURFICIAL MARKERS
                                </Fab>
                            </Grid>
                            <Grid item={true} xs={12} style={{ marginTop: '20%' }}>
                                <Fab variant="extended"
                                    color={sfp}
                                    aria-label="add"
                                    className={classes.menu}
                                    onClick={()=>{handleFeatureNav("moms")}}>
                                    MANIFESTATION OF MOVEMENTS
                                </Fab>
                            </Grid>
                            <Grid item={true} xs={12} style={{ marginTop: '20%' }}>
                                <Fab variant="extended"
                                    color={sbp}
                                    aria-label="add"
                                    className={classes.menu}
                                    onClick={()=>{handleFeatureNav("od_monitoring")}}>
                                    ON-DEMAND MONITORING
                                </Fab>
                            </Grid>
                            <Grid item={true} xs={3} style={{ marginTop: '15%' }} />
                        </Grid> 
                    </Grid>
                    <Grid item xs={9} >
                        <div style={{overflow: 'auto', height: 650}}>
                            {feature}
                        </div>
                    </Grid>
                </Grid>
            </Container>
        </Fragment>
    )
}
