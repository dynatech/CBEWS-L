import React, { useState, Fragment } from 'react';
import { Container, Grid, Fab } from '@material-ui/core';
import RainfallPlot from '../charts/RainfallPlot';
import SubsurfacePlots from '../charts/SubsurfacePlots';
import MoMs from './GroundData/MOMS';
import EarthquakeData from './SensorData/EarthquakeData';
import { useStyles } from '../../styles/general_styles';

export default function SensorData(props) {
    // const { classes } = props;
    const classes = useStyles();

    const [feature, setFeature] = useState([<RainfallPlot feature="instantanous" />]);
    const [rp, rpActive] = useState("primary");
    const [sfp, sfpActive] = useState("");
    const [sbp, sbpActive] = useState("");

    function handleFeatureNav(feature) {
        let return_feat = []
        switch (feature) {
            case "rainfall":
                rpActive("primary");
                sfpActive("");
                sbpActive("");
                return_feat = [<RainfallPlot feature="instantanous" />];
                break;
            case "subsurface":
                sfpActive("primary");
                rpActive("");
                sbpActive("");
                return_feat = [<SubsurfacePlots feature="data_analysis" />];
                break;
            case "eq_data":
                sfpActive("");
                rpActive("");
                sbpActive("primary");
                return_feat = [<EarthquakeData />];
                break;
            default:
                rpActive("primary")
                sfpActive("");
                sbpActive("");
                return_feat = [<RainfallPlot feature="instantanous" />];
                break;
        }
        setFeature(return_feat);
    }

    return (
        <Fragment>
            <Container maxWidth="xl" className={classes.root} spacing={24} style={{paddingTop: '5%'}}>
                <Grid container alignItems="flex-start" justify="center">
                    <Grid item xs={3}>
                        <Grid container direction="column" className={classes.menuContainer}>
                            <Grid item={true} xs={3} style={{ marginTop: '15%' }} />
                            <Grid item={true} xs={12} style={{ marginTop: '20%' }}>
                                <Fab variant="extended"
                                    color={rp}
                                    aria-label="add"
                                    className={classes.menu}
                                    onClick={()=>{handleFeatureNav("rainfall")}}>
                                    RAINFALL DATA PRESENCE
                                </Fab>
                            </Grid>
                            <Grid item={true} xs={12} style={{ marginTop: '20%' }}>
                                <Fab variant="extended"
                                    color={sfp}
                                    aria-label="add"
                                    className={classes.menu}
                                    onClick={()=>{handleFeatureNav("subsurface")}}>
                                    SUBSURFACE NODES DATA
                                </Fab>
                            </Grid>
                            <Grid item={true} xs={12} style={{ marginTop: '20%' }}>
                                <Fab variant="extended"
                                    color={sbp}
                                    aria-label="add"
                                    className={classes.menu}
                                    onClick={()=>{handleFeatureNav("eq_data")}}>
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
