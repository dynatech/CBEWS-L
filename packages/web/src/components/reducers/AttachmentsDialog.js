
import React, { Fragment, useState, useEffect } from 'react';
import { Button, Container, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Paper, TextField } from "@material-ui/core";
import PhotoAttachmentList from './PhotoAttachmentList';

export default function AttachmentsDialog (props) {
    const { 
        type, attachment_list, handleUpload, 
        handleDelete, handleDownload,
        open, handleClose, handleFileSelection,
        filename
    } = props;

    if (handleDelete !== "undefined") {
        console.log("undefined handleDelete");
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
        >
            <DialogTitle id="form-dialog-title">File upload</DialogTitle>
            <DialogContent>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <PhotoAttachmentList data={attachment_list} />
                    </Grid>
                    <Grid item xs={6}>
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
                    <Grid item xs={6}>
                        <input
                            accept="*"
                            style={{ display: 'none' }}
                            id="raised-button-file"
                            multiple
                            type="file"
                            onChange={handleFileSelection}
                        />
                        <label htmlFor="raised-button-file">
                            <Button variant="raised" component="span" color="primary">
                                Add New Upload
                            </Button>
                        </label>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">Cancel</Button>
                <Button onClick={handleUpload} color="primary">Upload</Button>
                {/* <Button onClick={() => console.log("clicked download")} color="primary">Download</Button> */}
            </DialogActions>
        </Dialog>
    );
}