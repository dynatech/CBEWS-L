import React, { Fragment, useState, useRef } from "react";
import moment from "moment";
import {
    Grid,
    Container,
    Fab,
    Button,
    Typography,
    TextField,
    Input
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";

import AppConfig from "./AppConfig";
import { MarMaintenanceLogs } from "@dynaslope/commons";
import { useStyles, tableStyles } from "../../styles/general_styles";

export default function EmailModal(props) {
    const { open, setOpen, data, html, handleChange, handleSubmit } = props;

    return (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="form-dialog-title"
        >
            <DialogTitle id="form-dialog-title">
                Send Report Via E-Mail
            </DialogTitle>
            <DialogContent>
                <form>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                id="outlined-required"
                                label="Email Recipients"
                                defaultValue=""
                                variant="outlined"
                                value={data["recipient_list"]}
                                onChange={handleChange("recipient_list")}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                id="outlined-required"
                                label="Subject"
                                defaultValue=""
                                variant="outlined"
                                value={data["subject"]}
                                onChange={handleChange("subject")}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                id="outlined-required"
                                label="Body"
                                defaultValue=""
                                variant="outlined"
                                value={data["email_body"]}
                                onChange={handleChange("email_body")}
                            />
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={handleSubmit(html, data)}>Send Email</Button>
            </DialogActions>
        </Dialog>
    );
}
