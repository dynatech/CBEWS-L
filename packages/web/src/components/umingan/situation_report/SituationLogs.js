import React, { Fragment, useState, useRef } from "react";
import moment from "moment";
import {
    Grid,
    Container,
    Fab,
    Button,
    TextField,
    Input
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "../../../../node_modules/@fullcalendar/daygrid/main.css";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";

import AttachmentsGridList from "../../reducers/AttachmentList";

import { UmiSituationReport } from "@dynaslope/commons";

import { useStyles, tableStyles } from "../../../styles/general_styles";

import Forms from "../../utils/Forms";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { useCookies } from "react-cookie";

import { renderToString } from "react-dom/server";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function IncidentLogs() {
    const cmd = "update-delete";
    const [cookies, setCookie] = useCookies(["credentials"]);
    const classes = useStyles();

    const [startRange, setStartRange] = useState("");
    const [endRange, setEndRange] = useState("");

    const [open, setOpen] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);
    const [notifStatus, setNotifStatus] = useState("success");
    const [openNotif, setOpenNotif] = useState(false);
    const [notifText, setNotifText] = useState("");

    const [toUpdate, setToUpdate] = useState(false);
    const [uploadOpen, setUploadOpen] = useState(false);

    const [selectedData, setSelectedData] = useState({});
    const [command, setCommand] = useState("Add");

    const [file_to_upload, setFileToUpload] = useState(null);
    const [filename, setFilename] = useState("");
    const [report_attachments, setReportAttachments] = useState([]);

    const formData = useRef();
    const [tableData, setTableData] = useState([]);
    const [events, setEvents] = useState([]);
    const [defaultStringValues, setDefaultStrValues] = useState({
        "Report Summary": "",
    });
    const [defaultTSValues, setDefaultTSValues] = useState({
        "Report TS": moment(),
    });

    const calendarRenderHandler = (args) => {
        const { startStr, endStr } = args;
        const start = moment(startStr).format("YYYY-MM-DD hh:mm:ss");
        const end = moment(endStr).format("YYYY-MM-DD hh:mm:ss");
        getIncidentLogsPerMonth(start, end);
    };

    const getIncidentLogsPerMonth = async (start, end) => {
        setStartRange(start);
        setEndRange(end);
        // const response = await UmiSituationReport.GetSituationReport(start, end);
        const response = await UmiSituationReport.GetSituationReport();
        if (response.status === true) {
            setEvents(
                response.data.map((row) => ({
                    title: row.report_summary,
                    date: moment(row.report_ts).format("YYYY-MM-DD"),
                    data: row,
                })),
            );
        } else console.error("Problem in getIncidentLogsPerMonth backend");
    };

    const handleAdd = (args) => {
        resetState();
        setDefaultTSValues({
            "Report TS": args.date
        });
        setOpen(true);
    };

    const handleEdit = (info) => {
        info.jsEvent.preventDefault();

        if (info.event.extendedProps) {
            const data = info.event.extendedProps.data;
            console.log(data)
            alert(JSON.stringify(data));
            setSelectedData(data);
            setDefaultStrValues({
                "Report Summary": data["report_summary"],
            });
            setDefaultTSValues({
                "Report TS": data["report_ts"],
            });
            setOpen(true);
            setCommand("edit");
        }
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
    };

    const confirmDelete = async () => {
        const input = {
            id: selectedData.id,
        };
        const response = await UmiSituationReport.DeleteSituationReport(
            input,
        );
        if (response.status === true) {
            getIncidentLogsPerMonth(startRange, endRange);
            setOpen(false);
            setOpenDelete(false);
            resetState();
            setOpenNotif(true);
            setNotifStatus("success");
            setNotifText("Successfully deleted incident log data.");
        } else {
            setOpenNotif(true);
            setNotifStatus("error");
            setNotifText(
                "Failed to delete incident log data. Please contact the developers or file a bug report",
            );
        }
    };

    const submit = async () => {
        let json = formData.current;
        json.user_id = cookies.credentials.user_id;
        json.last_ts = moment().format("YYYY-MM-DD HH:mm:ss");
        let hasModifiedRow = false;
        let response;
        if (!Object.keys(selectedData).length) {
            const temp_ts = {
                report_ts: moment(json["ReportTS"]).format("YYYY-MM-DD HH:mm:ss"),
            };
            json = Object.assign(
                defaultStringValues,
                temp_ts,
                json,
            );
            json.report_summary = json.ReportSummary;
            json.report_ts = moment(json["ReportTS"]).format("YYYY-MM-DD HH:mm:ss");
            json.attachment_path = "n/a";
            response = await UmiSituationReport.InsertSituationReport(
                json,
            );
        } else {
            hasModifiedRow = true;
            json.id = selectedData.id;
            json.user_id = cookies.credentials.user_id;
            let temp_array = [];
            Object.keys(json).forEach((key) => {
                let temp = {};
                switch (key) {
                    case "ReportSummary":
                        temp["report_summary"] = json[key];
                        break;
                    case "ReportTS":
                        temp["report_ts"] = json[key];
                        break;
                    default:
                        temp[key.replace(" ", "_").toLocaleLowerCase()] =
                            json[key];
                        break;
                }
                temp_array.push(temp);
            });
            alert(JSON.stringify(temp_array));
            console.log("temp_array", temp_array);
            response = await UmiSituationReport.UpdateSituationReport(temp_array);
        }
        if (response.status === true) {
            getIncidentLogsPerMonth(startRange, endRange);
            handleClose();
            setOpenNotif(true);
            setNotifStatus("success");
            if (!hasModifiedRow)
                setNotifText("Successfully added new incident logs data.");
            else setNotifText("Successfully updated incident logs data.");
        } else {
            handleClose();
            setOpenNotif(true);
            setNotifStatus("error");
            setNotifText(
                "Failed to update incident log data. Please review your updates.",
            );
        }
    };

    const resetState = () => {
        setSelectedData({});
        setDefaultStrValues({
            "Report Summary": "",
        });
        setDefaultTSValues({
            "Report TS": moment(),
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

        const response = await UmiSituationReport.UploadReportAttachment(data);
        if (response.status === true) {
            handleUploadClose();
            setFileToUpload(null);
            setFilename("");
        } else console.error("Problem in click upload");
        alert(response.message);
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
        handleAdd();
        setDefaultTSValues({
            "Report TS": args.date
        });
    };

    return (
        <Fragment>
            <Container align="center" justify="center">
                <Grid container spacing={2}>
                    <Grid item xs={2} />
                    <Grid item xs={8}>
                        <FullCalendar
                            datesSet={calendarRenderHandler}
                            dateClick={handleAdd}
                            plugins={[
                                dayGridPlugin,
                                timeGridPlugin,
                                interactionPlugin,
                            ]}
                            initialView="dayGridMonth"
                            events={events}
                            eventClick={handleEdit}
                        />
                    </Grid>
                    <Grid item xs={2} />

                    <Grid item xs={12}>
                        <Grid container align="center">
                            <Grid item xs={4} />
                            <Grid item xs={4}>
                                <Fab
                                    variant="extended"
                                    color="primary"
                                    aria-label="add"
                                    className={classes.button_fluid}
                                    onClick={() => setOpen(true)}
                                >
                                    Add Entry
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
                    Situation Logs
                </DialogTitle>
                <DialogContent>
                    <Forms
                        data={{
                            string: defaultStringValues,
                            int: {},
                            ts: defaultTSValues,
                        }}
                        command = {command}
                        formData={formData}
                        closeForm={() => handleClose()}
                        submitForm={() => submit()}
                        deleteForm={() => handleOpenDelete()}
                    />
                </DialogContent>
            </Dialog>

            <Dialog
                open={openDelete}
                onClose={handleCloseDelete}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Are you sure you want to remove this entry?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Removing this Incident Log data cannot be
                        undone. Are you sure you want to remove this entry?
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

            <Snackbar
                open={openNotif}
                autoHideDuration={3000}
                onClose={() => {
                    setOpenNotif(false);
                }}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                key={"top,right"}
            >
                <Alert
                    onClose={() => {
                        setOpenNotif(false);
                    }}
                    severity={notifStatus}
                >
                    {notifText}
                </Alert>
            </Snackbar>

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
                        onClick={handleClickUpload(selectedData.ir_id)}
                        color="primary"
                    >
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}
