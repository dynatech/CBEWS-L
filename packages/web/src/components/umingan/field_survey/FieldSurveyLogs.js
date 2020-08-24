import React, { useState, Fragment, useEffect, useRef } from "react";
import { Grid, Button, Paper, Typography } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";

import Forms from "../../utils/Forms";

import moment from "moment";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { useCookies } from "react-cookie";

import FabMuiTable from "../../utils/MuiTable";
import { UmiRiskManagement } from "@dynaslope/commons";
import { UmiFieldSurvey } from '@dynaslope/commons';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function FieldSurveyLogs(props) {
    const cmd = "update-delete";
    const { classes } = props;
    const [cookies, setCookie] = useCookies(["credentials"]);
    const [tableData, setTableData] = useState([]);

    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [notifStatus, setNotifStatus] = useState("success");
    const [openNotif, setOpenNotif] = useState(false);
    const [notifText, setNotifText] = useState("");

    const [selectedData, setSelectedData] = useState({});
    const [command, setCommand] = useState("add");

    const formData = useRef();
    const [defaultStringValues, setDefaultStrValues] = useState({
        'Reporter': '',
        'Report Narrative': '',
        'Feature': '',
        'Exposure': '',
        'Mechanism': '',
        'Materials Characterization': '',
    });
    const [defaultTSValues, setDefaultTSValues] = useState({
        'Report Date': moment(),
    });
    const [defaultIntValues, setDefaultIntValues] = useState({});

    const options = {
        filterType: "checkbox",
        // selectAllDisabled: true
    };
    const columns = [
        { name: "report_date", label: "Report Date" },
        { name: "reporter", label: "Reporter" },
        { name: "report_narrative", label: "Report Narrative" },
        { name: "feature", label: "Feature" },
        { name: "exposure", label: "Exposure" },
        { name: "mechanism", label: "Mechanism" },
        { name: "materials_characterization", label: "Mat. Characterization" },
    ];

    useEffect(() => {
        initTable();
    }, []);

    const initTable = async () => {
        const response = await UmiFieldSurvey.GetFieldSurveyLogs();
        console.log("response", response);
        if (response.status === true) {
            setTableData(response.data);
        } else {
            console.error("problem retrieving risk summary");
        }
        // const response = await UmiRiskManagement.GetAllSummary();
        // if (response.status === true) {
        //     setTableData(response.data);
        // } else {
        //     console.error("problem retrieving risk summary");
        // }
    };

    const resetState = () => {
        setSelectedData({});
        setDefaultStrValues({
            'Reporter': '',
            'Report Narrative': '',
            'Feature': '',
            'Exposure': '',
            'Mechanism': '',
            'Materials Characterization': '',
        });
        setDefaultTSValues({
            'Report Date': moment(),
        })
        setCommand("add");
    };

    const handleAdd = () => {
        resetState();
        setOpen(true);
    };
    const handleEdit = (data) => {
        setSelectedData(data);
        setDefaultStrValues({
            'Reporter': data['reporter'],
            'Report Narrative': data['report_narrative'],
            'Feature': data['feature'],
            'Exposure': data['exposure'],
            'Mechanism': data['mechanism'],
            'Materials Characterization': data['materials_characterization'],
        });
        setDefaultTSValues({
            'Report Date': moment(data['report_date']),
        });
        setOpen(true);
        setCommand("edit");
    };
    const handleDelete = (data) => {
        setSelectedData(data);
        handleOpenDelete();
    };

    const handleOpenDelete = () => {
        setOpen(false);
        setOpenDelete(true);
    };

    const handleClose = () => {
        setOpen(false);
        resetState();
    };

    const handleCloseDelete = () => {
        setOpenDelete(false);
        resetState();
    };

    const submit = async () => {
        let json = formData.current;
        console.log("json", json);
        json.user_id = cookies.credentials.user_id;
        json.last_ts = moment().format("YYYY-MM-DD HH:mm:ss");
        let hasModifiedRow = false;
        let response;
        if (!Object.keys(selectedData).length) {
            json = Object.assign(
                defaultStringValues,
                defaultIntValues,
                defaultTSValues,
                json,
            );
            json.exposure = json["Exposure"]
            json.materials_characterization = json["MaterialsCharacterization"]
            json.mechanism = json["Mechanism"]
            json.report_narrative = json["ReportNarrative"]
            json.report_date = moment(json["Report Date"]).format("YYYY-MM-DD HH:mm:ss");
            json.reporter = json["Reporter"]
            json.feature = json["Feature"]
            json.attachment_path = "n/a"
            response = await UmiFieldSurvey.InsertFieldSurveyLogs(json);
        } else {
            // EDIT
            hasModifiedRow = true;
            json.id = selectedData.id;
            json.user_id = cookies.credentials.user_id;
            json.last_ts = moment().format("YYYY-MM-DD HH:mm:ss");
            json.attachment_path = "n/a";
            let temp_array = [];
            console.log("json", json);
            Object.keys(json).forEach((key) => {
                let temp = {};
                switch (key) {
                    case "Exposure":
                        temp["exposure"] = json[key]
                        break;
                    case "MaterialsCharacterization":
                        temp["materials_characterization"] = json[key]
                        break;
                    case "Mechanism":
                        temp["mechanism"] = json[key]
                        break;
                    case "ReportNarrative":
                        temp["report_narrative"] = json[key]
                        break;
                    case "Report Date":
                        temp["report_date"] = moment(json[key]).format("YYYY-MM-DD HH:mm:ss");
                        break;
                    case "Reporter":
                        temp["reporter"] = json[key]
                        break;
                    case "Feature":
                        temp["feature"] = json[key]
                        break;
                    default:
                        temp[key.replace(" ", "_").toLocaleLowerCase()] = json[key];
                        break;
                }
                temp_array.push(temp);
            });
            response = await UmiFieldSurvey.UpdateFieldSurveyLogs(temp_array);
        }
        if (response.status === true) {
            initTable();
            handleClose();
            setOpenNotif(true);
            setNotifStatus("success");
            if (!hasModifiedRow)
                setNotifText("Successfully added new risk summary.");
            else setNotifText("Successfully updated risk summary.");
        } else {
            handleClose();
            setOpenNotif(true);
            setNotifStatus("error");
            setNotifText(
                "Failed to update risk summary. Please review your updates.",
            );
        }
    };

    const confirmDelete = async () => {
        const input = {
            id: selectedData.id,
        };
        const response = await UmiFieldSurvey.DeleteFieldSurveyLogs(input);
        if (response.status === true) {
            initTable();
            setOpen(false);
            setOpenDelete(false);
            resetState();
            setOpenNotif(true);
            setNotifStatus("success");
            setNotifText("Successfully deleted risk summary.");
        } else {
            setOpenNotif(true);
            setNotifStatus("error");
            setNotifText(
                "Failed to delete risk summary. Please contact the developers or file a bug report",
            );
        }
    };

    return (
        <Fragment>
            <Grid item xs={12}>
                <FabMuiTable
                    classes={{}}
                    addLabel="Field Survey Log"
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
                <br />
            </Grid>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Field Survey Logs</DialogTitle>
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
                        command={command}
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
                        Removing this risk summary cannot be undone. Are you sure
                        you want to remove this entry?
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
        </Fragment>
    );
}
