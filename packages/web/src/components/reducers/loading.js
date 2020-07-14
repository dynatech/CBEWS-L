import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress, Dialog, DialogTitle } from '@material-ui/core/'

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '0px',
        outline: 0
    },
    progress: {
        margin: theme.spacing(5),
    },
}));


function TransitionsModal({ status }) {
    const classes = useStyles();

    return (
        <Dialog onClose={status} aria-labelledby="simple-dialog-title" open={status}>
            <DialogTitle id="simple-dialog-title">Loading. Please wait. <CircularProgress className={classes.progress} /></DialogTitle>
        </Dialog>

    );
}
export default TransitionsModal