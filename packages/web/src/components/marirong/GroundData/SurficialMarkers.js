import React, { Fragment, useEffect, useState, useRef } from 'react';
import {
    Grid, Paper, Container,
    Fab, makeStyles, Table,
    TableBody, TableCell, TableHead,
    TableRow, TextField, Button, TablePagination, Typography
} from "@material-ui/core";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import {
    MuiPickersUtilsProvider,
    DateTimePicker
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import { useCookies } from 'react-cookie';

import { MarGroundData } from '@dynaslope/commons';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

import letter_header from '../../../assets/letter_header.png';
import letter_footer from '../../../assets/letter_footer.png';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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

const useStyles = makeStyles(theme => ({
    button_fluid: {
        width: '90%',
        padding: 10
    },
}));

function SurficialMarker() {
    const [markersTH, setMarkersTH] = useState([]);
    const [dtRow, setDtRow] = useState([]);

    const [markerData, setMarkerData] = useState([]);
    const [markerNames, setMarkerNames] = useState([]);

    const [selectedSurficialMarker, setSelectedSurficialMarker] = useState();
    const [editableTS, setEditableTS] = useState(moment(new Date()).format("YYYY-MM-DD HH:mm:ss"));

    const dt_classes = tableStyle();
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);

    const [addMarkerFields, setAddMarkerFields] = useState([]);
    const [addTs, setAddTs] = useState(moment(new Date()).format("YYYY-MM-DD HH:mm:ss"));
    const [addWeather, setAddWeather] = useState();
    const [addObserver, setAddObserver] = useState();

    const [modificationModal, setModificationModal] = useState(false);
    const [markerFields, setMarkerFields] = useState([]);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [notifStatus, setNotifStatus] = useState('success');
    const [openNotif, setOpenNotif] = useState(false);
    const [notifText, setNotifText] = useState('');
    const [cookies, setCookie] = useCookies(['credentials']);

    let markerValueRef = useRef({});

    // On page load call initSurficialMarker() function
    useEffect(() => {
        initSurficialMarker()
    }, [])

    // Set Surficial Marker table pagination
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        let start = newPage * 10;
        let end = (newPage * 10) + 10;
        setDtRow(markerData.slice(start, end))
    };

    // Set table rows per page
    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Initialize Surficial Marker component - GET Request
    const initSurficialMarker = async () => {
        const response = await MarGroundData.GetSurficialMarkersData();
        if (response.status === true) {
            let temp_th = []    // A, B, C, D
            let temp_tr = []    // table rows
            let temp_dr = []    // markerdata
            let temp = []

            // Set ground measurement markers A, B, C, D
            setMarkerNames(response.markers);
            response.markers.forEach(marker => {
                temp_th.push( <TableCell id={`marker_id_${marker.marker_id}`}>{marker.marker_name.toUpperCase()}</TableCell> );
            });
            // Set marker table headers (A, B, C, D)
            setMarkersTH(temp_th);
            // Store values from response.data to temp_tr
            response.data.forEach(element => {
                let temp_obj = {};
                let marker_data = Object.values(element)[0];

                temp_obj['ts'] = marker_data.ts
                response.markers.forEach(marker_element => {
                    const name = marker_element.marker_name;
                    temp_obj[name] = marker_data[name]
                });
                temp_obj['weather'] = marker_data.weather
                temp_obj['observer'] = marker_data.observer
                temp_tr.push(temp_obj)
            });
            // Populate table rows
            temp_tr.forEach(element => {
                temp = [];
                temp_dr.push(
                    <TableRow key={element.ts} onClick={() => { handleModificationModalOpen(element) }}>
                        <TableCell component="th" scope="row">
                            {element.ts}
                        </TableCell>
                        {/* change forEach to .map!!! */}
                        {response.markers.forEach(marker_element => {
                            temp.push(<TableCell>{element[marker_element.marker_name]}</TableCell>)
                        })}
                        {temp}
                        <TableCell>{element.weather}</TableCell>
                        <TableCell>{element.observer}</TableCell>
                    </TableRow>
                )
            });
            setMarkerData(temp_dr)
            setDtRow(temp_dr.slice(0, 10))
            console.log("temp_tr", temp_tr);
        } else {
            console.error(response.message);
        }
    }

    // Download data as CSV
    const handleDownload = () => {
        
    };

    // Print table function
    const handlePrint = () => {
        const pdf = new jsPDF();
        
        // Header (URL, file_type, left_margin, top, width, height)
        pdf.addImage(letter_header,"PNG", 0, 0, 221, 15);
        
        // Title
        pdf.text("Surficial Markers", 30, 25, {align: "center"});

        // Surficial Markers Table
        // autoTable(pdf, { html: '.MuiTable-root', theme: 'striped', });
        pdf.autoTable({
            html: '.MuiTable-root',
            startY: 30,
            headStyles: {
                fillColor: [27, 81, 109],
            }
        })

        // Footer (URL, file_type, left_margin, top, width, height)
        pdf.addImage(letter_footer,"PNG", 0, 272, 212, 20);

        pdf.autoPrint({variant: 'non-conform'});
        pdf.output('pdfobjectnewwindow');
    };

    // Generate modal for new ground measurement data
    const handleClickOpen = () => {
        let temp = [];
        let grid =  12 / markerNames.length;
        markerNames.forEach(element => {
            temp.push(        
                <Grid item xs={grid}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id={element[0]}
                        label={`Marker ${element.marker_name}`}
                        onChange={(e)=> {handleOnChangeAddMarkerValues(element.marker_name, e.target.value)}}
                        type="text"
                        fullWidth
                    />
                </Grid>
            )
        });
        // Add Markers A, B, C, D
        setAddMarkerFields(temp);
        // Open modal
        setOpen(true);
    };

    const handleOnChangeAddMarkerValues = (key, value) => {
        let temp = markerValueRef.current;
        let key_val = {};
        key_val[key] = value;
        temp = {...temp, ...key_val}
        markerValueRef.current = temp;
    }

    // Dialog (Modal) close / open
    const handleClose = () => {
        setOpen(false);
    };

    // Close modal
    const handleModificationModalClose = () => {
        setModificationModal(false);
    };

    const onChangeMarkerFieldValues = (key, value, original) => {
        switch (key) {
            case 'ts':
                original[key] = value;
                setEditableTS(moment(value).format("YYYY-MM-DD HH:mm:ss"));
                break;
            case 'observer':
            case 'weather':
                original[key] = value;
                break;
            default:
                original[key] = parseInt(value);
                break;
        }
        setSelectedSurficialMarker(original)
    }

    // Onclick of table - row, open MOMs modal for data update / delete
    const handleModificationModalOpen = (element) => {
        let ret_val = [];

        setSelectedSurficialMarker(element);
        setEditableTS(moment(element.ts).format("YYYY-MM-DD HH:mm:ss"))

        Object.keys(element).forEach(obj_element => {
            switch (obj_element) {
                case 'ts':
                    console.log("DO NOTHING");
                    break;
                case 'weather':
                    ret_val.push(
                        <TextField
                            autoFocus
                            margin="dense"
                            onChange={(e) => { onChangeMarkerFieldValues(obj_element, e.target.value, element) }}
                            defaultValue={element[obj_element]}
                            id="weather"
                            label="Weather"
                            fullWidth
                        />
                    )
                    break;
                case 'observer':
                    ret_val.push(
                        <TextField
                            autoFocus
                            margin="dense"
                            onChange={(e) => { onChangeMarkerFieldValues(obj_element, e.target.value, element) }}
                            defaultValue={element[obj_element]}
                            id="observer"
                            label="Nag-sukat"
                            fullWidth
                        />
                    )
                    break;
                default:
                    let marker_id = `marker_${obj_element}`;
                    ret_val.push(<TextField
                        autoFocus
                        margin="dense"
                        defaultValue={element[obj_element]}
                        id={marker_id}
                        label={`Marker ${obj_element}`}
                        type="number"
                        onChange={(e) => { onChangeMarkerFieldValues(obj_element, e.target.value, element) }}
                        fullWidth
                    />)
                    break;
            }
        });
        setMarkerFields(ret_val);
        setModificationModal(true);
    };

    // Update (row - clicked) ground measurement data
    const updateMarkerData = async () => {
        let temp = selectedSurficialMarker;
        let temp_markers = {};

        Object.keys(temp).forEach(element => {
            switch (element) {
                case 'ts':
                case 'weather':
                case 'observer':
                    console.log("Skipping reconstruction");
                    break;
                default:
                    temp_markers[element] = temp[element]
                    break;
            }
        });

        let request = {
            "site_id": cookies.credentials.site_id,
            "ref_ts": selectedSurficialMarker.ts,
            "new_ts": editableTS,
            "weather": selectedSurficialMarker.weather,
            "observer": selectedSurficialMarker.observer,
            "marker_values": temp_markers
        };

        const response = await MarGroundData.UpdateSurficialMarkerData(request);
        if (response.status === true) {
            initSurficialMarker();
            handleModificationModalClose();
            setOpenNotif(true);
            setNotifStatus("success");
            setNotifText("Successfully updated surficial marker data.");
        } else {
            setOpenNotif(true);
            setNotifStatus("error");
            setNotifText("Failed to update surficial marker data. Please check your network connectivity.");
        }
        setModificationModal(false);
    }

    // Delete (row - clicked) ground measurement data
    const deleteMarkerData = async () => {
        const json_input = {
            ts: selectedSurficialMarker.ts,
            weather: selectedSurficialMarker.weather,
            observer: selectedSurficialMarker.observer,
            site_id: cookies.credentials.site_id
        }
        const response = await MarGroundData.DeleteSurficialMarkersData(json_input);
        if (response.status == true) {
          initSurficialMarker();
          setOpenNotif(true);
          setNotifStatus("success");
        } else {
          setOpenNotif(true);
          setNotifStatus("error");
        }
        setNotifText(response.message);
        setModificationModal(false);
    }

    // Add new ground measurement data  to DB
    const addMarkerData = async () => {
        const json_input = {
            "ts": addTs,
            "weather": addWeather,
            "observer": addObserver,
            "marker_value": markerValueRef.current,
            "site_id": cookies.credentials.site_id
        }
        const response = await MarGroundData.InsertSurficialMarkersData(json_input);
        if (response.status == true) {
          initSurficialMarker();
          setOpenNotif(true);
          setNotifStatus("success");
        } else {
          setOpenNotif(true);
          setNotifStatus("error");
        }
        setNotifText(response.message);
        handleClose();
    }

    if (dtRow.length === 0) setDtRow(<span align="center"><Typography>Loading Surficial Data</Typography></span> )

    return (
        <Fragment>
            {/* START Surficial Markers Modal */}
            <Dialog
                open={modificationModal}
                onClose={handleModificationModalClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Manifestation of Movements</DialogTitle>
                <DialogContent>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                        <DateTimePicker
                            autoOk
                            ampm={false}
                            disableFuture
                            value={editableTS}
                            onChange={(date) => { setEditableTS(moment(date).format("YYYY-MM-DD HH:mm:ss")) }}
                            label="Date time"
                            fullWidth
                        />
                    </MuiPickersUtilsProvider>
                    {markerFields}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleModificationModalClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={deleteMarkerData} color="primary">
                        Delete
                    </Button>
                    <Button onClick={updateMarkerData} color="primary" autoFocus>
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
            {/* END Surficial Markers Modal */}

            {/* START Surficial Markers Table */}
            <Container fixed>
                <Grid container align="center" spacing={10}>
                    <Grid item xs={12}>
                        <Paper className={dt_classes.root}>
                            <Table className={dt_classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date and time</TableCell>
                                        {/* // Set table headers (A, B, C, D) */}
                                        {markersTH}
                                        <TableCell>Weather</TableCell>
                                        <TableCell>Nag-sukat</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {dtRow}
                                </TableBody>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    component="div"
                                    count={markerData.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onChangePage={handleChangePage}
                                    onChangeRowsPerPage={handleChangeRowsPerPage}
                                />
                            </Table>
                        </Paper>
                    </Grid>
                    <Grid container align="center" style={{ paddingTop: 20 }}>
                        <Grid item xs={2} />
                        <Grid item xs={3}>
                            {/* Mui floating action button - Add Ground Measurement */}
                            <Fab variant="extended"
                                color="primary"
                                aria-label="add" className={classes.button_fluid}
                                onClick={handleClickOpen}>
                                Add Ground Measurement
                            </Fab>
                        </Grid>
                        <Grid item xs={2}>
                            {/* Mui floating action button - Download */}
                            <Fab variant="extended"
                                color="primary"
                                aria-label="add" className={classes.button_fluid}
                                onClick={handleDownload}>
                                Download
                            </Fab>
                        </Grid>
                        <Grid item xs={2}>
                            {/* Mui floating action button - Print */}
                            <Fab variant="extended"
                                color="primary"
                                aria-label="add" className={classes.button_fluid}
                                onClick={handlePrint}>
                                Print
                            </Fab>
                        </Grid>
                        <Grid item xs={3} />
                    </Grid>
                </Grid>
            </Container>

            {/* Modal for Add Ground Measurement */}
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Ground measurement</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <MuiPickersUtilsProvider utils={MomentUtils}>
                                <DateTimePicker
                                    autoOk
                                    ampm={false}
                                    disableFuture
                                    value={addTs}
                                    onChange={(date) => { setAddTs(moment(date).format("YYYY-MM-DD HH:mm:ss")) }}
                                    label="Date time"
                                    fullWidth
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                        {addMarkerFields}
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="add-weather"
                                label="Weather"
                                type="text"
                                onChange={(e)=> {setAddWeather(e.target.value)}}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="add-observer"
                                label="Nag sukat"
                                type="text"
                                onChange={(e)=> {setAddObserver(e.target.value)}}
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={()=> {addMarkerData()}} color="primary">
                        Confirm
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

export default SurficialMarker