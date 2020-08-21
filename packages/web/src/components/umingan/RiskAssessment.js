import React, { useState, Fragment, useEffect } from "react";
import {
    Container,
    Grid,
    Fab,
    Button,
    ButtonGroup,
    Paper,
    Typography,
    Link,
    IconButton,
} from "@material-ui/core";

import { useStyles, tableStyles } from "../../styles/general_styles";
import HazardData from './risk_assessment/HazardData';
import FamilyRiskProfile from './risk_assessment/FamilyRiskProfile';
import ResourcesAndCapacities from './risk_assessment/ResourcesAndCapacities';
import RiskAssessmentSummary from "./risk_assessment/RiskAssessmentSummary";


export default function RiskAssessment(props) {
    const classes = useStyles();

    return (
        <Fragment>
            <Container maxWidth="xl" className={classes.root} spacing={24}>
                <Grid container alignItems="center" justify="center">
                    <Grid item justify-xs-center className={classes.btnGroup}>
                        <ButtonGroup
                            variant="contained"
                            color="primary"
                            size="large"
                            aria-label="contained primary button group"
                        >
                            <Button>Risk Assessment Summary</Button>
                            <Button>Hazard Map</Button>
                            <Button>Hazard Data</Button>
                            <Button>Resources and Capacities</Button>
                            <Button>Family Risk Profile</Button>
                        </ButtonGroup>
                    </Grid>
                    <RiskAssessmentSummary {...props} classes={classes} />
                    <Grid item xs={12}>
                        <Paper elevation={3} className={classes.raPaper}>
                            <Typography variant="h6">
                                Hazard Map <Link>[edit]</Link>
                            </Typography>
                        </Paper>
                        <br />
                    </Grid>
                    <HazardData {...props} classes={classes} />
                    <ResourcesAndCapacities {...props} classes={classes} />
                    <FamilyRiskProfile {...props} classes={classes} />
                </Grid>
            </Container>
        </Fragment>
    );
}
