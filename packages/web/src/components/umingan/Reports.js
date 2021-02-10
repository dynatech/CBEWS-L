import React, { useEffect, useState } from 'react';
import { UmiReports } from '@dynaslope/commons'
import { Grid, Container, Paper, Button, Typography } from '@material-ui/core';
import PDFViewer from '../reducers/PDFViewer'
import moment from "moment";

import {
    MuiPickersUtilsProvider,
    DateTimePicker
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { makeStyles } from "@material-ui/core/styles";

const generalStyle = makeStyles((theme) => ({
    button_fluid: {
        width: "90%",
        padding: 10,
    },
}));

export default function Reports () {
    const classes = generalStyle();
    const [start, setStart] = useState(moment().startOf('month').format("YYYY-MM-DD hh:mm:ss"));
    const [end, setEnd] = useState(moment().format("YYYY-MM-DD hh:mm:ss"));
    const [situation_report, setSituationReport] = useState([]);
    const [field_survey_report, setFieldSurveyReport] = useState([]);

    useEffect(() => {
        init();
    }, []);

    const handleSubmit = async () => {
        init();
    };

    const init = async () => {
        const response = await UmiReports.GetAllFieldSurveyLogsByDate(start, end);
        console.log("response", response);
        if (response.status) {
            setFieldSurveyReport(response.data);
            console.log("DATA from init fieldsurv", response.data)
        } else console.error("Problem in init field survey");

        const response2 = await UmiReports.GetAllSituationReportsByDate(start, end);
        if (response2.status) {
            setSituationReport(response2.data);
            console.log("DATA from init sitrep", response.data)
        } else console.error("Problem in init sit reports");
    }

    return (
        <Container>
            <Grid container spacing={5}>
                <Grid item xs={12} />
                <Grid item xs={12}>
                    <Paper style={{ padding: "1%"}}>
                        <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography>Choose time range</Typography>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <MuiPickersUtilsProvider utils={MomentUtils}>
                                <DateTimePicker
                                    autoOk
                                    ampm={false}
                                    disableFuture
                                    value={start}
                                    onChange={(date) => { setStart(moment(date).format("YYYY-MM-DD HH:mm:ss")) }}
                                    label="Start TS"
                                    fullWidth
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <MuiPickersUtilsProvider utils={MomentUtils}>
                                <DateTimePicker
                                    autoOk
                                    ampm={false}
                                    disableFuture
                                    value={end}
                                    onChange={(date) => { setEnd(moment(date).format("YYYY-MM-DD HH:mm:ss")) }}
                                    label="End TS"
                                    fullWidth
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Button onClick={handleSubmit} color="primary">Submit</Button>
                        </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h5">Situation Report Generator</Typography>
                    <PDFViewer
                        date={moment().format("YYYY-MM-DD hh:mm:ss")}
                        data={situation_report}
                        dataType="umi_situation_report_list"
                        classes={classes}
                        handleDownload={() =>
                            console.log("clicked download")
                        }
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h5">Field Survey Report Generator</Typography>
                    <PDFViewer
                        date={moment().format("YYYY-MM-DD hh:mm:ss")}
                        data={field_survey_report}
                        dataType="umi_field_survey_list"
                        classes={classes}
                        handleDownload={() =>
                            console.log("clicked download")
                        }
                    />
                </Grid>
            </Grid>
        </Container>
    )
}