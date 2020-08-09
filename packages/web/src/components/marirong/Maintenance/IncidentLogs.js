import React, { Fragment, useState } from "react";
import moment from "moment";
import {
    Container,
    Grid,
    Fab,
    Paper,
    Table,
    Typography,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Button,
    Input,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { makeStyles } from "@material-ui/core/styles";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
// import '../../../../node_modules/@fullcalendar/core/main.css';
import "../../../../node_modules/@fullcalendar/daygrid/main.css";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";

import AttachmentsGridList from "../../reducers/AttachmentList";
import PDFPreviewer from "../../reducers/PDFViewer";
import AppConfig from "../../reducers/AppConfig";
import { useCookies } from "react-cookie";

import { MarMaintenanceLogs } from "@dynaslope/commons";

const imageStyle = makeStyles((theme) => ({
    img_size: {
        height: "100%",
        width: "100%",
    },
    summary_content: {
        minHeight: 500,
    },
}));

const summaryStyle = makeStyles((theme) => ({
    content: {
        minHeight: getWindowDimensions().height * 0.415,
        maxHeight: getWindowDimensions().height * 0.415,
    },
}));

const generalStyle = makeStyles((theme) => ({
    button_fluid: {
        width: "90%",
        padding: 10,
    },
}));

const tableStyle = makeStyles((theme) => ({
    root: {
        width: "100%",
        marginTop: theme.spacing(3),
        overflowX: "auto",
    },
    table: {
        minWidth: 650,
    },
}));

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height,
    };
}

const defaultVars = {
    incident_date: moment().format("YYYY-MM-DD hh:mm:ss"),
    incident_report_narrative: "",
    reporter: "",
    // attachment: "",
    site_id: 29,
};

export default function IncidentLogs() {
    const [cookies, setCookie] = useCookies(["credentials"]);
    const img = imageStyle();
    const summary = summaryStyle();
    const classes = generalStyle();
    const dt_classes = tableStyle();

    const [flag, setFlag] = useState(true);
    const [startRange, setStartRange] = useState("");
    const [endRange, setEndRange] = useState("");
    const [rows, setRows] = useState([]);
    const [events, setEvents] = useState([]);
    const [dialog_vars, setDialogVars] = useState({
        ...defaultVars,
        user_id: cookies.credentials.user_id,
    });
    const [toUpdate, setToUpdate] = useState(false);
    const [uploadOpen, setUploadOpen] = useState(false);

    const [file_to_upload, setFileToUpload] = useState(null);
    const [filename, setFilename] = useState("");
    const [report_attachments, setReportAttachments] = useState([]);

    const getIncidentLogsPerDay = async (timestamp) => {
        const response = await MarMaintenanceLogs.GetDayIncidentLogs(timestamp);
        console.log("response", response);
        if (response.status === true) {
            setRows(response.data);
        } else {
            console.error("PROBLEM IN INCIDAY");
        }
    };

    const getIncidentLogsPerMonth = async (start, end) => {
        setStartRange(start);
        setEndRange(end);
        const response = await MarMaintenanceLogs.GetMonthIncidentLogs(
            start,
            end,
        );
        console.log("response", response);
        if (response.status === true) {
            setEvents(
                response.data.map((row) => ({
                    title: row.reporter,
                    date: moment(row.incident_date).format("YYYY-MM-DD"),
                })),
            );
        } else console.error("Problem in getIncidentLogsPerMonth backend");
    };

    const addIncidentReport = async (payload) => {
        payload.user_id = cookies.credentials.user_id;
        const data = new FormData();
        data.append("file", "");
        data.append("incident_date", payload.incident_date);
        console.log("formdata", data);

        const response = await MarMaintenanceLogs.InsertIncidentLogs(payload);
        if (response.status === true) {
            getIncidentLogsPerMonth(startRange, endRange);
            getIncidentLogsPerDay(payload.incident_date);
            handleClose();
        } else console.error("Problem in addIncidentReport backend");
        alert(response.message);
    };

    const updateIncidentReport = async (temp_payload) => {
        const payload = {
            ...temp_payload,
            site_id: cookies.credentials.site_id,
        };
        payload.user_id = cookies.credentials.user_id;
        const response = await MarMaintenanceLogs.UpdateIncidentLogs(payload);
        if (response.status === true) {
            getIncidentLogsPerMonth(startRange, endRange);
            getIncidentLogsPerDay(temp_payload.incident_date);
            handleClose();
        } else console.error("Problem in updateIncidentReport backend");
        alert(response.message);
    };

    const deleteIncidentReport = async (payload) => {
        payload.user_id = cookies.credentials.user_id;
        const response = await MarMaintenanceLogs.DeleteIncidentLogs(
            payload.id,
        );
        if (response.status === true) {
            getIncidentLogsPerMonth(startRange, endRange);
            getIncidentLogsPerDay(payload.incident_date);
            handleConfirmClose();
        } else console.error("Problem in deleteIncidentReport backend");
        alert(response.message);
    };

    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleClickOpen = () => {
        setDialogVars(defaultVars);
        setToUpdate(false);
        setOpen(true);
    };

    const handleClose = () => {
        setDialogVars(defaultVars);
        setToUpdate(false);
        setOpen(false);
    };

    const handleConfirmClose = () => {
        setDialogVars(defaultVars);
        setConfirmOpen(false);
        setToUpdate(false);
    };

    const handleUploadOpen = () => {
        setUploadOpen(true);
    };

    const handleUploadClose = () => {
        setFileToUpload(null);
        setFilename("");
        setUploadOpen(false);
    };

    const dateClickHandler = (args) => {
        console.log("date clicked");
        getIncidentLogsPerDay(args.date);
    };

    const calendarRenderHandler = (args) => {
        const { startStr, endStr } = args;
        const start = moment(startStr).format("YYYY-MM-DD hh:mm:ss");
        const end = moment(endStr).format("YYYY-MM-DD hh:mm:ss");
        getIncidentLogsPerMonth(start, end);
    };

    const handleSubmit = () => {
        const payload = dialog_vars;
        if (toUpdate) updateIncidentReport(payload);
        else addIncidentReport(payload);
    };

    const handleDelete = () => {
        const payload = dialog_vars;
        deleteIncidentReport(payload);
    };

    const dateHandler = (data) => {
        setDialogVars({
            ...dialog_vars,
            incident_date: moment(data).format("YYYY-MM-DD hh:mm:ss"),
        });
    };

    const changeHandler = (key) => (event) => {
        const { value } = event.target;
        setDialogVars({
            ...dialog_vars,
            [key]: value,
        });
    };

    const handleFileSelection = (event) => {
        const file = event.target.files[0];
        setFileToUpload(file);
        setFilename(file.name);
    };

    const handleClickUpload = (ir_id) => async () => {
        const data = new FormData();
        data.append("file", file_to_upload);
        data.append("ir_id", ir_id);

        const response = await MarMaintenanceLogs.UploadReportAttachment(data);
        if (response.status === true) {
            handleUploadClose();
            setFileToUpload(null);
            setFilename("");
        } else console.error("Problem in click upload");
        alert(response.message);
    };

    const rowClickHandler = (key, data) => async () => {
        setToUpdate(true);
        setDialogVars(data);
        if (key === "edit") {
            data.user_id = cookies.credentials.user_id;
            const response = await MarMaintenanceLogs.UpdateIncidentLogs(data);
            if (response.status === true) {
                console.log("response", response);
                setReportAttachments(response.data);
                setOpen(true);
            }
        } else setConfirmOpen(true);
    };

    return (
        <Fragment>
            <Container align="center" justify="center">
                <Grid container spacing={2}>
                    <Grid item xs={7}>
                        {/* <FullCalendar
                            datesRender={calendarRenderHandler}
                            dateClick={dateClickHandler}
                            events={events}
                            defaultView="dayGridMonth"
                            plugins={[dayGridPlugin, interactionPlugin]}
                        /> */}
                        <FullCalendar
                            datesSet={calendarRenderHandler}
                            dateClick={dateClickHandler}
                            plugins={[
                                dayGridPlugin,
                                timeGridPlugin,
                                interactionPlugin,
                            ]}
                            initialView="dayGridMonth"
                            events={events}
                        />
                        {console.log("FullCalendar", <FullCalendar />)}
                    </Grid>

                    {rows.length > 0 && (
                        <Grid item xs={5}>
                            <Grid container>
                                <PDFPreviewer
                                    data={rows}
                                    dataType="incident_report"
                                />
                                <Grid item xs={12}>
                                    <Grid
                                        container
                                        align="center"
                                        style={{ paddingTop: 20 }}
                                    >
                                        <Grid item xs={3} />
                                        <Grid item xs={3}>
                                            <Fab
                                                variant="extended"
                                                color="primary"
                                                aria-label="add"
                                                className={classes.button_fluid}
                                                onClick={() => {}}
                                            >
                                                Download
                                            </Fab>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Fab
                                                variant="extended"
                                                color="primary"
                                                aria-label="add"
                                                className={classes.button_fluid}
                                                onClick={() => {}}
                                            >
                                                Print
                                            </Fab>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <ReportTable
                            rows={rows}
                            rowClickHandler={rowClickHandler}
                        />
                    </Grid>
                    <Grid item xs={12}></Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={4} />
                            <Grid item xs={4}>
                                <Fab
                                    variant="extended"
                                    color="primary"
                                    aria-label="add"
                                    className={classes.button_fluid}
                                    onClick={handleClickOpen}
                                >
                                    Add Incident report
                                </Fab>
                            </Grid>
                            <Grid item xs={4} />
                        </Grid>
                    </Grid>
                </Grid>
            </Container>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">
                    Incident Report
                </DialogTitle>
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
                                "aria-label": "change date",
                            }}
                            fullWidth
                            value={dialog_vars.incident_date}
                            onChange={dateHandler}
                        />
                    </MuiPickersUtilsProvider>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="incident_report_narrative"
                        label="Incident Report Narrative"
                        type="email"
                        fullWidth
                        value={dialog_vars.incident_report_narrative}
                        onChange={changeHandler("incident_report_narrative")}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="reporter"
                        label="Reporter"
                        type="email"
                        fullWidth
                        value={dialog_vars.reporter}
                        onChange={changeHandler("reporter")}
                    />
                    {toUpdate ? (
                        <Container align="center">
                            <AttachmentsGridList data={report_attachments} />
                            <Fab
                                variant="extended"
                                color={"primary"}
                                aria-label="add"
                                onClick={handleUploadOpen}
                            >
                                Upload Attachments
                            </Fab>
                        </Container>
                    ) : (
                        <Typography>
                            You can attach files after saving the log.
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        {toUpdate ? "Update Log" : "Add Log"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={confirmOpen}
                onClose={handleConfirmClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">
                    Incident Report
                </DialogTitle>
                <DialogContent>
                    <Typography>Do you want to delete this report?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="primary">
                        Confirm Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={uploadOpen}
                onClose={handleUploadClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">File upload</DialogTitle>
                <DialogContent>
                    <Grid container>
                        <Grid item xs={8}>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="File path"
                                type="email"
                                fullWidth
                                value={filename}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <Input
                                name="file"
                                type="file"
                                onChange={handleFileSelection}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleUploadClose} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleClickUpload(dialog_vars.ir_id)}
                        color="primary"
                    >
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}

function ReportTable(props) {
    const { rows, rowClickHandler } = props;
    console.log("rows", rows);
    const dt_classes = tableStyle();
    return (
        <Paper className={dt_classes.root}>
            <Table className={dt_classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell>Actions</TableCell>
                        <TableCell>Date and time</TableCell>
                        <TableCell>Incident Desc / Narrative</TableCell>
                        <TableCell>Reporter</TableCell>
                        {/* <TableCell>Has Attachments</TableCell> */}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.incident_date}>
                            <TableCell>
                                <Button
                                    onClick={rowClickHandler("edit", row)}
                                    color="primary"
                                >
                                    {/* Edit */}
                                    <EditIcon />
                                </Button>
                                <Button
                                    onClick={rowClickHandler("delete", row)}
                                    color="primary"
                                >
                                    {/* Delete */}
                                    <DeleteIcon />
                                </Button>
                            </TableCell>
                            <TableCell component="th" scope="row">
                                {row.incident_date}
                            </TableCell>
                            <TableCell>
                                {row.incident_report_narrative}
                            </TableCell>
                            <TableCell>{row.reporter}</TableCell>
                            {/* <TableCell>{[]}</TableCell> */}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}
