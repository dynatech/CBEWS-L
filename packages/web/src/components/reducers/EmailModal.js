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
import ChipInput from 'material-ui-chip-input';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function EmailModal(props) {
    const { open, setOpen, html, handleSubmit } = props;
    const [recipient_list, setRecipientList] = useState([]);
    const [subject, setSubject] = useState("");
    const [email_body, setEmailBody] = useState("");

    const handleChipAdd = (chip) => {
        if (!recipient_list.includes(chip)) {
            const temp = recipient_list;
            temp.push(chip);
            setRecipientList(temp);
        }
    };
    const handleDeleteChip = (chip, index) => {
        if (recipient_list.includes(chip)) {
            const temp = recipient_list;
            temp.splice(index, 1);
            setRecipientList(temp);
        }
    };

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
                            <ChipInput
                                value={recipient_list}
                                onAdd={(chip) => handleChipAdd(chip)}
                                onDelete={(chip, index) => handleDeleteChip(chip, index)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                id="outlined-required"
                                label="Subject"
                                defaultValue=""
                                variant="outlined"
                                value={subject}
                                onChange={event => setSubject(event.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <ReactQuill theme="snow" value={email_body} onChange={setEmailBody}/>
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={handleSubmit(html, {
                    email_body, subject, recipient_list
                })}>Send Email</Button>
            </DialogActions>
        </Dialog>
    );
}
