import React from 'react';
import { Grid, Paper, Container } from '@material-ui/core';
import { useCookies } from "react-cookie";

const useStyles = "";

export default function Dashboard (props) {
    // const classes = useStyles();
    console.log("props", props.cookies);
    const [cookies, setCookie] = useCookies(['credentials']);
    console.log("cookies", cookies);

    return (
        <Paper>testing grounds</Paper>
    );
}