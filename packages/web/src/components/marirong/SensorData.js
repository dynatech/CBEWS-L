import React, { useState, Fragment } from 'react';
import { Container, Grid, Fab } from '@material-ui/core';
import SurficialMarkers from './GroundData/SurficialMarkers';
import MoMs from './GroundData/MOMS';
import EarthquakeData from './SensorData/EarthquakeData';
import { useStyles } from '../../styles/general_styles';

export default function SensorData(props) {
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
                return_feat = [<EarthquakeData />];
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
                <Grid container alignItems="center" justify="center">
                    <Grid item xs={3}>
                        <Grid container direction="column" className={classes.menuContainer}>
                            <Grid item={true} xs={3} style={{ marginTop: '15%' }} />
                            <Grid item={true} xs={12} style={{ marginTop: '20%' }}>
                                <Fab variant="extended"
                                    color={rp}
                                    aria-label="add"
                                    className={classes.menu}
                                    onClick={()=>{handleFeatureNav("surficial_marker")}}>
                                    RAINFALL DATA PRESENCE
                                </Fab>
                            </Grid>
                            <Grid item={true} xs={12} style={{ marginTop: '20%' }}>
                                <Fab variant="extended"
                                    color={sfp}
                                    aria-label="add"
                                    className={classes.menu}
                                    onClick={()=>{handleFeatureNav("moms")}}>
                                    SUBSURFACE NODES DATA
                                </Fab>
                            </Grid>
                            <Grid item={true} xs={12} style={{ marginTop: '20%' }}>
                                <Fab variant="extended"
                                    color={sbp}
                                    aria-label="add"
                                    className={classes.menu}
                                    onClick={()=>{handleFeatureNav("od_monitoring")}}>
                                    EARTHQUAKE DATA
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
