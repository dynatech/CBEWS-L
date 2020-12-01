import React, { Fragment, useEffect, useState } from 'react';
import {
    Grid, Paper, Container,
    Fab, makeStyles, Table,
    TableBody, TableCell, TableHead,
    TableRow, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, Button,
    InputLabel, TextField, Typography, Box
} from "@material-ui/core";
import Autocomplete from '@material-ui/lab/Autocomplete';

import MenuItem from '@material-ui/core/MenuItem';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import {
    MuiPickersUtilsProvider,
    DateTimePicker,
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';

import { useCookies } from 'react-cookie';

import { MarGroundData, AppConfig } from '@dynaslope/commons'

const tableStyle = makeStyles(theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
        overflowX: 'auto',
    },
    table: {
        minWidth: 650,
    },
}));

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles(theme => ({
    button_fluid: {
        width: '90%',
        padding: 10
    },
    formControl: {
        minWidth: 120,
    },
    selectSpacing: {
        paddingTop: 5
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export default function MonitoringLogs() {
    function createData(date_time, feature, reporter, description) {
        return { date_time, feature, reporter, description };
    }

    const rows = [
        createData('2019-08-08 07:30:00', 'Crack', 'John Geliberte', 'May bagong Crack malapit sa Crack C'),
        createData('2019-08-07 07:30:00', 'Crack', 'John Geliberte', 'May bagong Crack malapit sa Crack A'),
        createData('2019-08-06 07:30:00', 'Seepage', 'John Geliberte', 'May nakitang seepage malapit sa municipyo'),
        createData('2019-08-05 07:30:00', 'Tilted/Ponding', 'John Geliberte', 'May baong ponding'),
        createData('2019-08-04 07:30:00', 'Tilted/Ponding', 'John Geliberte', 'May baong ponding'),
        createData('2019-08-03 07:30:00', 'Slope failure', 'John Geliberte', 'May baong ponding'),
        createData('2019-08-02 07:30:00', 'Slope failure', '53cm', 'Gumuho ang lupa malapit sa sakahan'),
        createData('2019-08-01 07:30:00', 'Crack', 'John Geliberte', 'May bagong Crack malapit sa Crack C'),
        createData('2019-07-30 07:30:00', 'Crack', 'John Geliberte', 'May bagong Crack malapit sa Crack C')
    ];
    const dt_classes = tableStyle();
    const classes = useStyles();

    const [openRaise, setOpenRaise] = useState(false);
    const [momsContainer, setMomsContainer] = useState([]);

    const [selectedMomsFeatures, setSelectedMomsFeatures] = useState(0);
    const [selectedFeatureName, setSelectedFeatureName] = useState(0);
    const [selectedTS, setSelectedTS] = useState(moment(new Date()).format("YYYY-MM-DD HH:mm:ss"));
    const [selectedRemarks, setSelectedRemarks] = useState('');
    const [selectedReporter, setSelectedReporter] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedAlertLevel, setSelectedAlertLevel] = useState(0);
    const [selectedMomsID, setSelectedMomsID] = useState(0);
    const [modificationDisabled, setModificationDisabled] = useState(false);
    const [autoCompleteFeaturename, setAutoCompleteFeaturename] = useState('');

    const [notifStatus, setNotifStatus] = useState('success');
	const [openNotif, setOpenNotif] = useState(false);
    const [notifText, setNotifText] = useState('');
    const [cookies, setCookie] = useCookies(['credentials']);

    const [featureNameList, setFeatureNameList] = useState({
        options: [{title: 'None selected',
        instance_id: 0}],
        getOptionLabel: (options) => options.title
    });

    const [featureDetails, setFeatureDetails] = useState([]);

    const [datatable, setDatatable] = useState([]);

    useEffect(() => {
        initMoms(cookies.credentials.site_id);
    }, []);

    const initMoms = async (site_id = 29) => {
        const response = await MarGroundData.GetMOMSData(site_id);
        console.log("response", response)
        if (response.status === true) {
            let moms_container = [];
            response.data.forEach(element => {
                const { feature_id, instance_id, site_id, feature_name,
                    location, reporter, moms_id, observace_ts, reporter_id,
                    remarks, validator, op_trigger, feature_type, feature_desc } = element;
                let temp = {
                    "instance_id": instance_id,
                    "site_id": site_id,
                    "feature_id": feature_id,
                    "feature_name": feature_name,
                    "location": location,
                    "reporter": reporter,
                    "moms_id": moms_id,
                    "observance_ts": moment(observace_ts).format('YYYY-MM-DD HH:mm:ss'),
                    "reporter_id": reporter_id,
                    "remarks": remarks,
                    "validator": validator,
                    "op_trigger": op_trigger,
                    "feature_type": feature_type,
                    "feature_desc": feature_desc
                }
                moms_container.push(temp)
            });
            setMomsContainer(moms_container);
            setDatatable(moms_container);
        } else {
            console.error(response.message);
        }
    }

    const handleMomsModification = (data) => {
        let temp = {
            instance_id: data.instance_id,
            feature_name: data.feature_name
        }
        setOpenForm(true);
        setModificationDisabled(true);
        setSelectedMomsFeatures(data.feature_id);
        setSelectedFeatureName(temp);
        setSelectedMomsID(data.moms_id)
        setAutoCompleteFeaturename(data.feature_name);
        setSelectedTS(data.observance_ts);
        setSelectedRemarks(data.remarks);
        setSelectedReporter(data.reporter);
        setSelectedLocation(data.location);
        setSelectedAlertLevel(data.op_trigger);
    };

    const handleCloseRaise = () => {
        setOpenRaise(false);
    };

    const [openForm, setOpenForm] = React.useState(false);

    const handleClickOpenForm = () => {
        setOpenForm(true);
        setModificationDisabled(false);
    };

    const handleCloseForm = () => {
        setOpenForm(false);
    };

    const handleChangeFeatureType = (feature_id) => {
        setSelectedMomsFeatures(feature_id);
        fetch(`${AppConfig.HOSTNAME}/api/ground_data/moms/fetch/feature/${feature_id}/${cookies.credentials.site_id}`, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            }
          }).then((response) => response.json())
            .then((responseJson) => {
              if (responseJson.data.length !== 0) {
                let f_list = [];
                let f_container = [];
                
                responseJson.data.forEach(element => {
                    f_container.push(element);
                    f_list.push({
                        title: element.feature_name,
                        instance_id:element.instance_id
                    })
                });
                setFeatureNameList({
                    options: f_list,
                    getOptionLabel: (options) => {
                        if (typeof options === 'string') {
                            return options;
                          }
                          if (options.inputValue) {
                            return options.inputValue;
                          }
                          return options.title;
                    }
                });
                setFeatureDetails(f_container);
              } else {
                console.log("FAILED")
              }
            })
            .catch((error) => {
              console.log(error)
            }
          );
    }

    const handleFeatureNameChange = (feature_name) => {
        setAutoCompleteFeaturename(feature_name)
        let feature_details = {};
        feature_details = featureDetails.find(o => o.feature_name === feature_name);
        if (feature_details == null) {
            feature_details = {
                instance_id: 0,
                feature_name: feature_name
            }
        }
        setSelectedFeatureName(feature_details);
    }

    const submitNewMoms = async () => {
        let api_func = '';
        let json = '';
        let response;
        if (modificationDisabled === true) {
            api_func = 'update';
            json = {
                "datetime": selectedTS,
                "feature_type": selectedMomsFeatures,
                "feature_name": autoCompleteFeaturename,
                "reporter": selectedReporter,
                "location": selectedLocation,
                "remarks": selectedRemarks,
                "site_id": cookies.credentials.site_id,
                "user_id": cookies.credentials.user_id,
                "alert_level": selectedAlertLevel,
                "moms_id": selectedMomsID
            }
            response = await MarGroundData.UpdateMOMSData(json);
        } else {
            api_func = 'add';
            json = {
                "datetime": selectedTS,
                "feature_type": selectedMomsFeatures,
                "feature_name": selectedFeatureName.feature_name,
                "reporter": selectedReporter,
                "location": selectedLocation,
                "remarks": selectedRemarks,
                "site_id": cookies.credentials.site_id,
                "user_id": cookies.credentials.user_id,
                "alert_level": selectedAlertLevel
            }
            response = await MarGroundData.InsertMOMSData(json);
        }

        if (response.status === true) {
            initMoms();
            handleCloseForm();
            setOpenNotif(true);
            setNotifStatus("success");
            if (api_func == 'add') {
                setNotifText("Successfully added new manifestation of movements.");
            } else {
                setNotifText("Successfully updated manifestation of movements.");
            }
            } else {
                setOpenNotif(true);
                setNotifStatus("error");
            if (api_func == 'add') {
                setNotifText("Failed to add manifestation of movements.");
            } else {
                setNotifText("Failed to update manifestation of movements.");
            }
        }

    }

    const deleteMoms = async () => {
        const response = await MarGroundData.DeleteMOMSData({"moms_id": selectedMomsID});
        if (response.status === true) {
            initMoms();
            handleCloseForm();
            setOpenNotif(true);
            setNotifStatus("success");
            setNotifText("Successfully deleted manifestation of movements.");
        } else {
            setOpenNotif(true);
            setNotifStatus("error");
            setNotifText("Failed to delete manifestation of movements.");
        }
    }

    return (
        <Fragment>
            {
                // Modal for raising
            }
            <Dialog
                open={openRaise}
                onClose={handleCloseRaise}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Raise Manifestation of movement?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to raise this alert?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseRaise} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleCloseRaise} color="primary" autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
            {
                // Modal for CRUD Moms
            }
            <Dialog
                open={openForm}
                onClose={handleCloseForm}
                fullWidth="sm"
                maxWidth="sm"   
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Manifestation of Movements</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <MuiPickersUtilsProvider utils={MomentUtils}>
                                <DateTimePicker
                                    autoOk
                                    ampm={false}
                                    disableFuture
                                    disabled={modificationDisabled}
                                    style={{paddingTop: 5}}
                                    format="YYYY-MM-DD HH:mm:ss"
                                    value={selectedTS}
                                    onChange={(date) => { setSelectedTS(moment(date).format("YYYY-MM-DD HH:mm:ss")) }}
                                    label="Date time"
                                    fullWidth
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                autoFocus
                                margin="dense"
                                value={selectedReporter}
                                id="reporter"
                                label="Reporter"
                                type="text"
                                onChange={(e)=> { setSelectedReporter(e.target.value)}}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl className={classes.formControl} fullWidth>
                                <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                                    Feature type
                                </InputLabel>
                                <Select
                                    labelId="demo-simple-select-placeholder-label-label"
                                    id="demo-simple-select-placeholder-label"
                                    disabled={modificationDisabled}
                                    value={selectedMomsFeatures}
                                    onChange={(e) => handleChangeFeatureType(e.target.value)}
                                    displayEmpty
                                    className={classes.selectEmpty}
                                >   
                                    <MenuItem value={0}><em>None selected</em></MenuItem>
                                    <MenuItem value={1}>Crack</MenuItem>
                                    <MenuItem value={2}>Scarp</MenuItem>
                                    <MenuItem value={3}>Seepage</MenuItem>
                                    <MenuItem value={4}>Ponding</MenuItem>
                                    <MenuItem value={5}>Tilted/Split trees</MenuItem>
                                    <MenuItem value={6}>Damaged structures</MenuItem>
                                    <MenuItem value={7}>Slope failure</MenuItem>
                                    <MenuItem value={8}>Bulgin/Depression</MenuItem>
                                    <MenuItem value={9}><em>No landslide manifestation observed</em></MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl className={classes.formControl} fullWidth>
                                <InputLabel shrink id="feature-name-label">
                                    Feature name
                                </InputLabel>
                                <Autocomplete
                                    {...featureNameList}
                                    id="feature-name"
                                    clearOnEscape
                                    freeSolo
                                    inputValue={autoCompleteFeaturename}
                                    disabled={modificationDisabled}
                                    onInputChange={(e,v) => {handleFeatureNameChange(v)}}
                                    renderInput={(params) => (
                                    <TextField {...params} margin="normal"/>
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="location"
                                label="Location"
                                type="text"
                                value={selectedLocation}
                                onChange={(e)=> {setSelectedLocation(e.target.value)}}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl className={[classes.formControl, classes.selectSpacing]} fullWidth>
                                <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                                    Alert level
                                </InputLabel>
                                <Select
                                    labelId="demo-simple-select-placeholder-label-label"
                                    disabled={modificationDisabled}
                                    id="demo-simple-select-placeholder-label"
                                    value={selectedAlertLevel}
                                    onChange={(e) => setSelectedAlertLevel(e.target.value)}
                                    displayEmpty
                                    className={classes.selectEmpty}
                                >   
                                    <MenuItem value={0}><em>No significant movement</em></MenuItem>
                                    <MenuItem value={2}>Significant movement observed</MenuItem>
                                    <MenuItem value={3}>Critical movement observed</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>   
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="desciption"
                                label="Description"
                                type="text"
                                value={selectedRemarks}
                                onChange={(e)=> {setSelectedRemarks(e.target.value)}}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} align="center">
                            <Fab variant="extended">
                                <CloudUploadIcon style={{padding: 10}}/>
                                Upload photo(s) of Manifestation of Movements
                            </Fab>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseForm} color="primary">
                        Cancel
                    </Button>
                    {
                        modificationDisabled ? 
                        <Button onClick={()=> {deleteMoms()}} color="primary">
                            Delete
                        </Button>
                        :
                        <div></div>
                    }
                    <Button onClick={()=> {submitNewMoms()}} color="primary" autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            <Container fixed>
                <Grid container align="center" spacing={2}>
                    <Grid item xs={12}>
                        <Paper className={dt_classes.root}>
                            <Table className={dt_classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date and time</TableCell>
                                        <TableCell>Feature type</TableCell>
                                        <TableCell>Feature name</TableCell>
                                        <TableCell>Location</TableCell>
                                        <TableCell>Reporter</TableCell>
                                        <TableCell>Remarks</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        datatable.length === 0 ?
                                            <TableRow>
                                                <Typography variant="h4" align="center">
                                                    No data available
                                            </Typography>
                                            </TableRow>
                                            :
                                            datatable.map(row => (
                                                <TableRow key={row.observance_ts} onClick={() => { handleMomsModification(row) }} >
                                                    <TableCell component="th" scope="row">
                                                        {row.observance_ts}
                                                    </TableCell>
                                                    <TableCell>{row.feature_type}</TableCell>
                                                    <TableCell>{row.feature_name}</TableCell>
                                                    <TableCell>{row.location}</TableCell>
                                                    <TableCell>{row.validator}</TableCell>
                                                    <TableCell>{row.remarks}</TableCell>
                                                </TableRow>
                                            ))
                                    }
                                </TableBody>
                            </Table>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle2">
                            * click row to Raise/Modify/Remove Manifestation of Movements data.
                        </Typography>
                    </Grid>
                    <Grid container align="center" style={{ paddingTop: 20 }}>

                        <Grid item xs={3} />
                        <Grid item xs={2}>
                            <Fab variant="extended"
                                color="primary"
                                aria-label="add" className={classes.button_fluid}
                                onClick={handleClickOpenForm}>
                                Add MoMs
                        </Fab>
                        </Grid>
                        <Grid item xs={2}>
                            <Fab variant="extended"
                                color="primary"
                                aria-label="add" className={classes.button_fluid}
                                onClick={() => { }}>
                                Download
                        </Fab>
                        </Grid>
                        <Grid item xs={2}>
                            <Fab variant="extended"
                                color="primary"
                                aria-label="add" className={classes.button_fluid}
                                onClick={() => { }}>
                                Print
                        </Fab>
                        </Grid>
                        <Grid item xs={3} />
                    </Grid>
                </Grid>
            </Container>
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
