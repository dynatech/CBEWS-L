import React, { Fragment, useState, useEffect } from "react";
import Container from "@material-ui/core/Container";
import {
    Grid,
    Fab,
    TextField,
    Button,
} from "@material-ui/core/";
import { useStyles } from "../../../styles/general_styles";

import {
    Magnifier,
    GlassMagnifier,
    SideBySideMagnifier,
    PictureInPictureMagnifier,
    MOUSE_ACTIVATION,
    TOUCH_ACTIVATION,
} from "react-image-magnifiers";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

import { MarCommunityRiskAssessment, AppConfig } from "@dynaslope/commons";

import PhotoAttachmentList from '../../reducers/PhotoAttachmentList';


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function HazardMaps() {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [mapPreview, setMapPreview] = useState([]);
    const [map_list, setMapList] = useState([]);
    const [fileToUpload, setFileToUpload] = useState();
    const [filename, setFilename] = useState("");

    const [notifStatus, setNotifStatus] = useState("success");
    const [openNotif, setOpenNotif] = useState(false);
    const [notifText, setNotifText] = useState("");

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        initHazardMaps();
    }, []);

    const initHazardMaps = async () => {
        const response = await MarCommunityRiskAssessment.GetHazardMaps();
        if (response.status) {
            if (response.data.length > 0) {
                setMapPreview(`${AppConfig.HOST_DIR}:5001/src/client-cbewsl/MARIRONG/MAPS/${response.data[0].filename}`);

                const response2 = await MarCommunityRiskAssessment.GetHazardMapsGallery();
                if (response2.status) setMapList(response2.data);
            } else {
                console.error(response.message);
            }
        }
    };

    const handleFileSelection = (event) => {
        const file = event.target.files[0];
        setFileToUpload(file);
        setFilename(file.name);
    };

    const handleUpload = async () => {
        const data = new FormData();
        data.append("file", fileToUpload);
        const response = await MarCommunityRiskAssessment.UploadHazardMaps(
            data,
        );
        if (response.status === true) {
            initHazardMaps();
            handleClose();
            setFileToUpload(null);
            setFilename("");
            setOpenNotif(true);
            setNotifStatus("success");
            setNotifText("Successfully uploaded new hazard map");
        } else {
            setOpenNotif(true);
            setNotifStatus("error");
            setNotifText("Error uploading new hazard map");
        }
    };

    return (
        <Fragment>
            <Container className={classes.img_container}>
                <Grid container spacing={2} align="center">
                    <Grid item xs={12} />
                    <Grid item xs={12}>
                        <div>
                            <PhotoAttachmentList data={map_list} />
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <Fab
                            variant="extended"
                            color={"primary"}
                            aria-label="add"
                            onClick={handleClickOpen}
                        >
                            Upload map
                        </Fab>
                    </Grid>
                    <hr />
                </Grid>
            </Container>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">File upload</DialogTitle>
                <DialogContent>
                    <Grid container>
                        <Grid item xs={8}>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="filename"
                                label="File path"
                                value={filename}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <input
                                accept="image/*"
                                style={{ display: "none" }}
                                id="raised-button-file"
                                multiple
                                type="file"
                                onChange={handleFileSelection}
                            />
                            <label htmlFor="raised-button-file">
                                <Button
                                    variant="raised"
                                    component="span"
                                    color="primary"
                                >
                                    Browse
                                </Button>
                            </label>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleUpload} color="primary">
                        Confirm
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
