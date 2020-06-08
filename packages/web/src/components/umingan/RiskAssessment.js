import React, { useState, Fragment } from 'react';
import MUIDataTable from "mui-datatables";
import { Container, Grid, Fab, Button, ButtonGroup, Paper, Typography, Link } from '@material-ui/core';
import { useStyles, tableStyles } from '../../styles/general_styles';
// import HazardMapping from './hazard_mapping';
// import CommunityRiskAssessment from './cra';
import CapacityAndVulnerability from './cav';



export default function RiskAssessment () {
    const classes = useStyles();

    // const [feature, setFeature] = useState([<HazardMapping />]);
    const [feature, setFeature] = useState([<div />]);
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
                // return_feat = [<HazardMapping />];
                break;
            case "c_r_a":
                hmActive("");
                crapActive("primary");
                cavActive("");
                // return_feat = [<CommunityRiskAssessment />];
                break;
            case "c_a_v":
                hmActive("");
                crapActive("");
                cavActive("primary");
                // return_feat = [<CapacityAndVulnerability />];
                break;
            default:
                hmActive("primary")
                crapActive("");
                cavActive("");
                // return_feat = [<HazardMapping />];
                break;
        }
        setFeature(return_feat)
    }

    const columns = ["Hazard", "Speed of Onset", "Early Warning", "Impact", "Actions"];
    
    const data = [
        ["Landslide", "Slower", "Offline", "One week", <Button>Edit</Button>],
        ["Crack", "None", "Online", "Two week", <Button>Edit</Button>],
        ["Sinkhole", "Quick", "Offline", "One week", <Button>Edit</Button>],
        // ["Rockslide", "Fast", "Online", "Two week", <Button>Edit</Button>],
        // ["Mudslide", "Slower", "Offline", "One week", <Button>Edit</Button>],
        // ["Mudshake", "Slowest", "Online", "Two week", <Button>Edit</Button>],
    ];
    
    const options = {
        filterType: 'checkbox',
    };

    return (
        <Fragment>
            <Container maxWidth="xl" className={classes.root} spacing={24}>
                <Grid container alignItems="center" justify="center">
                    <Grid item justify-xs-center className={classes.btnGroup}>
                        <ButtonGroup variant="contained" color="primary" size="large" aria-label="contained primary button group">
                            <Button>Risk Profile</Button>
                            <Button>Hazard Map</Button>
                            <Button>Hazard Data</Button>
                            <Button>Resources and Capacities</Button>
                            <Button>Family Risk Profile</Button>
                        </ButtonGroup>
                    </Grid>
                    <Grid item xs={12} >
                        <Paper elevation={3} className={classes.raPaper}>
                            <Typography variant="h6">
                                Risk Profile <Link>[edit]</Link>
                            </Typography>
                            <Typography variant="text">This is the current risk profile of the community.</Typography>
                        </Paper>
                        <br />
                    </Grid>
                    <Grid item xs={12} >
                        <Paper elevation={3} className={classes.raPaper}>
                            <Typography variant="h6">Hazard Map <Link>[edit]</Link></Typography>
                        </Paper>
                        <br />
                    </Grid>
                    <Grid item xs={12} >
                        <Paper elevation={3} className={classes.raPaper}>
                            <Typography variant="h6">Hazard Data <Link>[edit]</Link></Typography>
                            
                            <MUIDataTable
                                data={data}
                                columns={columns}
                                options={options}
                            />
                        </Paper>
                        <br />
                    </Grid>
                    <Grid item xs={12} >
                        <Paper elevation={3} className={classes.raPaper}>
                            <Typography variant="h6">Resources and Capacities <Link>[edit]</Link></Typography>
                        </Paper>
                        <br />
                    </Grid>
                    <Grid item xs={12} >
                        <Paper elevation={3} className={classes.raPaper}>
                            <Typography variant="h6">Family Risk Profile <Link>[edit]</Link></Typography>
                        </Paper>
                        <br />
                    </Grid>
                </Grid>
            </Container>

        </Fragment>
    )
}
