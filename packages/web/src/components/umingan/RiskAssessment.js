import React, { useState, Fragment } from "react";
import MUIDataTable from "mui-datatables";
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
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { useStyles, tableStyles } from "../../styles/general_styles";
// import HazardMapping from './hazard_mapping';
// import CommunityRiskAssessment from './cra';
import CapacityAndVulnerability from "./cav";

import { UmiRiskManagement } from '@dynaslope/commons';

function getEditButton(handler) {
    return (
        <IconButton onClick={() => console.log("Clicked Edit")} arial-label="edit" component="span">
            <EditIcon />
        </IconButton>
    )
}
function getDeleteButton(handler) {
    return (
        <IconButton onClick={() => console.log("Clicked Delete")} arial-label="edit" component="span">
            <DeleteIcon />
        </IconButton>
    )
}

function FamilyRiskProfile(props) {
    const { classes } = props;
    const options = {
        filterType: "checkbox",
    };
    const columns = ["Household No.", "Number of Members", "Number of members belonging to vulnerable groups", "Name of vulnerability", "Actions"];
    const data = [
        ["1", "1", "1", "Children", [getEditButton(), getDeleteButton()]],
        ["2", "4", "2", "Children", [getEditButton(), getDeleteButton()]],
        ["3", "5", "1", "Elderly", [getEditButton(), getDeleteButton()]],
    ];
    return (
        <Grid item xs={12}>
            <Typography variant="h6">
                Family Risk Profile <Link>[edit]</Link>
            </Typography>

            <MUIDataTable data={data} columns={columns} options={options} />
            <br />
        </Grid>
    );
}

function ResourcesAndCapacities(props) {
    const { classes } = props;
    const options = {
        filterType: "checkbox",
    };
    const columns = ["Resource and Capacity", "Status", "Owner", "Actions"];
    const data = [
        ["Temporary Tent", "Intact", "LGU", [getEditButton(), getDeleteButton()]],
        ["Megaphone", "Intact", "BLGU", [getEditButton(), getDeleteButton()]],
        ["Radio", "Intact", "MLGU", [getEditButton(), getDeleteButton()]],
    ];
    return (
        <Grid item xs={12}>
            <Typography variant="h6">
                Resources and Capacities <Link>[edit]</Link>
            </Typography>

            <MUIDataTable data={data} columns={columns} options={options} />
            <br />
        </Grid>
    );
}

function HazardData(props) {
    const { classes } = props;
    const options = {
        filterType: "checkbox",
    };
    const columns = [
        "Hazard",
        "Speed of Onset",
        "Early Warning",
        "Impact",
        "Actions",
    ];
    const data = [
        ["Landslide", "Slower", "Offline", "One week", [getEditButton(), getDeleteButton()]],
        ["Crack", "None", "Online", "Two week", [getEditButton(), getDeleteButton()]],
        ["Sinkhole", "Quick", "Offline", "One week", [getEditButton(), getDeleteButton()]],
    ];
    return (
        <Grid item xs={12}>
            <Typography variant="h6">
                Hazard Data <Link>[edit]</Link>
            </Typography>

            <MUIDataTable data={data} columns={columns} options={options} />
            <br />
        </Grid>
    );
}

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
                            <Button>Risk Profile</Button>
                            <Button>Hazard Map</Button>
                            <Button>Hazard Data</Button>
                            <Button>Resources and Capacities</Button>
                            <Button>Family Risk Profile</Button>
                        </ButtonGroup>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper elevation={3} className={classes.raPaper}>
                            <Typography variant="h6">
                                Risk Profile <Link>[edit]</Link>
                            </Typography>
                            <Typography variant="text">
                                This is the current risk profile of the
                                community.
                            </Typography>
                        </Paper>
                        <br />
                    </Grid>
                    <Grid item xs={12}>
                        <Paper elevation={3} className={classes.raPaper}>
                            <Typography variant="h6">
                                Hazard Map <Link>[edit]</Link>
                            </Typography>
                        </Paper>
                        <br />
                    </Grid>
                    {<HazardData {...props} classes={classes} />}
                    {<ResourcesAndCapacities {...props} classes={classes} />}
                    {<FamilyRiskProfile {...props} classes={classes} />}
                </Grid>
            </Container>
        </Fragment>
    );
}
