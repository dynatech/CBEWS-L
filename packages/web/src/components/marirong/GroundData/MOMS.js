import React, {Fragment, useState, useEffect, useRef} from 'react';
import {
    Grid, Paper, Container,
    Fab, Table,
    TableBody, TableCell, TableHead,
    TableRow, Button, Typography,
    FormControl, MenuItem, InputLabel,
    Select
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

export default function MOMS() {
    const cmd = "update-delete";
    let feature_type_container = [];
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
        "Description": "",
        "Feature Selection": {},
    });
    const [defaultTSValues, setDefaultTSValues] = useState({
        "Observance TS": moment(),
    });
    const [defaultIntValues, setDefaultIntValues] = useState({
        "Alert Level": 0,
    });

    const [feature_id, setFeatureId] = useState();
    const [instance_id, setInstanceId] = useState();
    const [instance_options, setInstanceOptions] = useState([]);
    const [fNameItems, setFNameItems] = useState([]);

    // TEST
    const options = {
        filterType: "checkbox",
    };
    const columns = [
        { name: "observance_ts", label: "Observance TS" },
        { name: "remarks", label: "Description" },
        { name: "feature_name", label: "Feature Name" },
        { name: "moms_reporter", label: "Moms Reporter" },
        { name: "op_trigger", label: "Alert Level" },
    ];
    
    useEffect(()=> {
        initTable();
    },[]);

    const initTable = async () => {
        const response = await MarGroundData.GetMOMSData();
        if (response.status === true) {
            setTableData(response.data);
            const features_response = await MarGroundData.FetchMomsFeatures();

            if (features_response.status === true) {
                const instance_response = await MarGroundData.GetMomsInstancesPerSite(cookies.credentials.site_id);

                console.log("ITLOOOG", instance_response);
                if (instance_response.status === true) {
                    console.log("ITLOOOG");
                    setFNameItems(instance_response.data);
                    console.log("instance_response.data", instance_response.data);
                    console.log("fNameItems", fNameItems);
                    const f_types_items = features_response.data.map(feat => {     
                        return ({
                            "label": feat.feature_type,
                            "value": parseInt(feat.feature_id)
                        })
                    });

                    console.log("f_types_items", f_types_items);

                    const type_rows = f_types_items.map(e2 => <MenuItem value={e2.value}>{e2.label}</MenuItem>);

                    const feat_selection = (
                        <Grid item container>
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="age-native-simple">Feature Type</InputLabel>
                                    <Select
                                        value={feature_id}
                                        onChange={handleFeatureTypeChange(instance_response.data)}
                                        inputProps={{
                                            name: 'select',
                                            id: 'select-native-simple',
                                        }}
                                    >
                                        {type_rows}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth >
                                    <InputLabel htmlFor="age-native-simple">Feature Name</InputLabel>
                                    <Select
                                        value={instance_id}
                                        onChange={handleFeatureNameChange}
                                        inputProps={{
                                            name: 'select',
                                            id: 'select-native-simple',
                                        }}
                                    >
                                        {instance_options}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    );
                    setDefaultStrValues({
                        ...defaultStringValues,
                        "Feature Selection": feat_selection
                    })
                }
            } else {
                console.error(response);
                alert("Trouble loading features");
            }
        } else console.error("problem retrieving MOMS.");
    }

    const handleFeatureTypeChange = (data) => (event) => {
        console.log("handler data", data);
        setFeatureId(event.target.value);
        console.log("fNameItems[event.target.value]", data[event.target.value]);
        const temp = data[event.target.value].map((e3, i3) => <MenuItem value={e3.instance_id}>{e3.feature_name}</MenuItem>)
        console.log("temp", temp);
        setInstanceOptions(temp);
    };

    const handleFeatureNameChange = (instance_id) => {
        console.log("instance_id", instance_id);
    };

    const resetState = () => {
        setSelectedData({});    
        setDefaultStrValues({
            "Description": "",
            "Feature Selection": {},
        });
        setDefaultTSValues({
            "Observance TS": moment(),
        });
        setDefaultIntValues({
            "Alert Level": 0
        });
    }
  
    const handleAdd = () => {
        resetState();
        setOpen(true);
    };

    const handleEdit = (data) => {
        setSelectedData(data);
        console.log("data", data);
        console.log("formData", formData);
        console.log("defaultStringValues", defaultStringValues);

        
        // GET moms_features and moms_instances
        // const temp = defaultStringValues["Feature Name"];
        // temp[0] = parseInt(data["instance_id"]);
        setInstanceId(data["instance_id"]);
        setFeatureId(data["feature_id"]);

        setDefaultStrValues({
            ...defaultStringValues,
            "Description": data["remarks"],
            // "Feature Name": temp,
        });
        setDefaultIntValues({
            "Alert Level": data["op_trigger"],
        });
        setDefaultTSValues({
            "Observance TS": data["observance_ts"],
        });
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

    const deleteMoms = () => {
        setOpen(false);
        setOpenDelete(true);
    }

    const confirmDelete = async () => {
        const input = {
            "moms_id": selectedData.moms_id
        };
        const response = await MarGroundData.DeleteMOMSData(input);
        if (response.status === true) {
            initTable();
            setOpen(false);
            setOpenDelete(false);
            resetState();
            setNotifStatus("success");
        } else {
            setNotifStatus("error");
            setNotifText("Failed to delete moms data. Please contact the developers or file a bug report");
        }
        setNotifText(response.message);
        setOpenNotif(true);
    }

    const submit = async () => {
        console.log("formData.current", formData.current);
        let json = formData.current;
        json.user_id = cookies.credentials.user_id;
        let hasModifiedRow = false;
        let response;
        if (!Object.keys(selectedData).length) {
            // ADD
            const { observance_ts, } = defaultTSValues;
            const temp_ts = {
                observance_ts: moment( ).format("YYYY-MM-DD HH:mm:ss"),
            }
            json = Object.assign(defaultStringValues, defaultIntValues, temp_ts, json);
            
            Object.keys(json).forEach(key => {
                let temp;
                console.log("key", key);
                switch(key) {
                    case 'Description':
                        json["remarks"] = json[key]
                        break;
                    case 'ObservanceTS':
                        temp["observance_ts"] = json[key]
                        break;
                    case 'AlertLevel':
                        temp["op_trigger"] = json[key]
                    default:
                        json[key.replace(" ","_").toLocaleLowerCase()] = json[key]
                        break;
                }
            });
            response = await MarGroundData.InsertMOMSData(json);
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
                    case 'Description':
                        temp["remarks"] = json[key]
                        break;
                    case 'ObservanceTS':
                        temp["observance_ts"] = json[key]
                        break;
                    case 'AlertLevel':
                        temp["op_trigger"] = json[key]
                    default:
                        temp[key.replace(" ","_").toLocaleLowerCase()] = json[key]
                        break;
                }
                temp_array.push(temp);
            });
            response = await MarGroundData.UpdateMOMSData(temp_array);
        }

        if (response.status === true) {
            initTable();
            handleClose();
            setNotifStatus("success");
        } else {
            handleClose();
            setNotifStatus("error");
        }
        setNotifText(response.message);
        setOpenNotif(true);
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
                        * click row to Raise/Modify/Remove MOMS data.
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
            <DialogTitle id="form-dialog-title">MOMS</DialogTitle>
            <DialogContent>
                <Forms data={{
                        string: defaultStringValues,
                        int: defaultIntValues,
                        ts: defaultTSValues
                    }}
                    formData={formData}
                    closeForm={() => handleClose()}
                    submitForm={() => submit()}
                    deleteForm={() => deleteMoms()}
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
                Removing this MOMS data cannot be undone. Are you sure you want to remove this entry?
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
