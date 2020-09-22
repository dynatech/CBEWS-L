import React, { Fragment, useState, useRef } from "react";
import moment from "moment";
import {
    Grid,
    Container,
    Fab,
    Button,
    Typography,
    TextField,
    Input,
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

import PDFViewer from "../../reducers/PDFViewer";
import AppConfig from "../../reducers/AppConfig";

import { UmiSensorMaintenance } from "@dynaslope/commons";

import { useStyles, tableStyles } from "../../../styles/general_styles";

import Forms from "../../utils/Forms";
import FabMuiTable from "../../utils/MuiTable";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { useCookies } from "react-cookie";

import { renderToString } from "react-dom/server";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height,
    };
}

export default function MaintenanceLogs() {
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
    const [command, setCommand] = useState("add");

    const [file_to_upload, setFileToUpload] = useState(null);
    const [filename, setFilename] = useState("");
    const [report_attachments, setReportAttachments] = useState([]);

    const formData = useRef();
    const [tableData, setTableData] = useState([]);
    const [events, setEvents] = useState([]);
    const [defaultStringValues, setDefaultStrValues] = useState({
        Remarks: "",
        "Rain Gauge Status": "",
    });
    const [defaultIntValues, setDefaultIntValues] = useState({
        "Working Nodes": 0,
        "Anomalous Nodes": 0,
    });
    const [defaultTSValues, setDefaultTSValues] = useState({
        "Timestamp": moment(),
    });

    const options = {
        filterType: "checkbox",
    };
    const columns = [
        { name: "timestamp", label: "Timestamp" },
        { name: "remarks", label: "Remarks" },
        { name: "working_nodes", label: "Working Nodes" },
        { name: "anomalous_nodes", label: "Anomalous Nodes" },
        { name: "rain_gauge_status", label: "Rain Gauge Status" },
    ];

    const calendarRenderHandler = (args) => {
        const { startStr, endStr } = args;
        const start = moment(startStr).format("YYYY-MM-DD hh:mm:ss");
        const end = moment(endStr).format("YYYY-MM-DD hh:mm:ss");
        getMaintenanceLogsPerMonth(start, end);
    };

    const getMaintenanceLogsPerDay = async (timestamp) => {
        const response = await UmiSensorMaintenance.GetDaySensorMaintenanceLogs(
            timestamp,
        );
        if (response.status === true) {
            setTableData(response.data);
        } else {
            console.error("PROBLEM IN INCIDAY");
        }
    };

    const getMaintenanceLogsPerMonth = async (start, end) => {
        setStartRange(start);
        setEndRange(end);
        const response = await UmiSensorMaintenance.GetMonthSensorMaintenanceLogs(
            start,
            end,
        );
        if (response.status === true) {
            setEvents(
                response.data.map((row) => ({
                    title: row.remarks,
                    date: moment(row.timestamp).format("YYYY-MM-DD"),
                })),
            );
        } else console.error("Problem in getMaintenanceLogsPerMonth backend");
    };

    const handleAdd = () => {
        resetState();
        setOpen(true);
    };

    const handleEdit = (data) => {
        setSelectedData(data);
        setDefaultStrValues({
            Remarks: data["remarks"],
            "Rain Gauge Status": data["rain_gauge_status"],
        });
        setDefaultIntValues({
            "Working Nodes": data["working_nodes"],
            "Anomalous Nodes": data["anomalous_nodes"],
        });
        setDefaultTSValues({
            "Timestamp": data["timestamp"],
        });
        setOpen(true);
        setCommand("edit");
    };

    const handleClose = () => {
        resetState();
        setOpen(false);
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
        const response = await UmiSensorMaintenance.DeleteSensorMaintenanceLogs(input);
        if (response.status === true) {
            getMaintenanceLogsPerMonth(startRange, endRange);
            getMaintenanceLogsPerDay(selectedData.last_ts);
            setOpen(false);
            setOpenDelete(false);
            resetState();
        } else {
            setNotifStatus("error");
        }
        setOpenNotif(true);
        setNotifText(response.message);
    };


    const submit = async () => {
        let json = formData.current;
        json.last_ts = moment().format("YYYY-MM-DD HH:mm:ss");
        let hasModifiedRow = false;
        let response;
        if (!Object.keys(selectedData).length) {
            // ADD
            const temp_ts = {
                timestamp: moment(json["Timestamp"]).format(
                    "YYYY-MM-DD HH:mm:ss",
                ),
            };
            json = Object.assign(defaultStringValues, defaultIntValues, temp_ts, json);
            json.remarks = json.Remarks;
            json.rain_gauge_status = json.RainGaugeStatus;
            json.working_nodes = json.WorkingNodes;
            json.anomalous_nodes = json.AnomalousNodes;
            response = await UmiSensorMaintenance.InsertSensorMaintenanceLogs(json);
        } else {
            // EDIT
            hasModifiedRow = true;
            json.id = selectedData.id;
            let temp_array = [];
            Object.keys(json).forEach((key) => {
                let temp = {};
                switch (key) {
                    case "Timestamp":
                        temp["timestamp"] = json[key];
                        break;
                    case "RainGaugeStatus":
                        temp["rain_gauge_status"] = json[key];
                        break;
                    case "WorkingNodes":
                        temp["working_nodes"] = json[key];
                        break;
                    case "AnomalousNodes":
                        temp["anomalous_nodes"] = json[key];
                        break;
                    default:
                        temp[key.replace(" ", "_").toLocaleLowerCase()] =
                            json[key];
                        break;
                }
                temp_array.push(temp);
            });
            response = await UmiSensorMaintenance.UpdateSensorMaintenanceLogs(
                temp_array,
            );
        }
        if (response.status === true) {
            getMaintenanceLogsPerMonth(startRange, endRange);
            getMaintenanceLogsPerDay(selectedData.timestamp);
            handleClose();
            setNotifStatus("success");
        } else {
            handleClose();
            setNotifStatus("error");
        }
        setOpenNotif(true);
        setNotifText(response.message);
    };

    const resetState = () => {
        setSelectedData({});
        setDefaultStrValues({
            Remarks: "",
            "Rain Gauge Status": "",
        });
        setDefaultIntValues({
            "Working Nodes": 0,
            "Anomalous Nodes": 0,
        });
        setDefaultTSValues({
            "Timestamp": moment(),
        });
    };

    const handleFileSelection = (event) => {
        const file = event.target.files[0];
        setFileToUpload(file);
        setFilename(file.name);
    };

    const handleClickUpload = (ir_id) => async () => {
        const data = new FormData();
        console.log("TO DO");
        // data.append("file", file_to_upload);
        // data.append("ir_id", ir_id);

        // const response = await UmiSensorMaintenance.UploadReportAttachment(data);
        // if (response.status === true) {
        //     handleUploadClose();
        //     setFileToUpload(null);
        //     setFilename("");
        // } else console.error("Problem in click upload");
        // alert(response.message);
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
        setDefaultTSValues({
            "Timestamp": args.date,
        });
        getMaintenanceLogsPerDay(args.date);
    };

    const handleDownloadReport = (html) => async () => {
        const file_date = moment(defaultTSValues["Timestamp"]).format("YYYY-MM-DD");
        console.log("TO DO");
        // const filename = `${file_date}_maintenance_log.pdf`;
        // const response = await UmiSensorMaintenance.RenderPDF(filename, renderToString(html));
        // if (response.status === true) {
        //     UmiSensorMaintenance.DownloadPDF(filename);
        // }
    };

    return (
        <Fragment>
            <Container align="center" justify="center">
                <Grid container spacing={2}>
                    <Grid item xs={7}>
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
                    </Grid>

                    <Grid item xs={5}>
                        <Grid container>
                            <Grid item xs={12} style={{ paddingTop: 40 }}>
                                <PDFViewer
                                    date={defaultTSValues["Timestamp"]}
                                    data={tableData}
                                    dataType="mar_maintenance_report"
                                    classes={classes}
                                    handleDownload={handleDownloadReport}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid item xs={12}>
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
                                * click row to Raise/Modify/Remove Maintenance
                                log data.
                            </Typography>
                        </Grid>
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
                    Maintenance Log
                </DialogTitle>
                <DialogContent>
                    <Forms
                        data={{
                            string: defaultStringValues,
                            int: defaultIntValues,
                            ts: defaultTSValues,
                        }}
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
                        Removing this Maintenance Log data cannot be undone. Are
                        you sure you want to remove this entry?
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
