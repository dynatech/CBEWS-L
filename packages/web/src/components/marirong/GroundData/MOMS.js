import React, {Fragment, useState, useEffect, useRef} from 'react';
import {
    Grid, Paper, Container,
    Fab, 
    InputLabel, Button, Typography,
    FormControl, MenuItem, TextField,
    Select, Link
} from "@material-ui/core";
import Autocomplete from '@material-ui/lab/Autocomplete';
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
import AttachmentsDialog from '../../reducers/AttachmentsDialog';
import '../../../styles/image-gallery.css';


function MomsFeaturesDialog (props) {
    const { classes, open, setOpen, data, setData, options, setFeatureOptions, } = props;
    const btn_classes = ButtonStyle();
    const command = "add";

    const addFeatureType = async (values) => {
        const response = await MarGroundData.InsertMomsFeatureType(data);
        if (response.status === true) {
            console.log("added new feature type");
            // fetchLatestData();
            // handleClose();
            // setNotifStatus("success");
        } else {
            // handleClose();
            // setNotifStatus("error");
        }
        // setNotifText(response.message);
        // setOpenNotif(true);
    }

    const deleteMomsFeatures = () => {
        console.log("test");
    };
    
    return (
        // Modal for MOMS Features (add new feature type NOT BEING USED!)
        <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">MOMS Features</DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={data}
                    onSubmit={(values) => {
                        console.log("submit values", values);
                        addFeatureType(values);
                    }}
                >
                    {({ handleChange, handleBlur, handleSubmit, values }) => {
                        console.log("values", values);
                        return (
                            <form className={classes.form} >
                                <Grid container spacing={1}>
                                    <Grid item xs={6}>
                                        {/* Feature Type */}
                                        <FormControl fullWidth>
                                            <InputLabel htmlFor="type-native-simple">Feature Type</InputLabel>
                                            <Select
                                                value={data.feature_id}
                                                onChange={(event) => {
                                                    const { value } = event.target;
                                                    console.log("options.find((e) => e.feature_id === value)", options.find((e) => e.feature_id === value));
                                                    setData(options.find((e) => e.feature_id === value));
                                                }}
                                                inputProps={{
                                                    name: 'select',
                                                    id: 'select-native-simple',
                                                }}
                                            >
                                                {options.map(type => <MenuItem value={type.feature_id}>{type.feature_type}</MenuItem>)}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        {/* feature type */}
                                        <TextField
                                            key="feature_type_txt"
                                            name="feature_type_txt"
                                            label={"Feature Type"}
                                            onChange={handleChange("feature_type")}
                                            onBlur={handleBlur("feature_type")}
                                            defaultValue={data.feature_type}
                                            variant="outlined"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        {/* type description */}
                                        <TextField
                                            key="type_description_txt"
                                            name="type_description_txt"
                                            label={"Type Description"}
                                            onChange={handleChange("description")}
                                            onBlur={handleBlur("description")}
                                            defaultValue={data.description}
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
                                                    onClick={deleteMomsFeatures}>Delete</Button>
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
    )
}

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

    const [tableData, setTableData] = useState([]);

    const [uploadOpen, setUploadOpen] = useState(false);
    const [file_to_upload, setFileToUpload] = useState(null);
    const [filename, setFilename] = useState("");
    const [report_attachments, setReportAttachments] = useState([]);


    // CONTAINERS
    const [feature_options, setFeatureOptions] = useState([]);
    const [instance_options, setInstanceOptions] = useState([]);
    const [observanceTs, setObservanceTS] = useState(moment().format("YYYY-MM-DD HH:mm:ss"));

    //// FEATURE PARTS
    // FEATURE TYPE
    const [momsFeatureFormData, setMomsFeatureFormData] = useState({
        // "feature_id": "",
        // "description": "",
        "feature_type": ""
    });
    const [isFeatureDialogOpen, setIsFeatureDialogOpen] = useState(false);
    // FEATURE NAME
    const [momsInstancesFormData, setMomsInstancesFormData] = useState({
        //"instance_id": "",
        //"feature_name": "",
        //"location": "",
        //"reporter": ""
        // id of feature type
        "feature_id":"1",
        "feature_name":"scarpace",
        "location":"downtown",
        "reporter":"userseroone",
        "site_id":"29"
    });
    const [isInstanceDialogOpen, setIsInstanceDialogOpen] = useState(false);

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
        // Get MOMS data and populate table
        const response = await MarGroundData.GetMOMSData();
        // Get list of MOMS features (feature_id, feature_type)
        const features_response = await MarGroundData.FetchMoMSFeatures();
        console.log("features_response", features_response);    // list of MOMS features (feature_id, feature_type)
        // Get list of MOMS instance for a specific site
        const instance_response = await MarGroundData.GetMomsInstancesPerSite(cookies.credentials.site_id);

        if (response.status === true) {
            setTableData(response.data);    // populate data table
        } else console.error("problem retrieving MOMS.");

        if (features_response.status === true) {
            setFeatureOptions(features_response.data);  //populate MOMS feature option
            if (instance_response.status === true) {
                // setInstanceOptions(instance_response.data);
                feature_names_ref.current = instance_response.data;

                const type_rows = features_response.data.map((feat, i) => <MenuItem value={parseInt(feat.feature_id)} key={i}>{feat.feature_type}</MenuItem>);
            }
        } else {
            console.error(response);
            alert("Trouble loading features");
        }
    }

    const handleFeatureTypeChange = ({ target: { value }}) => {
        console.log("feature_type_id: ", value);
        setDefaultStrValues({ ...defaultStrValues, "feature_id": value });
        // Set Feature Name dropdown
        setInstanceOptions(feature_names_ref.current[value]);
        console.log(instance_options);
        console.log(defaultStrValues);
    };

    const handleFeatureNameChange = ({ target: { value }}) => {
        console.log("feature_name_id: ", value);
        setDefaultStrValues({ ...defaultStrValues, "instance_id": value });
        console.log(defaultStrValues);
    };

    const resetState = () => {
        setSelectedData({});    
        setDefaultStrValues({
            "observance_ts": moment(observanceTs).format("YYYY-MM-DD HH:mm:ss"),
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
        setInstanceOptions(feature_names_ref.current[data["feature_id"]]);

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

    // onSubmit for New Feature Type
    const submitNewFeatureType = async (json) => {
        const response = await MarGroundData.InsertMomsFeatureType(json);
        if (response.status === true) {
            console.log("added new feature type");
            setIsFeatureDialogOpen(false);
            fetchLatestData();
            // setNotifStatus("success");
        } else {
            console.log(response.error);
            // setNotifStatus("error");
        }
        // setNotifText(response.message);
        // setOpenNotif(true);
    }

    // onSubmit for new Feature Name
    const submitNewFeatureName = async (json) => {
        const response = await MarGroundData.InsertMomsInstance(json);
        if (response.status === true) {
            console.log("added new feature type");
            setIsInstanceDialogOpen(false);
            fetchLatestData();
            // handleClose();
            // setNotifStatus("success");
        } else {
            // handleClose();
            // setNotifStatus("error");
        }
        // setNotifText(response.message);
        // setOpenNotif(true);
    }

    const deleteMomsFeatures = () => {
        console.log("test");
    }; 

    // onSubmit for Add Entry form
    const submitFormAddEntry = async (values) => {
        console.log("form values on submit:", values);
        console.log(defaultStrValues);
        let json = values;
        json.site_id = cookies.credentials.site_id;
        json.feature_id = defaultStrValues.feature_id;
        json.instance_id = defaultStrValues.instance_id;
        json.reporter_id = cookies.credentials.user_id;
        json.remarks = json.description;
        json.op_trigger = json.alert_level;
        console.log("json: "+json.data);
        let hasModifiedRow = false;
        let response;
        if (!Object.keys(selectedData).length) {
            // ADD new entry
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

    // UPLOAD RELATED FNX

    const handleFileSelection = (event) => {
        const file = event.target.files[0];
        setFileToUpload(file);
        setFilename(file.name);
    };

    const handleClickUpload = async () => {
        const data = new FormData();
        const moms_id = selectedData.id;
        data.append("file", file_to_upload);
        data.append("moms_id", moms_id);

        const response = await MarGroundData.UploadMOMSAttachment(data);
        if (response.status === true) {
            handleUploadClose();
            setFileToUpload(null);
            setFilename("");
        } else console.error("Problem in click upload");
        alert(response.message);
    };


    const handleUploadOpen = async (data) => {
        console.log(data);
        const response = await MarGroundData.FetchMOMSAttachments(parseInt(data.id));
        console.log("response 336", response)
        setReportAttachments(response.data)
        setSelectedData(data);
        setUploadOpen(true);
    };

    const handleUploadClose = () => {
        setFileToUpload(null);
        setFilename("");
        setUploadOpen(false);
    };

    return (
        <Fragment>
        {/* MOMS Table component */}
        <Container fixed>
            <Grid container align="center" spacing={2}>
                <Grid item xs={12} >
                    {/* <FabMuiTable
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
                    /> */}
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
                            handleUploadOpen,
                            handleUploadClose,
                        }}
                        options={options}
                        cmd={"update-delete-upload"}
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

        {/* Add Entry modal */}
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Add Entry</DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={defaultStrValues}
                    onSubmit={(values) => {
                        submitFormAddEntry(values);
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
                                                {feature_options.map((type, i) => <MenuItem value={type.feature_id} key={i}>{type.feature_type}</MenuItem>)}
                                                {/* {feature_options.map(type => <MenuItem value={type.feature_id}>{type.feature_type}</MenuItem>)} */}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6}>
                                        {/* Add new Feature Type */}
                                        <Link
                                            href="#"
                                            onClick={() => {
                                                console.log("Clicked add new feature type link");
                                                setIsFeatureDialogOpen(true);
                                            }}
                                        >
                                            Add New Feature Type
                                        </Link>
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
                                                {instance_options.map((name, i) => <MenuItem value={name.id} key={i}>{name.feature_name}</MenuItem>)}
                                                {/* {instance_options.map(name => <MenuItem value={name.instance_id}>{name.feature_name}</MenuItem>)} */}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6}>
                                        {/* Feature Name */}
                                        <Link
                                            href="#"
                                            onClick={() => {
                                                console.log("Clicked add new feature name link");
                                                setIsInstanceDialogOpen(true);
                                            }}
                                        >
                                            Add New Feature Name
                                        </Link>
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
                                            type="number"
                                            // inputProps={{maxLength :1}}
                                            helperText={"Alert 0 (Min) to Alert 3 (Max)"}
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
                                            * Please review the details before submitting
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

        {/* <MomsFeaturesDialog
            classes={classes}
            open={isFeatureDialogOpen}
            setOpen={setIsFeatureDialogOpen}
            data={momsFeatureFormData}
            setData={setMomsFeatureFormData}
            options={feature_options}
            setFeatureOptions={setFeatureOptions}
        /> */}

        {/* Add New Feature Type dialog */}
        <Dialog open={isFeatureDialogOpen} onClose={() => setIsFeatureDialogOpen(false)} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Add New Feature Type</DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={momsFeatureFormData}
                    onSubmit={(values) => {
                        submitNewFeatureType(values);
                    }}
                >
                    {({ handleChange, handleBlur, handleSubmit, values }) => {
                        console.log("values", values);
                        return (
                            <form className={classes.form} >
                                <Grid container spacing={1}>
                                     {/* Feature Type */}
                                    <Grid item xs={12}>
                                        <TextField
                                            key="feature_type_txt"
                                            name="feature_type_txt"
                                            label={"e.g. cracks, scarp, seepage, etc."}
                                            onChange={handleChange("feature_type")}
                                            onBlur={handleBlur("feature_type")}
                                            variant="outlined"
                                            fullWidth
                                        />
                                    </Grid>   
                                    <Grid item xs={12}>
                                        <Typography variant="body2" gutterBottom>
                                            * Please review the details before submitting
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
                                                    onClick={() => "deleteMomsFeatures"}>Delete</Button>
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

        {/* Add new feature name dialog */}
        <Dialog open={isInstanceDialogOpen} onClose={() => setIsInstanceDialogOpen(false)} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">New Feature Name</DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={momsInstancesFormData}
                    onSubmit={(values) => {
                        submitNewFeatureName(values);
                    }}
                >
                    {({ handleChange, handleBlur, handleSubmit, values }) => {
                        console.log("values", values);
                        return (
                            <form className={classes.form} >
                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        <TextField
                                            key="feature_name_txt"
                                            name="feature_name_txt"
                                            label={"Feature Name"}
                                            // onChange={handleChange("instance_id")}
                                            // onBlur={handleBlur("instance_id")}
                                            onChange={handleChange("feature_name")}
                                            onBlur={handleBlur("feature_name")}
                                            variant="outlined"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="body2" gutterBottom>
                                            * Please review the details before submitting
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
                                                    onClick={() => "deleteMomsFeatures"}>Delete</Button>
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

        <Snackbar open={openNotif} 
            autoHideDuration={3000} 
            onClose={() => {setOpenNotif(false)}}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            key={'top,right'}>
            <Alert onClose={() => {setOpenNotif(false)}} severity={notifStatus}>
                {notifText}
            </Alert>
        </Snackbar>

        <AttachmentsDialog
            open={uploadOpen}
            filename={filename}
            handleClose={handleUploadClose}
            attachment_list={report_attachments}
            handleFileSelection={handleFileSelection}
            handleUpload={handleClickUpload}
        />
    </Fragment>
    )
}
