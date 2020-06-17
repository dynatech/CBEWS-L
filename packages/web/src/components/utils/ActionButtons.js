import React, { useState, Fragment, useEffect } from "react";
import {
    Container,
    Grid,
    Fab,
    Button,
    ButtonGroup,
    Paper,
    Typography,
    Link,
    IconButton,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

import { useStyles, tableStyles } from "../../styles/general_styles";

function getAddButton(title, handler) {
    return (
        <Button onClick={handler} arial-label="edit" color="primary">
            <AddIcon /> {title}
        </Button>
    );
}
function getEditButton(handler) {
    return (
        <IconButton
            onClick={() => console.log("Clicked Edit")}
            arial-label="edit"
            component="span"
        >
            <EditIcon />
        </IconButton>
    );
}
function getDeleteButton(handler) {
    return (
        <IconButton
            onClick={() => console.log("Clicked Delete")}
            arial-label="edit"
            component="span"
        >
            <DeleteIcon />
        </IconButton>
    );
}

export { getAddButton, getEditButton, getDeleteButton };