import React, {Fragment, useState, useEffect, useRef} from 'react';
import {
    Grid, Paper, Container,
    Fab, Table,
    TableBody, TableCell, TableHead,
    TableRow, Button, Typography
} from "@material-ui/core";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import { useStyles, tableStyles } from '../../../styles/general_styles';

import Forms from '../../utils/Forms';
import FabMuiTable from "../../utils/MuiTable";

import moment from 'moment';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { useCookies } from 'react-cookie';

import { MarGroundData } from '@dynaslope/commons';

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}


function MomsInstances (props) {
    const cmd = "update-delete";
    const [cookies, setCookie] = useCookies(['credentials']);
    const dt_classes = tableStyles();
    const classes = useStyles();
      
    const [open, setOpen] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);
    const [notifStatus, setNotifStatus] = useState('success');
	const [openNotif, setOpenNotif] = useState(false);
    const [notifText, setNotifText] = useState('');

    const [selectedData, setSelectedData] = useState({});
    const [command, setCommand] = useState("add");

    const formData = useRef();
    const [tableData, setTableData] = useState([]);
    const [defaultStringValues, setDefaultStrValues] = useState({
        "Feature Name": "",
        "Location": "",
        "Reporter": "",
    });
    const [defaultTSValues, setDefaultTSValues] = useState({});
    const [defaultIntValues, setDefaultIntValues] = useState({});

    // TEST
    const options = {
        filterType: "checkbox",
    };
    const columns = [
        { name: "feature_name", label: "Feature Name" },
        { name: "location", label: "Location" },
        { name: "reporter", label: "Reporter" },
    ];
    
    useEffect(()=> {
        initTable();
    },[]);

    const initTable = async () => {
        const response = await MarGroundData.FetchMomsInstances(props.feature_id, cookies.credentials.site_id);
        response.status ? setTableData(response.data) : console.error("problem retrieving moms features."); 
    }

    const resetState = () => {
        setSelectedData({});    
        setDefaultStrValues({
            "Feature Name": "",
            "Location": "",
            "Reporter": "",
        });
    }
  
    const handleAdd = () => {
        resetState();
        setOpen(true);
    };

    const handleEdit = (data) => {
        setSelectedData(data);
        setDefaultStrValues({
            "Feature Name": data["feature_name"],
            "Location": data["location"],
            "Reporter": data["reporter"],
        });
        setDefaultTSValues({});
        setOpen(true);
        setCommand("edit");
    };

    const handleClose = () => {
      setOpen(false);
      resetState();
    };

    const handleDelete = (data) => {
        setSelectedData(data);
        handleOpenDelete();
    };

    const handleOpenDelete = () => {
        setOpen(false);
        setOpenDelete(true);
    };

    const handleCloseDelete = () => {
        setOpen(true);
        setOpenDelete(false);
        resetState();
    }

    const deleteMomsName = () => {
        setOpen(false);
        setOpenDelete(true);
    }

    const confirmDelete = async () => {
        const input = {
            "id": selectedData.id
        };
        const response = await MarGroundData.DeleteMomsInstance(input);
        if (response.status === true) {
            initTable();
            setOpen(false);
            setOpenDelete(false);
            resetState();
            setOpenNotif(true);
            setNotifStatus("success");
            setNotifText("Successfully deleted Moms Feature Name data.");
        } else {
            setOpenNotif(true);
            setNotifStatus("error");
            setNotifText("Failed to delete Moms Feature Name data. Please contact the developers or file a bug report");
        }
    }

    const submit = async () => {
        console.log("formData.curren", formData.current);
        let json = formData.current;
        json.user_id = cookies.credentials.user_id;
        json.last_ts = moment().format("YYYY-MM-DD HH:mm:ss");
        json.feature_id = props.feature_id;
        let hasModifiedRow = false;
        let response;
        if (!Object.keys(selectedData).length) {
            // ADD
            const { date, last_ts} = defaultTSValues;
            const temp_ts = {
                date: moment( ).format("YYYY-MM-DD HH:mm:ss"),
                last_ts: moment(last_ts).format("YYYY-MM-DD HH:mm:ss"),
            }
            json = Object.assign(defaultStringValues, defaultIntValues, temp_ts, json);
            
            Object.keys(json).forEach(key => {
                let temp;
                console.log("key", key);
                switch(key) {
                    case 'FeatureType':
                        json["feature_type"] = json[key]
                        break;
                    default:
                        json[key.replace(" ","_").toLocaleLowerCase()] = json[key]
                        break;
                }
            });
            response = await MarGroundData.InsertMomsInstance(json);
        } else {
            // EDIT
            hasModifiedRow = true;
            json.id = selectedData.id;
            json.user_id = cookies.credentials.user_id;
            let temp_array = []
            Object.keys(json).forEach(key => {
                let temp = {};
                console.log("key", key);
                switch(key) {
                    case 'FeatureType':
                        temp["feature_type"] = json[key]
                        break;
                    default:
                        temp[key.replace(" ","_").toLocaleLowerCase()] = json[key]
                        break;
                }
                temp_array.push(temp);
            });
            response = await MarGroundData.UpdateMomsInstance(temp_array);
        }
        if (response.status === true) {
            initTable();
            handleClose();
            setOpenNotif(true);
            setNotifStatus("success");
            if (!hasModifiedRow) setNotifText("Successfully added new Moms Feature Name data.");
            else setNotifText("Successfully updated Moms Feature Name data.");
            
        } else {
            handleClose();
            setOpenNotif(true);
            setNotifStatus("error");
            setNotifText("Failed to update Moms Feature Name data. Please review your updates.");
        }
    }

    return (
        <Fragment>
        <Container fixed>
            <Grid container align="center" spacing={2}>
                <Grid item xs={12} >
                    <FabMuiTable
                        classes={{}}
                        addLabel=""
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
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="subtitle2">
                        * click row to Raise/Modify/Remove Moms Feature Name data.
                    </Typography>
                </Grid>
                <Grid container align="center">
                    <Grid item xs={4} />
                    <Grid item xs={4}>
                        <Fab variant="extended"
                            color="primary"
                            aria-label="add" className={classes.button_fluid}
                            onClick={() => setOpen(true)}>
                            Add Entry
                        </Fab>
                    </Grid>
                    <Grid item xs={4} />
                </Grid>
            </Grid>
        </Container>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Moms Feature Name</DialogTitle>
            <DialogContent>
                <Forms data={{
                        string: defaultStringValues,
                        int: defaultIntValues,
                        ts: defaultTSValues
                    }}
                    formData={formData}
                    closeForm={() => handleClose()}
                    submitForm={() => submit()}
                    deleteForm={() => deleteMomsName()} 
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
                Removing this Moms Feature Name data cannot be undone. Are you sure you want to remove this entry?
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
        </Dialog>

        <Snackbar open={openNotif} 
            autoHideDuration={3000} 
            onClose={() => {setOpenNotif(false)}}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            key={'top,right'}>
            <Alert onClose={() => {setOpenNotif(false)}} severity={notifStatus}>
                {notifText}
            </Alert>
        </Snackbar>
    </Fragment>
    )
}


export default function MomsFeatures () {
    const cmd = "update-delete";
    const [cookies, setCookie] = useCookies(['credentials']);
    const dt_classes = tableStyles();
    const classes = useStyles();
      
    const [open, setOpen] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);
    const [notifStatus, setNotifStatus] = useState('success');
	const [openNotif, setOpenNotif] = useState(false);
    const [notifText, setNotifText] = useState('');

    const [selectedData, setSelectedData] = useState({});
    const [command, setCommand] = useState("add");

    const formData = useRef();
    const [tableData, setTableData] = useState([]);
    const [defaultStringValues, setDefaultStrValues] = useState({
        "Feature Type": "",
        "Description": "",
    });
    const [defaultTSValues, setDefaultTSValues] = useState({});
    const [defaultIntValues, setDefaultIntValues] = useState({});

    // TEST
    const options = {
        filterType: "checkbox",
    };
    const columns = [
        { name: "feature_type", label: "Feature Type" },
        { name: "description", label: "Description" },
    ];
    
    useEffect(()=> {
        initTable();
    },[]);

    const initTable = async () => {
        const response = await MarGroundData.FetchMomsFeatures();
        response.status ? setTableData(response.data) : console.error("problem retrieving moms features."); 
    }

    const resetState = () => {
        setSelectedData({});    
        setDefaultStrValues({
            "Feature Type": "",
            "Description": "",
        });
    }
  
    const handleAdd = () => {
        resetState();
        setOpen(true);
    };

    const handleEdit = (data) => {
        setSelectedData(data);
        setDefaultStrValues({
            "Feature Type": data["feature_type"],
            "Description": data["description"],
        });
        setDefaultTSValues({});
        setOpen(true);
        setCommand("edit");
    };

    const handleClose = () => {
      setOpen(false);
      resetState();
    };

    const handleDelete = (data) => {
        setSelectedData(data);
        handleOpenDelete();
    };

    const handleOpenDelete = () => {
        setOpen(false);
        setOpenDelete(true);
    };

    const handleCloseDelete = () => {
        setOpen(true);
        setOpenDelete(false);
        resetState();
    }

    const deleteMomsFeature = () => {
        setOpen(false);
        setOpenDelete(true);
    }

    const confirmDelete = async () => {
        const input = {
            "id": selectedData.id
        };
        const response = await MarGroundData.DeleteMomsFeatureType(input);
        if (response.status === true) {
            initTable();
            setOpen(false);
            setOpenDelete(false);
            resetState();
            setOpenNotif(true);
            setNotifStatus("success");
            setNotifText("Successfully deleted Moms Feature Type data.");
        } else {
            setOpenNotif(true);
            setNotifStatus("error");
            setNotifText("Failed to delete capacity and vunerability data. Please contact the developers or file a bug report");
        }
    }

    const submit = async () => {
        console.log("formData.curren", formData.current);
        let json = formData.current;
        json.user_id = cookies.credentials.user_id;
        json.last_ts = moment().format("YYYY-MM-DD HH:mm:ss");
        let hasModifiedRow = false;
        let response;
        if (!Object.keys(selectedData).length) {
            // ADD
            const { date, last_ts} = defaultTSValues;
            const temp_ts = {
                date: moment( ).format("YYYY-MM-DD HH:mm:ss"),
                last_ts: moment(last_ts).format("YYYY-MM-DD HH:mm:ss"),
            }
            json = Object.assign(defaultStringValues, defaultIntValues, temp_ts, json);
            
            Object.keys(json).forEach(key => {
                let temp;
                console.log("key", key);
                switch(key) {
                    case 'FeatureType':
                        json["feature_type"] = json[key]
                        break;
                    default:
                        json[key.replace(" ","_").toLocaleLowerCase()] = json[key]
                        break;
                }
            });
            response = await MarGroundData.InsertMomsFeatureType(json);
        } else {
            // EDIT
            hasModifiedRow = true;
            json.id = selectedData.id;
            json.user_id = cookies.credentials.user_id;
            let temp_array = []
            Object.keys(json).forEach(key => {
                let temp = {};
                console.log("key", key);
                switch(key) {
                    case 'FeatureType':
                        temp["feature_type"] = json[key]
                        break;
                    default:
                        temp[key.replace(" ","_").toLocaleLowerCase()] = json[key]
                        break;
                }
                temp_array.push(temp);
            });
            response = await MarGroundData.UpdateMomsFeatureType(temp_array);
        }
        if (response.status === true) {
            initTable();
            handleClose();
            setOpenNotif(true);
            setNotifStatus("success");
            if (!hasModifiedRow) setNotifText("Successfully added new Moms Feature Type data.");
            else setNotifText("Successfully updated Moms Feature Type data.");
            
        } else {
            handleClose();
            setOpenNotif(true);
            setNotifStatus("error");
            setNotifText("Failed to update capacity and vunerability data. Please review your updates.");
        }
    }

    return (
        <Fragment>
        <Container fixed>
            <Grid container align="center" spacing={2}>
                <Grid item xs={12} >
                    <FabMuiTable
                        classes={{}}
                        addLabel=""
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
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="subtitle2">
                        * click row to Raise/Modify/Remove Moms Feature Type data.
                    </Typography>
                </Grid>
                <Grid container align="center">
                    <Grid item xs={4} />
                    <Grid item xs={4}>
                        <Fab variant="extended"
                            color="primary"
                            aria-label="add" className={classes.button_fluid}
                            onClick={() => setOpen(true)}>
                            Add Entry
                        </Fab>
                    </Grid>
                    <Grid item xs={4} />
                </Grid>

                <Grid container align="center">
                    <Grid item xs={12}>
                        {
                            "feature_id" in selectedData ? <MomsInstances featureId={selectedData.feature_id} /> : <Typography>Nothing selected</Typography>
                        }
                    </Grid>
                </Grid>
            </Grid>
        </Container>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Moms Feature Type</DialogTitle>
            <DialogContent>
                <Forms data={{
                        string: defaultStringValues,
                        int: defaultIntValues,
                        ts: defaultTSValues
                    }}
                    formData={formData}
                    closeForm={() => handleClose()}
                    submitForm={() => submit()}
                    deleteForm={() => deleteMomsFeature()} 
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
                Removing this Moms Feature Type data cannot be undone. Are you sure you want to remove this entry?
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
        </Dialog>

        <Snackbar open={openNotif} 
            autoHideDuration={3000} 
            onClose={() => {setOpenNotif(false)}}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            key={'top,right'}>
            <Alert onClose={() => {setOpenNotif(false)}} severity={notifStatus}>
                {notifText}
            </Alert>
        </Snackbar>
    </Fragment>
    )
}
