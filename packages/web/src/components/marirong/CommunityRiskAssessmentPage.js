import React, { useState, Fragment } from 'react';
import { Container, Grid, Fab } from '@material-ui/core';
import { useStyles, tableStyles } from '../../styles/general_styles';
import HazardMapping from './CommunityRiskAssessment/HazardMaps';
import CommunityRiskAssessment from './CommunityRiskAssessment/CommunityRiskAssessment';
import CapacityAndVulnerability from './CommunityRiskAssessment/CapacityAndVulnerability';


export default function CommunityRiskAssessmentPage () {
    const classes = useStyles();

    const [feature, setFeature] = useState([<HazardMapping />]);
    const [hm, hmActive] = useState("primary");
    const [cra, crapActive] = useState("");
    const [cav, cavActive] = useState("");

    function handleFeatureNav(feature) {
        let return_feat = []
        switch (feature) {
            case "hazard_map":
                hmActive("primary");
                crapActive("");
                cavActive("");
                return_feat = [<HazardMapping />];
                break;
            case "c_r_a":
                hmActive("");
                crapActive("primary");
                cavActive("");
                return_feat = [<CommunityRiskAssessment />];
                break;
            case "c_a_v":
                hmActive("");
                crapActive("");
                cavActive("primary");
                return_feat = [<CapacityAndVulnerability />];
                break;
            default:
                hmActive("primary")
                crapActive("");
                cavActive("");
                return_feat = [<HazardMapping />];
                break;
        }
        setFeature(return_feat)
    }


    return (
        <Grid container spacing={0} style={{ margin: "1%", marginLeft: "5%"}} >
            <Grid item xs={2}>
                <Grid container direction="column" className={classes.menuContainer} spacing={0}>
                    <Grid item={true} xs={3} style={{ marginTop: '15%' }} />
                    <Grid item={true} xs={12} style={{ marginTop: '20%' }}>
                        <Fab variant="extended"
                            color={hm}
                            aria-label="add"
                            className={classes.menu}
                            onClick={() => { handleFeatureNav("hazard_map") }}>
                            Hazard Mapping
                        </Fab>
                    </Grid>
                    <Grid item={true} xs={12} style={{ marginTop: '20%' }}>
                        <Fab variant="extended"
                            color={cav}
                            aria-label="add"
                            className={classes.menu}
                            onClick={() => { handleFeatureNav("c_a_v") }}>
                            Capacity and Vulnerability
                        </Fab>
                    </Grid>
                    <Grid item={true} xs={12} style={{ marginTop: '20%' }}>
                        <Fab variant="extended"
                            color={cra}
                            aria-label="add"
                            className={classes.menu}
                            onClick={() => { handleFeatureNav("c_r_a") }}>
                            Community risk assessment
                        </Fab>
                    </Grid>
                    <Grid item={true} xs={3} style={{ marginTop: '15%' }} />
                </Grid>
            </Grid>
            <Grid item xs={10} >
                <div style={{ height: 'auto', paddingTop: 20 }}>
                    {feature}
                </div>
            </Grid>
        </Grid>
    )
}
