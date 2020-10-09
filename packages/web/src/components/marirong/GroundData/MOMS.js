import React, {Fragment, useState, useEffect, useRef} from 'react';
import {
    Grid, Paper, Container,
    Fab, 
    InputLabel, Button, Typography,
    FormControl, MenuItem, TextField,
    Select
} from "@material-ui/core";
import { MuiPickersUtilsProvider, KeyboardDateTimePicker } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';

import { useStyles, tableStyles } from '../../../styles/general_styles';
import { ButtonStyle } from "../../../styles/button_style";

import Forms from '../../utils/Forms';
import FabMuiTable from "../../utils/MuiTable";

import moment from 'moment';
import { Formik, Form, Field } from "formik";

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { useCookies } from 'react-cookie';

import { MarGroundData } from '@dynaslope/commons';

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function MOMS() {
    const cmd = "update-delete";
    const [cookies, setCookie] = useCookies(['credentials']);
    const btn_classes = ButtonStyle();
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

    // CONTAINERS
    const [feature_id, setFeatureId] = useState();
    const [instance_id, setInstanceId] = useState();
    const [feature_options, setFeatureOptions] = useState([]);
    const [instance_options, setInstanceOptions] = useState([]);
    const [fNameItems, setFNameItems] = useState([]);
    const [observanceTs, setObservanceTS] = useState(moment().format("YYYY-MM-DD HH:mm:ss"));

    const feature_names_ref = useRef([]);
    
    const [defaultStrValues, setDefaultStrValues] = useState({
        "observance_ts": moment(observanceTs).format("YYYY-MM-DD HH:mm:ss"),
        "feature_id": "",
        "instance_id": "",
        "reporter": "",
        "description": "",
        "alert_level": ""
    });

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
        fetchLatestData();
    },[]);

    const fetchLatestData = async () => {
        const response = await MarGroundData.GetMOMSData();
        const features_response = await MarGroundData.FetchMoMSFeatures();
        const instance_response = await MarGroundData.GetMomsInstancesPerSite(cookies.credentials.site_id);

        if (response.status === true) {
            setTableData(response.data);
        } else console.error("problem retrieving MOMS.");

        if (features_response.status === true) {
            setFeatureOptions(features_response.data);
            if (instance_response.status === true) {
                setInstanceOptions(instance_response.data);
                setFNameItems(instance_response.data);
                feature_names_ref.current = instance_response.data;

                const type_rows = features_response.data.map(feat => <MenuItem value={parseInt(feat.feature_id)}>{feat.feature_type}</MenuItem>);
            }
        } else {
            console.error(response);
            alert("Trouble loading features");
        }
    }

    const handleFeatureTypeChange = ({ target: { value }}) => {
        console.log("value", value)
        setDefaultStrValues({ ...defaultStrValues, "feature_id": value });
        console.log("defaultStrValues", defaultStrValues);
        setInstanceOptions(feature_names_ref.current[value]);
    };

    const handleFeatureNameChange = ({ target: { value }}) => {
        console.log("value", value)
        setDefaultStrValues({ ...defaultStrValues, "instance_id": value });
        setInstanceId(value);
    };

    const resetState = () => {
        setSelectedData({});    
        setDefaultStrValues({
            "ts": moment(observanceTs).format("YYYY-MM-DD HH:mm:ss"),
            "feature_id": "",
            "instance_id": "",
            "reporter": "",
            "description": "",
            "alert_level": ""
        });
    }
  
    const handleAdd = () => {
        resetState();
        setOpen(true);
    };

    const handleEdit = (data) => {
        setCommand("update");
        setSelectedData(data);
        // GET moms_features and moms_instances
        setInstanceId(data["instance_id"]);
        setFeatureId(data["feature_id"]);
        setInstanceOptions(feature_names_ref.current[data["feature_id"]]);

        console.log("edit data", data);
        setDefaultStrValues({
            ...defaultStrValues,
            "observance_ts": moment(data.observance_ts).format("YYYY-MM-DD HH:mm:ss"),
            "feature_id": data.feature_id,
            "instance_id": data.instance_id,
            "reporter": data.reporter,
            "description": data.remarks,
            "alert_level": data.op_trigger
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
            fetchLatestData();
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

    const submitForm = async (values) => {
        console.log("form values on submit", values);
        let json = values;
        json.reporter_id = cookies.credentials.user_id;
        let hasModifiedRow = false;
        let response;
        json.remarks = json.description;
        json.op_trigger = json.alert_level;
        if (!Object.keys(selectedData).length) {
            // ADD
            response = await MarGroundData.InsertMOMSData(json);
        } else {
            // EDIT
            hasModifiedRow = true;
            json.moms_id = selectedData.moms_id;
            let temp_array = []
            console.log("JSON", json);
            Object.keys(json).forEach(key => {
                console.log("key", key);
                if (!["feature_id", "reporter", "description", "alert_level"].includes(key)) {
                    let temp = {[key]: json[key]};
                    temp_array.push(temp);
                }
            });
            response = await MarGroundData.UpdateMOMSData(temp_array);
        }

        if (response.status === true) {
            fetchLatestData();
            handleClose();
            setNotifStatus("success");
        } else {
            handleClose();
            setNotifStatus("error");
        }
        setNotifText(response.message);
        setOpenNotif(true);
    }

    console.log("observanceTs", observanceTs)

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
                <Formik
                    initialValues={defaultStrValues}
                    onSubmit={(values) => {
                        submitForm(values);
                    }}
                >
                    {({ handleChange, handleBlur, handleSubmit, values }) => {
                        return (
                            <form className={classes.form} >
                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        {/* Observance TS */}
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <KeyboardDateTimePicker
                                                value={observanceTs}
                                                onChange={(value) => {
                                                    console.log("value",value);
                                                    setObservanceTS(value);
                                                }}
                                                label="Obs Trial"
                                                onError={console.log}
                                                // minDate={moment("2018-01-01 00:00:00").format("YYYY-MM-DD HH:mm:ss")}
                                                format="yyyy-MM-dd HH:mm:ss"
                                                fullWidth
                                            />
                                        </MuiPickersUtilsProvider>
                                    </Grid>
                                    <Grid item xs={6}>
                                        {/* Feature Type */}
                                        <FormControl fullWidth>
                                            <InputLabel htmlFor="type-native-simple">Feature Type</InputLabel>
                                            <Select
                                                value={defaultStrValues.feature_id}
                                                onChange={handleFeatureTypeChange}
                                                inputProps={{
                                                    name: 'select',
                                                    id: 'select-native-simple',
                                                }}
                                            >
                                                {feature_options.map(type => <MenuItem value={type.feature_id}>{type.feature_type}</MenuItem>)}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6}>
                                        {/* Feature Name */}
                                        <FormControl fullWidth>
                                            <InputLabel htmlFor="name-native-simple">Feature Name</InputLabel>
                                            <Select
                                                value={defaultStrValues.instance_id}
                                                onChange={handleFeatureNameChange}
                                                inputProps={{
                                                    name: 'select',
                                                    id: 'select-native-simple',
                                                }}
                                            >
                                                {instance_options.map(name => <MenuItem value={name.instance_id}>{name.feature_name}</MenuItem>)}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        {/* Remarks */}
                                        <TextField
                                            key="description_txt"
                                            name="description_txt"
                                            label={"Description"}
                                            onChange={handleChange("description")}
                                            onBlur={handleBlur("description")}
                                            defaultValue={values.description}
                                            variant="outlined"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        {/* Alert Level */}
                                        <TextField
                                            key="alert_level_txt"
                                            name="alert_level_txt"
                                            label={"Alert Level"}
                                            onChange={handleChange("alert_level")}
                                            onBlur={handleBlur("alert_level")}
                                            defaultValue={values.alert_level}
                                            variant="outlined"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography>* All fields are required</Typography>
                                        <Typography>
                                            * Please review your details before submitting
                                        </Typography>
                                    </Grid>
                                    {command != "add" ? (
                                        <Fragment>
                                            <Grid item xs={6}>
                                                <Button
                                                    className={btn_classes.small2}
                                                    onClick={handleSubmit}
                                                    type="submit"
                                                >
                                                    Submit
                                                </Button>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Button 
                                                    className={btn_classes.small2}
                                                    onClick={deleteMoms}>Delete</Button>
                                            </Grid>
                                        </Fragment>
                                    ) : (
                                        <Grid item xs={12}>
                                            <Button
                                                className={btn_classes.small}
                                                onClick={handleSubmit}
                                                type="submit"
                                            >
                                                Submit
                                            </Button>
                                        </Grid>
                                    )}
                                </Grid>
                            </form>
                        )
                    }}
                </Formik>
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
