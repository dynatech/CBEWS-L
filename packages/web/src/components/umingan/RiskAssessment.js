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
import HazardMaps from './risk_assessment/HazardMaps';
import HazardData from './risk_assessment/HazardData';
import FamilyRiskProfile from './risk_assessment/FamilyRiskProfile';
import ResourcesAndCapacities from './risk_assessment/ResourcesAndCapacities';
import RiskAssessmentSummary from "./risk_assessment/RiskAssessmentSummary";


export default function RiskAssessment(props) {
    const classes = useStyles();

    return (
        <Fragment>
            <Container maxWidth="xl" className={classes.root} spacing={24} style={{padding: 10}}>
                <Grid container alignItems="center" justify="center">
                    <RiskAssessmentSummary {...props} classes={classes} />
                    <HazardMaps {...props} classes={classes} />
                    <HazardData {...props} classes={classes} />
                    <ResourcesAndCapacities {...props} classes={classes} />
                    <FamilyRiskProfile {...props} classes={classes} />
                </Grid>
            </Container>
        </Fragment>
    );
}
