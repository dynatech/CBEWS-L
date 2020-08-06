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

import { MarCommunityRiskAssessment } from "@dynaslope/commons";

import AppConfig from "../../reducers/AppConfig";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function HazardMaps() {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [mapsContainer, setMapsContainer] = useState([]);
    const [mapPreview, setMapPreview] = useState([]);
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

    const initHazardMaps = () => {
        setTimeout(async () => {
            const response = await MarCommunityRiskAssessment.GetHazardMaps();
            if (response.status) {
                console.log(response);
                if (response.data.length > 0) {
                    setMapsContainer(response.data);
                    handleMapPreview(response.data[0]);
                }
            }
        }, 300);
    };

    const importAll = (require) =>
        require.keys().reduce((acc, next) => {
            acc[next.replace("./", "")] = require(next);
            return acc;
        }, {});

    const marirongMaps = importAll(
        require.context(
            "C:/Users/John Louie/codes/CBEWS-L/packages/commons/src/client-cbewsl/MARIRONG/MAPS",
            false,
            /\.(png|jpe?g|svg)$/,
        ),
    );
    const handleMapPreview = (map_data) => {
        let temp = {
            img: marirongMaps[map_data.filename],
            title: "Dynaslope MAP (MAR)",
            featured: true,
        };
        setMapPreview([temp]);
    };

    const handleFileSelection = (event) => {
        const file = event.target.files[0];
        setFileToUpload(file);
        setFilename(file.name);
    };

    const handleUpload = () => {
        const data = new FormData();
        data.append("file", fileToUpload);
        setTimeout(async () => {
            const response = await MarCommunityRiskAssessment.UploadHazardMaps(
                data,
            );
            if (response.status === true) {
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
        }, 300);
    };

    return (
        <Fragment>
            <Container className={classes.img_container}>
                <Grid container spacing={2} align="center">
                    <Grid item xs={12} />
                    <Grid item xs={12}>
                        {mapsContainer.length > 0 && (
                            <Fragment>
                                <Magnifier
                                    imageSrc={marirongMaps[mapsContainer[0].filename]}
                                    imageAlt="MAR Hazard Map"
                                    mouseActivation={MOUSE_ACTIVATION.SINGLE_CLICK}
                                    touchActivation={TOUCH_ACTIVATION.DOUBLE_TAP}
                                />
                            </Fragment>
                        )}
                    </Grid>
                    <Grid item={true} xs={12}>
                        <Fab
                            variant="extended"
                            color={"primary"}
                            aria-label="add"
                            onClick={handleClickOpen}
                        >
                            Upload map
                        </Fab>
                    </Grid>
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
