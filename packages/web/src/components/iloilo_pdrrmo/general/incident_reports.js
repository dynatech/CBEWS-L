import React, { Fragment, useState } from "react";
import {
    Container,
    Grid,
    Fab,
    Paper,
    Table,
    Box,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
// import '../../../node_modules/@fullcalendar/core/main.css';
// import '../../../node_modules/@fullcalendar/daygrid/main.css';

import TransitionalModal from "../../reducers/pdrrmo_iloilo/loading";
import PDFViewer from "../../reducers/PDFViewer";

import moment from "moment";

import { MarMaintenanceLogs } from "@dynaslope/commons";

const imageStyle = makeStyles((theme) => ({
    img_size: {
        height: "100%",
        width: "100%",
    },
    summary_content: {
        minHeight: 250,
    },
}));

const summaryStyle = makeStyles((theme) => ({
    content: {
        minHeight: getWindowDimensions().height * 0.295,
        maxHeight: getWindowDimensions().height * 0.295,
    },
}));

const generalStyle = makeStyles((theme) => ({
    button_fluid: {
        width: "90%",
        padding: 10,
    },
}));

const tableStyle = makeStyles((theme) => ({
    root: {
        width: "100%",
        marginTop: theme.spacing(3),
        overflowX: "auto",
    },
    table: {
        minWidth: 650,
    },
}));

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height,
    };
}

function IncidentReports() {
    const img = imageStyle();
    const summary = summaryStyle();
    const classes = generalStyle();
    const dt_classes = tableStyle();

    // Site Specific
    const [mar_rows, setMarRows] = useState([]);
    const [mar_events, setMarEvents] = useState([]);

    const calendarRenderHandler = (args) => {
        const { startStr, endStr } = args;
        const start = moment(startStr).format("YYYY-MM-DD hh:mm:ss");
        const end = moment(endStr).format("YYYY-MM-DD hh:mm:ss");
        getIncidentLogsPerMonth(start, end);
    };

    const dateClickHandler = (args) => {
        getIncidentLogsPerDay(args.date);
    };

    const convert_events = (data) => {
        return data.map((row) => ({
            title: row.incident_report_narrative,
            date: moment(row.incident_date).format("YYYY-MM-DD"),
        }));
    };

    const getIncidentLogsPerDay = async (timestamp) => {
        let response;
        response = await MarMaintenanceLogs.GetDayIncidentLogs(timestamp);
        response.status
            ? setMarEvents(convert_events(response.data))
            : console.error("Problem in MAR API");
    };

    const getIncidentLogsPerMonth = async (start, end) => {
        let response;
        response = await MarMaintenanceLogs.GetMonthIncidentLogs(start, end);
        const { data, status } = response;
        if (status) {
            setMarEvents(convert_events(response.data));
            setMarRows(data);
        } else console.error("Problem in MAR API");
    };

    return (
        <Fragment>
            <Container align="center">
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <FullCalendar
                            datesSet={calendarRenderHandler}
                            dateClick={dateClickHandler}
                            initialView="dayGridMonth"
                            plugins={[
                                dayGridPlugin,
                                timeGridPlugin,
                                interactionPlugin,
                            ]}
                            events={mar_events}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <PDFViewer
                            date={moment().format("YYYY-MM-DD hh:mm:ss")}
                            data={mar_rows}
                            dataType="mar_incident_report"
                            classes={classes}
                            handleDownload={() =>
                                console.log("clicked download")
                            }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={dt_classes.root}>
                            <Table className={dt_classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date and time</TableCell>
                                        <TableCell>Report Narrative</TableCell>
                                        <TableCell>Reporter</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {mar_rows.map((row) => (
                                        <TableRow key={row.incident_date}>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                            >
                                                {row.incident_date}
                                            </TableCell>
                                            <TableCell>
                                                {row.incident_report_narrative}
                                            </TableCell>
                                            <TableCell>
                                                {row.reporter}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Fragment>
    );
}

export default IncidentReports;
