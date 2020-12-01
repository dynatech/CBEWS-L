import React, {Fragment, useState, useEffect} from 'react';
import {
    Grid, Paper, Container,
    Fab, Table,
    TableBody, TableCell, TableHead,
    TableRow, TextField, Button, Typography
} from "@material-ui/core";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import { useStyles, tableStyles } from '../../styles/general_styles';
import { AppConfig } from '@dynaslope/commons';

import {
    MuiPickersUtilsProvider,
    DateTimePicker,
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { useCookies } from 'react-cookie';

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function CapacityAndVulerability() {
    function createData(date_time, resource, quantity, status_description, owner, in_charge, updater) {
        return { date_time, resource, quantity, status_description, owner, in_charge, updater };
    }

    const rows = [
        createData('2019-10-22 04:00:00','Megaphone', '6', 'working', 'Carlo Bontia','John Geliberte','Tine Dumagan'),
        createData('2019-10-22 04:00:00','Two-way radio', '2', 'working', 'Carlo Bontia','John Geliberte','Tine Dumagan'),
        createData('2019-10-22 04:00:00','Batingting', '1', 'broken', 'Carlo Bontia','John Geliberte','Tine Dumagan'),
        createData('2019-10-22 04:00:00','Sirena', '5', 'working', 'Carlo Bontia','John Geliberte','Tine Dumagan'),
        createData('2019-10-22 04:00:00','Cellphone', '10', 'broken', 'Carlo Bontia','John Geliberte','Tine Dumagan'),
        createData('2019-10-22 04:00:00','Landline', '2', 'working', 'Carlo Bontia','John Geliberte','Tine Dumagan'),
    ];
    const dt_classes = tableStyles();
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);
    const [cavContainer, setCavContainer] = useState([]);
    const [cavID, setCavID] = useState(0);
    const [datetime, setDatetime] = useState(moment(new Date()).format("YYYY-MM-DD HH:mm:ss"));
    const [resource, setResource] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [statDesc, setStateDesc] = useState('');
    const [owner, setOwner] = useState('');
    const [incharge, setIncharge] = useState('');
    const [updater, setUpdater] = useState('');
    const [cmd, setCmd] = useState('add');

    const [notifStatus, setNotifStatus] = useState('success');
	const [openNotif, setOpenNotif] = useState(false);
    const [notifText, setNotifText] = useState('');
    const [cookies, setCookie] = useCookies(['credentials']);
    
    useEffect(()=> {
        initCaV(cookies.credentials.site_id, "all");
    },[]);

    const initCaV = (site_id = 29, cav_id = "all") => {
        fetch(`${AppConfig.HOSTNAME}/api/cra/capacity_and_vulnerability/fetch/${site_id}/${cav_id}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then((response) => response.json())
            .then((responseJson) => {
                setCavContainer(responseJson)
            })
            .catch((error) => {
                console.log(error);
            }
        );
    }

    const handleAddOpen = () => {
        setCmd('add')
        setOpen(true);
    };

    const handleModifyOpen = (data) => {
        setCmd('update')
        setCavID(data.cav_id)
        setDatetime(data.datetime)
        setResource(data.resource)
        setQuantity(data.quantity)
        setStateDesc(data.stat_desc)
        setOwner(data.owner)
        setIncharge(data.incharge)
        setUpdater(data.updater)
        setOpen(true);
    }

    const resetState = () => {
        setCmd('add')
        setCavID(0)
        setDatetime(moment(new Date()).format("YYYY-MM-DD HH:mm:ss"))
        setResource('')
        setQuantity(0)
        setStateDesc('')
        setOwner('')
        setIncharge('')
        setUpdater('')
    }
  
    const handleClose = () => {
      setOpen(false);
      resetState();
    };

    const handleCloseDelete = () => {
        setOpen(true);
        setOpenDelete(false);
    }

    const deleteCaV = () => {
        setOpen(false);
        setOpenDelete(true);
    }

    const confirmDelete = () => {
        fetch(`${AppConfig.HOSTNAME}/api/cra/capacity_and_vulnerability/remove`, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "cav_id": cavID,
                "site_id": cookies.credentials.site_id
            }),
            }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status === true) {
                    initCaV();
                    setOpen(false);
                    setOpenDelete(false);
                    resetState();
                    setOpenNotif(true);
                    setNotifStatus("success");
                    setNotifText("Successfully deleted capacity and vulnerability data.");
                } else {
                    setOpenNotif(true);
                    setNotifStatus("error");
                    setNotifText("Failed to delete capacity and vunerability data. Please contact the developers or file a bug report");
                }
            })
            .catch((error) => {
                setOpenNotif(true);
                setNotifStatus("error");
                setNotifText(`ERROR: ${error}`);
            }
        );
    }

    const submitCaV = () => {
        let json = '';
        if (cmd === "add") {
            json = {
                "datetime": datetime,
                "resource": resource,
                "quantity": quantity,
                "status": statDesc,
                "owner": owner,
                "incharge": incharge,
                "updater": updater,
                "user_id": cookies.credentials.user_id,
                "site_id": cookies.credentials.site_id
            }
        } else if (cmd === "update") {
            json = {
                "cav_id": cavID,
                "datetime": datetime,
                "resource": resource,
                "quantity": quantity,
                "status": statDesc,
                "owner": owner,
                "incharge": incharge,
                "updater": updater,
                "user_id": cookies.credentials.user_id,
                "site_id": cookies.credentials.site_id
            }
        } else {
            return;
        }
        fetch(`${AppConfig.HOSTNAME}/api/cra/capacity_and_vulnerability/${cmd}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(json),
            }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status === true) {
                    initCaV();
                    handleClose();
                    setOpenNotif(true);
                    setNotifStatus("success");
                    if (cmd=="add") {
                        setNotifText("Successfully added new capacity and vulnerability data.");
                    } else {
                        setNotifText("Successfully updated capacity and vulnerability data.");
                    }
                    
                } else {
                    setOpenNotif(true);
                    setNotifStatus("error");
                    setNotifText("Failed to update capacity and vunerability data. Please review your updates.");
                }
            })
            .catch((error) => {
                setOpenNotif(true);
                setNotifStatus("error");
                setNotifText(`ERROR: ${error}`);
            }
        );
    }

    return (
        <Fragment>
        <Container fixed>
            <Grid container align="center" spacing={2}>
                <Grid item xs={12}>
                    <Paper className={dt_classes.root}>
                        <Table className={dt_classes.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date time</TableCell>
                                    <TableCell>Resource</TableCell>
                                    <TableCell>Quantity</TableCell>
                                    <TableCell>Status/Description</TableCell>
                                    <TableCell>Owner</TableCell>
                                    <TableCell>In-Charge</TableCell>
                                    <TableCell>Updater</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cavContainer.map(row => (
                                    <TableRow key={row.datetime} onClick={()=> {handleModifyOpen(row)}}>
                                        <TableCell component="th" scope="row">
                                            {row.datetime}
                                        </TableCell>
                                        <TableCell>{row.resource}</TableCell>
                                        <TableCell>{row.quantity}</TableCell>
                                        <TableCell>{row.stat_desc}</TableCell>
                                        <TableCell>{row.owner}</TableCell>
                                        <TableCell>{row.incharge}</TableCell>
                                        <TableCell>{row.updater}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="subtitle2">
                        * click row to Raise/Modify/Remove Capacity and Vulnerability data.
                    </Typography>
                </Grid>
                <Grid container align="center">
                    <Grid item xs={4} />
                    <Grid item xs={4}>
                        <Fab variant="extended"
                            color="primary"
                            aria-label="add" className={classes.button_fluid}
                            onClick={handleAddOpen}>
                            Add Entry
                        </Fab>
                    </Grid>
                    <Grid item xs={4} />
                </Grid>
            </Grid>
        </Container>

        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Capacity and Vulnerability</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <MuiPickersUtilsProvider utils={MomentUtils}>
                            <DateTimePicker
                                autoOk
                                style={{paddingTop: 5}}
                                ampm={false}
                                disableFuture
                                value={datetime}
                                onChange={(date) => { setDatetime(moment(date).format("YYYY-MM-DD HH:mm:ss")) }}
                                label="Date time"
                                fullWidth
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="resource"
                            label="Resource"
                            value={resource}
                            onChange={(e) => {setResource(e.target.value);}}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            autoFocus
                            inputProps={{
                                maxLength: 10,
                                type: 'number'
                              }}
                            margin="dense"
                            id="quantity"
                            label="Quantity"
                            value={quantity}
                            onChange={(e) => {setQuantity(e.target.value)}}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            autoFocus
                            inputProps={{
                                maxLength: 40
                              }}
                            margin="dense"
                            id="owner"
                            label="Owner"
                            value={owner}
                            onChange={(e) => {setOwner(e.target.value)}}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            autoFocus
                            multiline
                            rowsMax={5}
                            inputProps={{
                                maxLength: 200
                              }}
                            margin="dense"
                            id="stat-desc"
                            label="Status / Description"
                            value={statDesc}
                            onChange={(e) => {setStateDesc(e.target.value)}}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            autoFocus
                            inputProps={{
                                maxLength: 40
                              }}
                            margin="dense"
                            id="in-charge"
                            label="In-charge"
                            value={incharge}
                            onChange={(e) => {setIncharge(e.target.value)}}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            autoFocus
                            inputProps={{
                                maxLength: 40
                              }}
                            margin="dense"
                            id="updater"
                            label="Updater"
                            value={updater}
                            onChange={(e) => {setUpdater(e.target.value)}}
                            fullWidth
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} color="primary">
                Cancel
            </Button>
            {
                cmd === "update" ? 
                    <Button onClick={deleteCaV} color="primary">
                        Delete
                    </Button>
                :
                <div></div>
            }
            <Button onClick={submitCaV} color="primary">
                Confirm
            </Button>
            </DialogActions>
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

export default CapacityAndVulerability