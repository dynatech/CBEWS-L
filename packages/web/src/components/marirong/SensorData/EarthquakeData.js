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
import AppConfig from '../../reducers/AppConfig';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import { MarSensorData } from '@dynaslope/commons';

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

export default function EarthquakeData() {
    const dt_classes = tableStyle();
    const classes = useStyles();

    const [rows, setRows] = useState([]);

    const [openNotif, setOpenNotif] = useState(false);
    const [notifText, setNotifText] = useState("");
    const [notifStatus, setNotifStatus] = useState('success');

    useEffect(() => {
        initEarthquakeData();
    }, []);

    const initEarthquakeData = async () => {
        const response = await MarSensorData.GetEarthquakeData();
        console.log("response", response);
        if (response.status === true) {
            setRows(response.data);
            setNotifStatus("success");
        } else {
            setNotifStatus("error");
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
                                    <TableRow key={row.ts}>
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
