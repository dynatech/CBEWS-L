import React, { useState, Fragment, useEffect } from "react";
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
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

import { useStyles, tableStyles } from "../../styles/general_styles";
import FabMuiTable from "../utils/MuiTable";
import CapacityAndVulnerability from "./cav";

import { UmiRiskManagement } from "@dynaslope/commons";

function getAddButton(title, handler) {
    return (
        <Button onClick={handler} arial-label="edit" color="primary">
            <AddIcon /> {title}
        </Button>
    );
}
function getEditButton(handler) {
    return (
        <IconButton
            onClick={() => console.log("Clicked Edit")}
            arial-label="edit"
            component="span"
        >
            <EditIcon />
        </IconButton>
    );
}
function getDeleteButton(handler) {
    return (
        <IconButton
            onClick={() => console.log("Clicked Delete")}
            arial-label="edit"
            component="span"
        >
            <DeleteIcon />
        </IconButton>
    );
}

function FamilyRiskProfile(props) {
    const cmd = "update-delete";
    const { classes } = props;
    const [tableData, setTableData] = useState([]);

    const initTable = async () => {
        const response = await UmiRiskManagement.GetAllFamilyRiskProfile();
        console.log("FRP response", response);
        if (response.status === true) {
            setTableData(response.data);
            console.log("FRP tableData", tableData);
        } else {
            console.error("problem retrieving hazard data");
        }
        console.log("FRP tableData", tableData);
    };

    useEffect(() => {
        initTable();
    }, []);

    const handleAdd = () => {
        console.log("FRP Clicked add");
    };
    const handleEdit = () => {
        console.log("FRP Clicked edit");
    };
    const handleDelete = () => {
        console.log("FRP Clicked delete");
    };

    const options = {
        filterType: "checkbox",
    };
    const columns = [
        { name: "number_of_members", label: "Number of Members" },
        { name: "vulnerable_groups", label: "Vulnerable Groups" },
        { name: "nature_of_vulnerability", label: "Nature of Vulnerability" },
        { name: "last_ts", label: "Update Timestamp" },
    ];

    return (
        <Grid item xs={12}>
            <Paper elevation={3} className={classes.raPaper} >
                <Typography variant="h6">
                    Family Risk Profile
                </Typography>

                <FabMuiTable
                    classes={{}}
                    addLabel="Family Risk Profile"
                    data={{
                        columns: columns,
                        rows: tableData,
                    }}
                    handlers={{
                        handleAdd,
                        handleEdit,
                        handleDelete,
                    }}
                    options={options}
                    cmd={cmd}
                />
            </Paper>
            <br />
        </Grid>
    );
}

function ResourcesAndCapacities(props) {
    const cmd = "update-delete";
    const { classes } = props;
    const [tableData, setTableData] = useState([]);

    const initTable = async () => {
        const response = await UmiRiskManagement.GetAllResourceAndCapacities();
        console.log("RAC response", response);
        if (response.status === true) {
            setTableData(response.data);
            console.log("RAC tableData", tableData);
        } else {
            console.error("problem retrieving hazard data");
        }
        console.log("RAC tableData", tableData);
    };

    useEffect(() => {
        initTable();
    }, []);

    const handleAdd = () => {
        console.log("RAC Clicked add");
    };
    const handleEdit = () => {
        console.log("RAC Clicked edit");
    };
    const handleDelete = () => {
        console.log("RAC Clicked delete");
    };

    const options = {
        filterType: "checkbox",
    };
    const columns = [
        { name: "resource_and_capacities", label: "Resource and Capacity" },
        { name: "status", label: "Status" },
        { name: "owner", label: "Owner" },
        { name: "last_ts", label: "Update Timestamp" },
    ];

    return (
        <Grid item xs={12}>
            <Paper elevation={3} className={classes.raPaper} >
                <Typography variant="h6">
                    Resources and Capacities
                </Typography>

                <FabMuiTable
                    classes={{}}
                    addLabel="Resource and Capacity"
                    data={{
                        columns: columns,
                        rows: tableData,
                    }}
                    handlers={{
                        handleAdd,
                        handleEdit,
                        handleDelete,
                    }}
                    options={options}
                    cmd={cmd}
                />
            </Paper>
            <br />
        </Grid>
    );
}

function HazardData(props) {
    const cmd = "update-delete";
    const { classes } = props;
    const [tableData, setTableData] = useState([]);

    const initTable = async () => {
        const response = await UmiRiskManagement.GetAllHazardData();
        console.log("HD response", response);
        if (response.status === true) {
            setTableData(response.data);
            console.log("HD tableData", tableData);
        } else {
            console.error("problem retrieving hazard data");
        }
        console.log("HD tableData", tableData);
    };

    useEffect(() => {
        initTable();
    }, []);

    const handleAdd = () => {
        console.log("HD Clicked add");
    };
    const handleEdit = () => {
        console.log("HD Clicked edit");
    };
    const handleDelete = () => {
        console.log("HD Clicked delete");
    };

    const options = {
        filterType: "checkbox",
    };
    const columns = [
        { name: "hazard", label: "Hazard" },
        { name: "speed_of_onset", label: "Speed of Onset" },
        { name: "early_warning", label: "Early Warning" },
        { name: "impact", label: "Impact" },
        { name: "last_ts", label: "Update Timestamp" },
    ];
    // const data = [
    //     ["Landslide", "Slower", "Offline", "One week", [getEditButton(), getDeleteButton()]],
    //     ["Crack", "None", "Online", "Two week", [getEditButton(), getDeleteButton()]],
    //     ["Sinkhole", "Quick", "Offline", "One week", [getEditButton(), getDeleteButton()]],
    // ];
    return (
        <Grid item xs={12}>
            <Paper elevation={3} className={classes.raPaper} >
                <Typography variant="h6">Hazard Data</Typography>

                <FabMuiTable
                    classes={{}}
                    addLabel="Hazard Data"
                    data={{
                        columns: columns,
                        rows: tableData,
                    }}
                    handlers={{
                        handleAdd,
                        handleEdit,
                        handleDelete,
                    }}
                    options={options}
                    cmd={cmd}
                />
            </Paper>
            <br />
        </Grid>
    );
}

export default function RiskAssessment(props) {
    const classes = useStyles();
    const [open, setOpen] = useState();
    const [whichModal, setWhichModal] = useState("hazard_data")
    const [defaultStringValues, setDefaultStrValues] = useState({
        "hazard": "",
        "speed_of_onset": "",
        "early_warning": "",
        "speed_of_onset": "",
        "impact": "",
    });
    const [defaultTSValues, setDefaultTSValues] = useState({});
    const [defaultIntValues, setDefaultIntValues] = useState({});

    const handleSwitchModalForm = (form_kind) => () => {
        console.log("form_kind", form_kind);
        setWhichModal(form_kind);
        switch(form_kind) {
            case "hazard_data":
                setDefaultStrValues({
                    "hazard": "",
                    "speed_of_onset": "",
                    "early_warning": "",
                    "speed_of_onset": "",
                    "impact": "",
                });
                setDefaultTSValues({});
                setDefaultIntValues({});
                break;
            case "resources_and_capacities":
                setDefaultStrValues({
                    "resource_and_capacities": "",
                    "status": "",
                    "owner": "",
                });
                setDefaultTSValues({});
                setDefaultIntValues({});
                break;
            case "family_risk_profile":
                setDefaultStrValues({
                    "resource_and_capacities": "",
                    "status": "",
                    "owner": "",
                });
                setDefaultTSValues({});
                setDefaultIntValues({});
                break;
        }
    };

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
                            <Typography variant="body1">
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

            
            {/* <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Hazard Data</DialogTitle>
                <DialogContent>
                    <Forms data={{
                            string: defaultStringValues,
                            int: defaultIntValues,
                            ts: defaultTSValues
                        }}
                        formData={formData}
                        closeForm={() => handleClose()}
                        submitForm={() => submitCaV()}
                        deleteForm={() => deleteCaV()} 
                    />
                </DialogContent>
            </Dialog>

            <Dialog
                open={openDelete}
                onClose={handleCloseDelete}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Are you sure you want to remove this entry?"}</DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Removing this capacity and vulnerability data cannot be undone. Are you sure you want to remove this entry?
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDelete} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={confirmDelete} color="primary" autoFocus>
                        Confirmed
                    </Button>
                </DialogActions>
            </Dialog> */}
        </Fragment>
    );
}
