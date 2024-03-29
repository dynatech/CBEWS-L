import React, {Fragment, useEffect, useState} from 'react';
import { useCookies } from 'react-cookie';
import {
    Grid, Paper, Container,
    Fab, makeStyles, Table,
    TableBody, TableCell, TableHead,
    TableRow, Box, TextField, Button,
    FormControl, InputLabel, Select, MenuItem
} from "@material-ui/core";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from "moment";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import { MarGroundData, AppConfig } from '@dynaslope/commons';
import { jsPDF } from "jspdf";
import CsvDownloader from 'react-csv-downloader';

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

const default_vars = {
    "alert_level": 1,
    "reason": "",
    "reporter": "",
    "ts": moment().format("YYYY-MM-DD hh:mm:ss")
}

export default function OnDemand() {
    const dt_classes = tableStyle();
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);
    const [rows, setRows] = useState([]);
    const [openRaise, setOpenRaise] = React.useState(false);
    const [od_input, setODInput] = useState(default_vars);

    const [openNotif, setOpenNotif] = useState(false);
    const [notifText, setNotifText] = useState("");
    const [notifStatus, setNotifStatus] = useState('success');
    const [cookies, setCookie] = useCookies(['credentials']);
    const [TableData, setTableData] = useState([]);

    useEffect(() => {
        initOnDemand();
    }, []);

    const initOnDemand = async () => {
        const response = await MarGroundData.GetOnDemandData();
        console.log("response", response);
        if (response.status === true) {
            console.log(response.data);
            
            let data = response.data;
            // Rename keys and Rearrange
            const resultArray = data.map(e => ({
                'Date and time':e.ts,
                'Reporter': e.reporter,
                'Reason for Monitoring': e.reason,
                'Alert Level': e.alert_level, 
            }));

            console.log(resultArray);
            setTableData(resultArray);

            // Populate MUI Table
            setRows(response.data);
            // Disable FetchData success notification
            // setNotifStatus("success");
            // setNotifText(response.message);
            // setOpenNotif(true);
        } else {
            setNotifStatus("error");
            setNotifText(response.message);
            setOpenNotif(true);
        } 
    };

    const handleDownload = () => {
        console.log("pressed download button");
        // return <CSVDownload data={TableData} target="_blank" />;
        // return <CsvDownloader datas={TableData} filename="myfile" />;
    };

    // Print table function
    const handlePrint = () => {
        const pdf = new jsPDF();
        
        // Header (URL, file_type, left_margin, top, width, height)
        pdf.addImage(letter_header,"PNG", 0, 0, 221, 15);
        
        // Title
        pdf.text("On-Demand Monitoring", 40, 25, {align: "center"});

        // On-Demand Table
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

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setODInput(default_vars);   
      setOpen(false);
    };

    const handleClickOpenRaise = row => () => {
        setODInput(row);
        setOpenRaise(true);
    };

    const handleCloseRaise = () => {
        setODInput(default_vars);
        setOpenRaise(false);
      };

    const handleChangeValue = key => event => {
        const { value } = event.target;
        setODInput({
            ...od_input,
            [key]: value
        });
    };

    const dateHandler = data => {
        setODInput({
            ...od_input,
            ts: moment(data).format("YYYY-MM-DD hh:mm:ss")
        });
    };

    const handleSubmit = async () => {
        od_input.site_id = parseInt(cookies.credentials.site_id);
        const response = await MarGroundData.InsertOnDemandData(od_input);
        console.log(response);
        if (response.status === true) {
            handleClose();
            setNotifStatus("success");
            initOnDemand();
        } else {
            setNotifStatus("error");
            console.error(response.message);
        }
        setNotifText(response.message);
        setOpenNotif(true);
    }

    const handleRaise = async () => {
        var raise_input = {
            "site_id": od_input.site_id,
            "timestamp": moment().format("YYYY-MM-DD hh:mm:ss")
        }
        const response = await MarGroundData.RaiseOnDemandAlert(raise_input);
        Alert(JSON.stringify(response));
        if (response.status === true) {
            console.log(response);
            handleCloseRaise();
            setNotifStatus("success");
        } else {
            setODInput(default_vars);
            setNotifStatus("error");
            console.error(response.message);
        }
        setNotifText(response.message);
        setOpenNotif(true);
    };

    return (
        <Fragment>
        <Container fixed>
            <Grid container align="center" spacing={2}>
                <Grid item xs={12}>
                    <Paper className={dt_classes.root}>
                        <Table className={dt_classes.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date and time</TableCell>
                                    <TableCell>Reporter</TableCell>
                                    <TableCell>Reason for Monitoring</TableCell>
                                    <TableCell>Alert Level</TableCell>
                                    {/* <TableCell>Attachments</TableCell> */}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map(row => (
                                    <TableRow key={row.ts} onClick={handleClickOpenRaise(row)}>
                                        <TableCell component="th" scope="row">
                                            {row.ts}
                                        </TableCell>
                                        <TableCell>{row.reporter}</TableCell>
                                        <TableCell>{row.reason}</TableCell>
                                        <TableCell>{row.alert_level}</TableCell>
                                        {/* <TableCell>{row.attachments}</TableCell> */}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Box>
                        * click row to raise on demand.
                    </Box>
                </Grid>
                <Grid container align="center" style={{ paddingTop: 20 }}>
                    <Grid item xs={2} />
                    <Grid item xs={3}>
                        <Fab variant="extended"
                            color="primary"
                            aria-label="add" className={classes.button_fluid}
                            onClick={handleClickOpen}>
                            Add on-demand monitoring
                        </Fab>
                    </Grid>
                    <Grid item xs={3}>
                        <CsvDownloader datas={TableData} filename="On-Demand Monitoring">
                        <Fab variant="extended"
                            color="primary"
                            aria-label="add" className={classes.button_fluid}
                            onClick={handleDownload}>
                            Download
                        </Fab>
                        </CsvDownloader>
                    </Grid>
                    <Grid item xs={3}>
                        <Fab variant="extended"
                            color="primary"
                            aria-label="add" className={classes.button_fluid}
                            onClick={handlePrint}>
                            Print
                        </Fab>
                    </Grid>
                    <Grid item xs={2} />
                </Grid>
            </Grid>
        </Container>
        
        {/* MODAL: Add On-Demand Monitoring */}
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Add On-Demand Monitoring</DialogTitle>
            <DialogContent>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                    <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="MM-DD-YYYY HH:mm:ss"
                        margin="normal"
                        id="date-picker-start"
                        label="Date time"
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                        fullWidth
                        value={od_input.ts}
                        onChange={dateHandler}
                    />
                </MuiPickersUtilsProvider>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Reporter"
                    type="email"
                    fullWidth
                    value={od_input.reporter}
                    onChange={handleChangeValue("reporter")}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Reason for monitoring"
                    type="email"
                    fullWidth
                    value={od_input.reason}
                    onChange={handleChangeValue("reason")}
                />
                <FormControl className={classes.formControl} fullWidth>
                    <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                        Alert Level
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-placeholder-label-label"
                        id="demo-simple-select-placeholder-label"
                        disabled={true}
                        // value={od_input.alert_level}
                        value={"1"}
                        onChange={handleChangeValue("alert_level")}
                    >   
                        <MenuItem value={1}><em>Alert 1</em></MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>

        {/* MODAL: Raise On-demand monitoring? */}
        <Dialog
            open={openRaise}
            onClose={handleCloseRaise}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Raise On-demand monitoring?"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure you want to raise this alert?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseRaise} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleRaise} color="primary" autoFocus>
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
