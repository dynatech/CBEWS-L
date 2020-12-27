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

import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

import moment from "moment";
import { MarMaintenanceLogs, UmiSensorMaintenance } from "@dynaslope/commons";

const imageStyle = makeStyles((theme) => ({
    img_size: {
        height: "100%",
        width: "100%",
    },
    summary_content: {
        minHeight: 500,
    },
}));

const summaryStyle = makeStyles((theme) => ({
    content: {
        minHeight: getWindowDimensions().height * 0.415,
        maxHeight: getWindowDimensions().height * 0.415,
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

function MaintenanceLogs() {
    const img = imageStyle();
    const summary = summaryStyle();
    const classes = generalStyle();
    const dt_classes = tableStyle();

    // Site Specific
    const [mar_rows, setMarRows] = useState([]);
    const [umi_rows, setUmiRows] = useState([]);
    const [mar_events, setMarEvents] = useState([]);
    const [umi_events, setUmiEvents] = useState([]);

    const calendarRenderHandler = (site_code) => (args) => {
        const { startStr, endStr } = args;
        const start = moment(startStr).format("YYYY-MM-DD hh:mm:ss");
        const end = moment(endStr).format("YYYY-MM-DD hh:mm:ss");
        getMaintenanceLogsPerMonth(site_code, start, end);
    };

    const dateClickHandler = (site_code) => (args) => {
        getMaintenanceLogsPerDay(site_code, args.date);
    };

    const getMaintenanceLogsPerDay = async (site_code, timestamp) => {
        let response;
        switch (site_code) {
            case "umi":
                response = await UmiSensorMaintenance.GetDaySensorMaintenanceLogs(
                    timestamp,
                );
                response.status
                    ? setUmiEvents(
                          response.data.map((row) => ({
                              title: row.remarks,
                              date: moment(row.maintenance_date).format(
                                  "YYYY-MM-DD",
                              ),
                          })),
                      )
                    : console.error("Problem in UMI API");
                break;
            default:
                response = await MarMaintenanceLogs.GetDayMaintenanceLogs(
                    timestamp,
                );
                response.status
                    ? setMarEvents(
                          response.data.map((row) => ({
                              title: row.type,
                              date: moment(row.maintenance_date).format(
                                  "YYYY-MM-DD",
                              ),
                          })),
                      )
                    : console.error("Problem in UMI API");
        }
    };

    const getMaintenanceLogsPerMonth = async (site_code, start, end) => {
        let response;
        if (site_code === "umi") {
            response = await UmiSensorMaintenance.GetMonthSensorMaintenanceLogs(
                start,
                end,
            );
            const { data, status } = response;
            if (status) {
                setUmiEvents(
                    data.map((row) => ({
                        title: row.remarks,
                        date: moment(row.maintenance_date).format("YYYY-MM-DD"),
                    })),
                );
                setUmiRows(data);
            } else console.error("Problem in UMI API");
        } else if (site_code === "mar") {
            response = await MarMaintenanceLogs.GetMonthMaintenanceLogs(
                start,
                end,
            );
            const { data, status } = response;
            if (status) {
                setMarEvents(
                    data.map((row) => ({
                        title: row.type,
                        date: moment(row.maintenance_date).format("YYYY-MM-DD"),
                    })),
                );
                setMarRows(data);
            } else console.error("Problem in UMI API");
        }
    };

    const [modal, setModal] = useState([<TransitionalModal status={false} />]);

    const [state, setState] = React.useState({
        checked_umi: true,
        checked_mar: false,
    });

    const handleChangeChkbox = (name) => (event) => {
        let stats = { ...state, [name]: event.target.checked };
        setState(stats);
        if (stats.checked_umi === false && stats.checked_mar === false) {
            setState({ checked_umi: true, checked_mar: false });
        }
    };

    function download() {
        setModal([<TransitionalModal status={true} />]);
        setTimeout(() => {
            setModal([<TransitionalModal status={false} />]);
            alert("Download success!");
        }, 3000);
    }

    function print() {
        setModal([<TransitionalModal status={true} />]);
        setTimeout(() => {
            setModal([<TransitionalModal status={false} />]);
            alert("Print success!");
        }, 3000);
    }

    return (
        <Fragment>
            <Container align="center">
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Container align="left">
                            <Grid container>
                                <FormControl
                                    component="fieldset"
                                    className={classes.formControl}
                                >
                                    <FormLabel component="legend">
                                        Select Site:{" "}
                                    </FormLabel>
                                    <Grid item xs={6}>
                                        <FormGroup>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={
                                                            state.checked_umi
                                                        }
                                                        onChange={handleChangeChkbox(
                                                            "checked_umi",
                                                        )}
                                                        value="checked_umi"
                                                        color="primary"
                                                    />
                                                }
                                                label="Umingan"
                                            />
                                        </FormGroup>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <FormGroup>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={
                                                            state.checked_mar
                                                        }
                                                        onChange={handleChangeChkbox(
                                                            "checked_mar",
                                                        )}
                                                        value="checked_mar"
                                                        color="primary"
                                                    />
                                                }
                                                label="Marirong"
                                            />
                                        </FormGroup>
                                    </Grid>
                                </FormControl>
                            </Grid>
                        </Container>
                    </Grid>

                    {/* UMI STUFF  */}
                    {state.checked_umi && (
                        <Fragment style={{ paddingTop: "10%" }}>
                            <Grid item xs={6}>
                                <FullCalendar
                                    datesSet={calendarRenderHandler("umi")}
                                    dateClick={dateClickHandler("umi")}
                                    initialView="dayGridMonth"
                                    plugins={[
                                        dayGridPlugin,
                                        timeGridPlugin,
                                        interactionPlugin,
                                    ]}
                                    events={umi_events}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Grid container>
                                    <PDFViewer
                                        date={moment().format(
                                            "YYYY-MM-DD hh:mm:ss",
                                        )}
                                        data={umi_rows}
                                        dataType="umi_maintenance_report"
                                        classes={classes}
                                        handleDownload={() =>
                                            console.log("clicked download")
                                        }
                                    />
                                    <Grid item xs={12}>
                                        <Grid
                                            container
                                            align="center"
                                            style={{ paddingTop: 20 }}
                                        >
                                            <Grid item xs={3} />
                                            <Grid item xs={3}>
                                                <Fab
                                                    variant="extended"
                                                    color="primary"
                                                    aria-label="add"
                                                    className={
                                                        classes.button_fluid
                                                    }
                                                    onClick={() => {
                                                        download();
                                                    }}
                                                >
                                                    Download
                                                </Fab>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Fab
                                                    variant="extended"
                                                    color="primary"
                                                    aria-label="add"
                                                    className={
                                                        classes.button_fluid
                                                    }
                                                    onClick={() => {
                                                        print();
                                                    }}
                                                >
                                                    Print
                                                </Fab>
                                            </Grid>
                                            <Grid item xs={3} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Paper className={dt_classes.root}>
                                    <Table className={dt_classes.table}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    Date and time
                                                </TableCell>
                                                <TableCell>Remarks</TableCell>
                                                <TableCell>
                                                    Rain Gauge Status
                                                </TableCell>
                                                <TableCell>
                                                    Working Nodes
                                                </TableCell>
                                                <TableCell>
                                                    Anomalous Nodes
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {umi_rows.map((row) => (
                                                <TableRow key={row.timestamp}>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                    >
                                                        {row.timestamp}
                                                    </TableCell>
                                                    <TableCell>
                                                        {row.remarks}
                                                    </TableCell>
                                                    <TableCell>
                                                        {row.rain_gauge_status}
                                                    </TableCell>
                                                    <TableCell>
                                                        {row.working_nodes}
                                                    </TableCell>
                                                    <TableCell>
                                                        {row.anomalous_nodes}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Paper>
                            </Grid>
                        </Fragment>
                    )}

                    {state.checked_mar && (
                        <Fragment>
                            <Grid item xs={6}>
                                <FullCalendar
                                    datesSet={calendarRenderHandler("mar")}
                                    dateClick={dateClickHandler("mar")}
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
                                <Grid container>
                                    <PDFViewer
                                        date={moment().format(
                                            "YYYY-MM-DD hh:mm:ss",
                                        )}
                                        data={mar_rows}
                                        dataType="mar_maintenance_report"
                                        classes={classes}
                                        handleDownload={() =>
                                            console.log("clicked download")
                                        }
                                    />
                                    <Grid item xs={12}>
                                        <Grid
                                            container
                                            align="center"
                                            style={{ paddingTop: 20 }}
                                        >
                                            <Grid item xs={3} />
                                            <Grid item xs={3}>
                                                <Fab
                                                    variant="extended"
                                                    color="primary"
                                                    aria-label="add"
                                                    className={
                                                        classes.button_fluid
                                                    }
                                                    onClick={() => {
                                                        download();
                                                    }}
                                                >
                                                    Download
                                                </Fab>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Fab
                                                    variant="extended"
                                                    color="primary"
                                                    aria-label="add"
                                                    className={
                                                        classes.button_fluid
                                                    }
                                                    onClick={() => {
                                                        print();
                                                    }}
                                                >
                                                    Print
                                                </Fab>
                                            </Grid>
                                            <Grid item xs={3} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Paper className={dt_classes.root}>
                                    <Table className={dt_classes.table}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    Date and time
                                                </TableCell>
                                                <TableCell>
                                                    Type of maintenance
                                                </TableCell>
                                                <TableCell>Remarks</TableCell>
                                                <TableCell>In-charge</TableCell>
                                                <TableCell>Updater</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {mar_rows.map((row) => (
                                                <TableRow
                                                    key={row.maintenance_date}
                                                >
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                    >
                                                        {row.maintenance_date}
                                                    </TableCell>
                                                    <TableCell>
                                                        {row.type}
                                                    </TableCell>
                                                    <TableCell>
                                                        {row.remarks}
                                                    </TableCell>
                                                    <TableCell>
                                                        {row.in_charge}
                                                    </TableCell>
                                                    <TableCell>
                                                        {row.updater}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Paper>
                            </Grid>
                        </Fragment>
                    )}
                </Grid>
            </Container>
            {modal}
        </Fragment>
    );
}

export default MaintenanceLogs;
