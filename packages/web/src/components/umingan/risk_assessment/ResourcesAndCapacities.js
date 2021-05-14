import React, { useState, Fragment, useEffect, useRef } from "react";
import {
    Grid,
    Button,
    Paper,
    Typography,
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";
import { useStyles, tableStyles } from "../../../styles/general_styles";

import Forms from "../../utils/Forms";

import moment from "moment";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { useCookies } from "react-cookie";

import FabMuiTable from "../../utils/MuiTable";
import { UmiRiskManagement } from "@dynaslope/commons";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function ResourcesAndCapacities(props) {
    const cmd = "update-delete";
    const { classes } = props;
    const [cookies, setCookie] = useCookies(['credentials']);
    const [tableData, setTableData] = useState([]);

    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [notifStatus, setNotifStatus] = useState('success');
	const [openNotif, setOpenNotif] = useState(false);
    const [notifText, setNotifText] = useState('');

    const [selectedData, setSelectedData] = useState({});
    const [command, setCommand] = useState("Add");
    
    const formData = useRef();
    const [defaultStringValues, setDefaultStrValues] = useState({
        "Resource and Capacities": "",
        "Status": "",
        "Owner": "",
    });
    const [defaultTSValues, setDefaultTSValues] = useState({});
    const [defaultIntValues, setDefaultIntValues] = useState({});

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
        { name: "resource_and_capacities", label: "Resource and Capacity" },
        { name: "status", label: "Status" },
        { name: "owner", label: "Owner" },
        { name: "last_ts", label: "Update Timestamp" },
    ];
    
    useEffect(() => {
        initTable();
    }, []);

    const initTable = async () => {
        const response = await UmiRiskManagement.GetAllResourceAndCapacities();
        if (response.status === true) {
            setTableData(response.data);
        } else {
            console.error("problem retrieving resource and capacity.");
        }
    };

    const resetState = () => {
        setSelectedData({});
        setDefaultStrValues({
            "Resource and Capacities": "",
            "Status": "",
            "Owner": "",
        });
        setCommand("Add");
    };

    const handleAdd = () => {
        resetState();
        setOpen(true);
    };
    const handleEdit = (data) => {
        setSelectedData(data);
        setDefaultStrValues({
            "Resource and Capacities": data["resource_and_capacities"],
            "Status": data["status"],
            "Owner": data["owner"],
        });
        setOpen(true);
        setCommand("edit");
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
        initTable();
        resetState();
    };

    const deleteTableEntry = async (data) => {

        const input = {
            id: data,
        };
        
        const response = await UmiRiskManagement.DeleteResourceAndCapacities(input);
        if (response.status === true) {
            setOpenNotif(true);
            setNotifStatus("success");
            setNotifText("Successfully deleted resource and capacity data.");
        } else {
            setOpenNotif(true);
            setNotifStatus("error");
            setNotifText(
                "Failed to delete resource and capacity data. Please contact the developers or file a bug report",
            );
        }
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
            response = await UmiRiskManagement.InsertResourceAndCapacities(
                json,
            );
        } else {
            // EDIT
            hasModifiedRow = true;
            json.id = selectedData.id;
            json.user_id = cookies.credentials.user_id;
            let temp_array = [];
            Object.keys(json).forEach((key) => {
                let temp = {};
                switch(key) {
                    case 'ResourceandCapacities':
                        temp["resource_and_capacities"] = json[key]
                        break;
                    default:
                        temp[key.replace(" ","_").toLocaleLowerCase()] = json[key]
                        break;
                }
                temp_array.push(temp);
            });
            response = await UmiRiskManagement.UpdateResourceAndCapacities(
                temp_array,
            );
        }
        if (response.status === true) {
            initTable();
            handleClose();
            setOpenNotif(true);
            setNotifStatus("success");
            if (!hasModifiedRow)
                setNotifText(
                    "Successfully added new resource and capacity data.",
                );
            else
                setNotifText(
                    "Successfully updated resource and capacity data.",
                );
        } else {
            handleClose();
            setOpenNotif(true);
            setNotifStatus("error");
            setNotifText(
                "Failed to update capacity and vunerability data. Please review your updates.",
            );
        }
    };

    const confirmDelete = async () => {
        const input = {
            id: selectedData.id,
        };
        const response = await UmiRiskManagement.DeleteResourceAndCapacities(
            input,
        );
        if (response.status === true) {
            initTable();
            setOpen(false);
            setOpenDelete(false);
            resetState();
            setOpenNotif(true);
            setNotifStatus("success");
            setNotifText(
                "Successfully deleted resource and capacity data.",
            );
        } else {
            setOpenNotif(true);
            setNotifStatus("error");
            setNotifText(
                "Failed to delete capacity and vunerability data. Please contact the developers or file a bug report",
            );
        }
    };

    return (
        <Fragment>
            <Grid item xs={12}>
                <Paper elevation={3} className={classes.raPaper}>
                    <Typography variant="h6">
                        Resources and Capacities
                    </Typography>

                    <FabMuiTable
                        classes={{}}
                        addLabel="Resource and Capacity"
                        data={{
                            columns: columns,
                            rows: tableData,
                            options:options,
                        }}
                        handlers={{
                            handleAdd,
                            handleEdit,
                            handleDelete,
                        }}
                        options={options}
                        cmd={cmd}
                    />
                </Paper>
                <br />
            </Grid>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">
                    resource and capacity
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
                        Removing this resource and capacity data cannot be
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
        </Fragment>
    );
}
