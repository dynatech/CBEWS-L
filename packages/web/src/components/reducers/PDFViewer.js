import React, { useState, useEffect } from 'react';
import { renderToString } from 'react-dom/server';
import { Grid, Paper, Typography, Box, Fab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import EmailModal from './EmailModal';
import moment from "moment";
import { MarMaintenanceLogs, UmiFieldSurvey, UmiSituationReport } from "@dynaslope/commons";

const imageStyle = makeStyles(theme => ({
    img_size: {
        height: '100%',
        width: '100%'
    },
    summary_content: {
        minHeight: 500
    }
}));

const summaryStyle = makeStyles(theme => ({
    content: {
        minHeight: getWindowDimensions().height * 0.415,
        maxHeight: getWindowDimensions().height * 0.415
    }
}));

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}

function convertToSimpleHTML(data_type, data) {
    let return_element = null;
    if (data.length > 0) {
        switch(data_type) {
            case "umi_situation_report":
                const sit_rep = data[0];
                return_element = (
                    <div style={{width: "30%", borderSpacing: "5px", marginLeft: "10%"}}>
                        <span>
                            <b>Date:</b> {sit_rep.report_ts}
                        </span>
                        <br/><br/>
                        <span>
                            <b>Summary:</b>
                            <br/>
                            <p>{sit_rep.report_summary}</p>
                        </span>
                    </div>
                );
                break;
            case "umi_field_survey":
                const survey_rep = data[0];
                console.log("survey_rep", survey_rep);
                return_element = (
                    <table style={{width: "30%", borderSpacing: "5px", marginLeft: "10%"}}>
                        <tr>
                            <td width={400}><strong>Date:</strong></td>
                            <td width={700}>{survey_rep.report_date}</td>
                        </tr>
                        <tr>
                            <td width={400}><strong>Features:</strong></td>
                            <td width={700}>{survey_rep.feature}</td>
                        </tr>
                        <tr>
                            <td width={400}><strong>Materials Characterization:</strong></td>
                            <td width={700}>{survey_rep.materials_characterization}</td>
                        </tr>
                        <tr>
                            <td width={400}><strong>Mechanism:</strong></td>
                            <td width={700}>{survey_rep.mechanism}</td>
                        </tr>
                        <tr>
                            <td width={400}><strong>Exposure:</strong></td>
                            <td width={700}>{survey_rep.exposure}</td>
                        </tr>
                        <tr>
                            <td width={400}><strong>Report Narrative:</strong></td>
                            <td width={700}>{survey_rep.report_narrative}</td>
                        </tr>
                    </table>
                );
                break;
            case "umi_maintenance_report":
                const sensor_main = data[0];
                console.log("sensor_main", sensor_main);

                return_element = (
                    <div>
                        <h3>Umi Maintenance Report</h3>
                        <table border={1}>
                            <tr>
                                <th width={300}>Date</th>
                                <th width={300}>Features</th>
                                <th width={300}>Materials Characterization</th>
                                <th width={200}>Mechanism</th>
                                <th width={200}>Exposure</th>
                            </tr>
                            {
                                data.map((row) => (
                                    <tr>
                                        <td width={300}>{sensor_main.timestamp}</td>
                                        <td width={300}>{sensor_main.remarks}</td>
                                        <td width={300}>{sensor_main.rain_gauge_status}</td>
                                        <td width={200}>{sensor_main.working_nodes}</td>
                                        <td width={200}>{sensor_main.anomalous_nodes}</td>
                                    </tr>
                                ))
                            }
                        </table>
                    </div>
                );
                break;
            case "mar_incident_report":
                return_element = (
                    <div>
                        <h3>Mar Incident Report</h3>
                        <table border={1}>
                            <tr>
                                <th width={300}>Date</th>
                                <th width={200}>Report Narrative</th>
                                <th width={200}>Reporter</th>
                            </tr>
                            {
                                data.map((row) => (
                                    <tr>
                                        <td width={300}>{row.incident_date}</td>
                                        <td width={200}>{row.incident_report_narrative}</td>
                                        <td width={200}>{row.reporter}</td>
                                    </tr>
                                ))
                            }
                        </table>
                    </div>
                );
                break;
            case "mar_maintenance_report":
                return_element = (
                    <div>
                        <h3>Mar Maintenance Report</h3>
                        <table border={1}>
                            <tr>
                                <th width={200}>Date</th>
                                <th width={200}>Type</th>
                                <th width={200}>Remarks</th>
                                <th width={200}>In-Charge</th>
                                <th width={200}>Updater</th>
                            </tr>
                            {
                                data.map((row) => (
                                    <tr>
                                        <td width={200}>{row.maintenance_date}</td>
                                        <td width={200}>{row.type}</td>
                                        <td width={200}>{row.remarks}</td>
                                        <td width={200}>{row.in_charge}</td>
                                        <td width={200}>{row.updater}</td>
                                    </tr>
                                ))
                            }
                        </table>
                    </div>
                );
                break;
            default:
                return_element = (<span>No data</span>);
        }
    } else return_element = (<span>No data</span>);

    return return_element;
}


function PDFPreviewer(props) {
    const img = imageStyle();
    const summary = summaryStyle();
    const { date, data, dataType: data_type, noImport, classes, handleDownload } = props;
    const [emailOpen, setEmailOpen] = useState(false);

    const html_string = data.length > 0 ? convertToSimpleHTML(data_type, data) : (<Typography>No data</Typography>);

    const handleSendEmail = (html_string, email_data) => async () => {
        const response = await MarMaintenanceLogs.SendPDFReportViaEmail({
            "email_data": email_data,
            "html": renderToString(html_string),
            "date": moment(date).format("YYYY-MM-DD hh:mm:ss")
        });
        if (response.status === true) {
            console.log("Success in sending PDF");
            alert(response.message);
            setEmailOpen(false);
        } else {
            console.log("problem in PDF");
        }
    };

    return (
        <Box width="100%">
            <Paper>
                {!noImport && (
                    <Grid item xs={12}>
                        <img src={require('../../assets/letter_header.png')} className={img.img_size} alt="footer" />
                    </Grid>
                )}
                <Grid item xs={12} className={summary.content}>
                    {html_string}
                </Grid>
                {!noImport && (
                    <Grid item xs={12}>
                        <img src={require('../../assets/letter_footer.png')} className={img.img_size} alt="footer" />
                    </Grid>
                )}
            </Paper>
            {data.length > 0 && (
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
                                className={classes.button_fluid}
                                onClick={handleDownload(html_string)}
                            >
                                Download
                            </Fab>
                        </Grid>
                        <Grid item xs={3}>
                            <Fab
                                variant="extended"
                                color="primary"
                                aria-label="add"
                                className={classes.button_fluid}
                                onClick={() => setEmailOpen(true)}
                            >
                                Email
                            </Fab>
                        </Grid>
                        <Grid item xs={3} />
                    </Grid>
                    <EmailModal
                        open={emailOpen}
                        setOpen={setEmailOpen}
                        html={html_string}
                        handleSubmit={handleSendEmail}
                    />
                </Grid>
            )}
        </Box>
    );
}

export default PDFPreviewer;