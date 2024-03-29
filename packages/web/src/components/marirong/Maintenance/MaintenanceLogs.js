import React, { Fragment, useState, useRef } from "react";
import moment from "moment";
import {
    Grid,
    Container,
    Fab,
    Button,
    Typography,
    TextField,
    Input, Paper, Table,
    TableBody, TableCell, TableHead,
    TableRow, 
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

import { MarMaintenanceLogs } from "@dynaslope/commons";

import { useStyles, tableStyles } from "../../../styles/general_styles";

import Forms from "../../utils/Forms";
import FabMuiTable from "../../utils/MuiTable";
import AttachmentsDialog from '../../reducers/AttachmentsDialog';

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { useCookies } from "react-cookie";

import { renderToString } from "react-dom/server";

import '../../../styles/image-gallery.css';

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
        minWidth: 100,
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
    const [cookies, setCookie] = useCookies(["credentials"]);
    const classes = useStyles();
    const dt_classes = tableStyle();

    const image_ref = useRef();

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
        Type: "",
        Remarks: "",
        "In Charge": "",
        Updater: "",
    });
    const [defaultTSValues, setDefaultTSValues] = useState({
        "Maintenance Date": moment(),
    });

    const options = {
        filter: true,
        selectableRows: "multiple",
        selectableRowsOnClick: true,
        filterType: "checkbox",
        responsive: "vertical",
        onRowsDelete: (rowsDeleted) => {
            const idsToDelete = rowsDeleted.data.map (item => item.dataIndex)
            handleMuiTableBatchDelete(idsToDelete.sort());
          }
    };
    const columns = [
        { name: "maintenance_date", label: "Maintenance Date" },
        {
            name: "type",
            label: "type",
        },
        { name: "in_charge", label: "In Charge" },
        { name: "remarks", label: "Remarks" },
        { name: "updater", label: "Updater" },
        { name: "last_ts", label: "Last TS" },
    ];

    const calendarRenderHandler = (args) => {
        const { startStr, endStr } = args;
        const start = moment(startStr).format("YYYY-MM-DD hh:mm:ss");
        const end = moment(endStr).format("YYYY-MM-DD hh:mm:ss");
        getMaintenanceLogsPerMonth(start, end);
    };

    const getMaintenanceLogsPerDay = async (timestamp) => {
        const response = await MarMaintenanceLogs.GetDayMaintenanceLogs(
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
        const response = await MarMaintenanceLogs.GetMonthMaintenanceLogs(
            start,
            end,
        );
        if (response.status === true) {
            setEvents(
                response.data.map((row) => ({
                    title: row.type,
                    date: moment(row.maintenance_date).format("YYYY-MM-DD"),
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
            Type: data["type"],
            Remarks: data["remarks"],
            "In Charge": data["in_charge"],
            Updater: data["updater"],
        });
        setDefaultTSValues({
            "Maintenance Date": data["maintenance_date"],
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

    const handleMuiTableBatchDelete = (data) => {
        var obj_to_delete = [];
        var toDelete = [];
        
        var temp_data = tableData.map((e, key)=>({
            "row_id": key,
            "id": e.id,
        }))

        for (let index = 0; index < data.length; index++) {
            toDelete = temp_data.filter(e => e.row_id === data[index]);

            if (toDelete.length) {
                obj_to_delete.push(toDelete);
            }
        }
        obj_to_delete = obj_to_delete.flat()
        obj_to_delete.forEach(e => deleteTableEntry(e.id));
        getMaintenanceLogsPerMonth(startRange, endRange);
        getMaintenanceLogsPerDay(selectedData.last_ts);
        resetState();
    };

    const deleteTableEntry = async (data) => {
        const input = {
            id: data,
        }; 
        const response = await MarMaintenanceLogs.DeleteMaintenanceLogs(input);
        if (response.status === true) {
            setOpenNotif(true);
            setNotifStatus("success");
            setNotifText("Successfully deleted maintenance log data.");
        } else {
            setOpenNotif(true);
            setNotifStatus("error");
            setNotifText(
                "Failed to delete maintenance log data. Please contact the developers or file a bug report",
            );
        }
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
        const response = await MarMaintenanceLogs.DeleteMaintenanceLogs(input);
        if (response.status === true) {
            getMaintenanceLogsPerMonth(startRange, endRange);
            getMaintenanceLogsPerDay(selectedData.last_ts);
            setOpen(false);
            setOpenDelete(false);
            resetState();
            setOpenNotif(true);
            setNotifStatus("success");
            setNotifText("Successfully deleted maintenance log data.");
        } else {
            setOpenNotif(true);
            setNotifStatus("error");
            setNotifText(
                "Failed to delete maintenance log data. Please contact the developers or file a bug report",
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
            // ADD
            const temp_ts = {
                maintenance_date: moment(json["MaintenanceDate"]).format(
                    "YYYY-MM-DD HH:mm:ss",
                ),
            };
            json = Object.assign(defaultStringValues, temp_ts, json);
            json.type = json.Type;
            json.remarks = json.Remarks;
            json.in_charge = json.InCharge;
            json.updater = json.Updater;
            response = await MarMaintenanceLogs.InsertMaintenanceLogs(json);
        } else {
            // EDIT
            hasModifiedRow = true;
            json.id = selectedData.id;
            json.user_id = cookies.credentials.user_id;
            let temp_array = [];
            Object.keys(json).forEach((key) => {
                let temp = {};
                switch (key) {
                    case "StatDesc":
                        temp["stat_desc"] = json[key];
                        break;
                    case "MaintenanceDate":
                        temp["maintenance_date"] = json[key];
                        break;
                    case "Type":
                        temp["type"] = json[key];
                        break;
                    case "InCharge":
                        temp["in_charge"] = json[key];
                        break;
                    default:
                        temp[key.replace(" ", "_").toLocaleLowerCase()] =
                            json[key];
                        break;
                }
                temp_array.push(temp);
            });
            response = await MarMaintenanceLogs.UpdateMaintenanceLogs(
                temp_array,
            );
        }
        if (response.status === true) {
            getMaintenanceLogsPerMonth(startRange, endRange);
            getMaintenanceLogsPerDay(selectedData.maintenance_date);
            handleClose();
            setOpenNotif(true);
            setNotifStatus("success");
            if (!hasModifiedRow)
                setNotifText("Successfully added new Maintenance logs data.");
            else setNotifText("Successfully updated Maintenance logs data.");
        } else {
            handleClose();
            setOpenNotif(true);
            setNotifStatus("error");
            setNotifText(
                "Failed to update Maintenance log data. Please review your updates.",
            );
        }
    };

    const resetState = () => {
        setSelectedData({});
        setDefaultStrValues({
            Type: "",
            Remarks: "",
            "In Charge": "",
            Updater: "",
        });
        setDefaultTSValues({
            "Maintenance Date": moment(),
        });
    };

    const handleFileSelection = (event) => {
        const file = event.target.files[0];
        setFileToUpload(file);
        setFilename(file.name);
    };

    const handleClickUpload = async () => {
        const data = new FormData();
        const ir_id = selectedData.id;
        data.append("file", file_to_upload);
        data.append("maintenance_log_id", ir_id);

        const response = await MarMaintenanceLogs.UploadLogAttachments(data);
        if (response.status === true) {
            handleUploadClose();
            setFileToUpload(null);
            setFilename("");
        } else console.error("Problem in click upload");
        alert(response.message);
    };

    const handleClickDeleteUpload = async () => {
        const current_attachment_index = image_ref.current.getCurrentIndex();
        const { original: temp_path } = report_attachments[current_attachment_index];

        const response = await MarMaintenanceLogs.DeleteLogAttachment({
            temp_path,
            maintenance_log_id: selectedData.id
        });
        
        if (response.status) {
            console.log("Delete successful");
            alert("File successfully deleted.");
            handleUploadClose();
            handleUploadOpen(selectedData);
        } else console.error("Delete failed!");
    };

    const download_attachment = () => {
        alert("clicked download attachment!");
    };

    const handleUploadOpen = async (data) => {
        const response = await MarMaintenanceLogs.FetchLogAttachments(parseInt(data.id));
        if (response.status) {
            setReportAttachments(response.data)
            setSelectedData(data);
            setUploadOpen(true);
        } else {
            alert("problem in click upload open");
        }
    };

    const handleUploadClose = () => {
        setFileToUpload(null);
        setFilename("");
        setUploadOpen(false);
    };

    const dateClickHandler = (args) => {
        setDefaultTSValues({
            "Maintenance Date": args.date,
        });
        getMaintenanceLogsPerDay(args.date);
    };

    const handleDownloadReport = (html) => async () => {
        const file_date = moment(defaultTSValues["Maintenance Date"]).format("YYYY-MM-DD");
        const filename = `${file_date}_maintenance_log.pdf`;
        const response = await MarMaintenanceLogs.RenderPDF(filename, renderToString(html));
        if (response.status === true) {
            MarMaintenanceLogs.DownloadPDF(filename);
        }
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
                                    date={defaultTSValues["Maintenance Date"]}
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
                                    options: options,
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
                            int: {},
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

            <AttachmentsDialog
                open={uploadOpen}
                filename={filename}
                handleClose={handleUploadClose}
                attachment_list={report_attachments}
                handleFileSelection={handleFileSelection}
                handleUpload={handleClickUpload}
                handleClickDeleteUpload={handleClickDeleteUpload}
                imageRef={image_ref}
            />
        </Fragment>
    );
}
