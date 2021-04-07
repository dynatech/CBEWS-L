import React, { useState, useRef } from 'react';
import { renderToString } from 'react-dom/server';
import { Grid, Paper, Typography, Box, Fab } from '@material-ui/core';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import { makeStyles } from '@material-ui/core/styles';
import EmailModal from './EmailModal';
import moment from "moment";
import TransitionalModal from "./pdrrmo_iloilo/loading";
import { MarMaintenanceLogs, UmiFieldSurvey, UmiSituationReport } from "@dynaslope/commons";
import Pdf from 'react-to-pdf';

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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

const thStyle = {
    wordWrap: "break-word",
};

const tdStyle = {
    wordWrap: "break-word",
    textAlign: "center"
};

const options = {
    orientation: 'p',
    format: 'a4'
};

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
            case "umi_situation_report_list":
                return_element = (
                    <div>
                        <h3>Umi Situation Report</h3>
                        <table border={1}>
                            <tr>
                                <th width={300} style={thStyle}>Date</th>
                                <th width={1000} style={thStyle}>Summary</th>
                            </tr>
                            {
                                data.map((row) => (
                                    <tr>
                                        <td width={300} style={thStyle}>{row.report_ts}</td>
                                        <td width={1000} style={thStyle}>{row.report_summary}</td>
                                    </tr>
                                ))
                            }
                        </table>
                    </div>
                );
                break;
            case "umi_field_survey":
                const survey_rep = data[0];
                console.log("survey_rep", survey_rep);
                return_element = (
                    <table style={{width: "30%", borderSpacing: "5px", marginLeft: "10%"}}>
                        <tr>
                            <td width={400} style={thStyle}><strong>Date:</strong></td>
                            <td width={700} style={thStyle}>{survey_rep.report_date}</td>
                        </tr>
                        <tr>
                            <td width={400} style={thStyle}><strong>Features:</strong></td>
                            <td width={700} style={thStyle}>{survey_rep.feature}</td>
                        </tr>
                        <tr>
                            <td width={400} style={thStyle}><strong>Materials Characterization:</strong></td>
                            <td width={700} style={thStyle}>{survey_rep.materials_characterization}</td>
                        </tr>
                        <tr>
                            <td width={400} style={thStyle}><strong>Mechanism:</strong></td>
                            <td width={700} style={thStyle}>{survey_rep.mechanism}</td>
                        </tr>
                        <tr>
                            <td width={400} style={thStyle}><strong>Exposure:</strong></td>
                            <td width={700} style={thStyle}>{survey_rep.exposure}</td>
                        </tr>
                        <tr>
                            <td width={400} style={thStyle}><strong>Report Narrative:</strong></td>
                            <td width={700} style={thStyle}>{survey_rep.report_narrative}</td>
                        </tr>
                    </table>
                );
                break;
            case "umi_field_survey_list":
                return_element = (
                    <div>
                        <h3>Umi Field Survey Report</h3>
                        <table border={1}>
                            <tr>
                                <th width={300} style={thStyle}>Date</th>
                                <th width={300} style={thStyle}>Features</th>
                                <th width={300} style={thStyle}>Materials Characterization</th>
                                <th width={300} style={thStyle}>Mechanism</th>
                                <th width={300} style={thStyle}>Exposure</th>
                                <th width={300} style={thStyle}>Report Narrative</th>
                            </tr>
                            {
                                data.map((row) => (
                                    <tr>
                                        <td width={300} style={tdStyle}>{row.report_date}</td>
                                        <td width={1000} style={tdStyle}>{row.feature}</td>
                                        <td width={300} style={tdStyle}>{row.materials_characterization}</td>
                                        <td width={1000} style={tdStyle}>{row.mechanism}</td>
                                        <td width={300} style={tdStyle}>{row.exposure}</td>
                                        <td width={1000} style={tdStyle}>{row.report_narrative}</td>
                                    </tr>
                                ))
                            }
                        </table>
                    </div>
                );
                break;
            case "umi_maintenance_report":
                const sensor_main = data[0];

                return_element = (
                    <div>
                        <h3>Umi Maintenance Report</h3>
                        <table border={1}>
                            <tr>
                                <th width={300} style={thStyle}>Date</th>
                                <th width={300} style={thStyle}>Features</th>
                                <th width={300} style={thStyle}>Materials Characterization</th>
                                <th width={200} style={thStyle}>Mechanism</th>
                                <th width={200} style={thStyle}>Exposure</th>
                            </tr>
                            {
                                data.map((row) => (
                                    <tr>
                                        <td width={300} style={tdStyle}>{sensor_main.timestamp}</td>
                                        <td width={300} style={tdStyle}>{sensor_main.remarks}</td>
                                        <td width={300} style={tdStyle}>{sensor_main.rain_gauge_status}</td>
                                        <td width={200} style={tdStyle}>{sensor_main.working_nodes}</td>
                                        <td width={200} style={tdStyle}>{sensor_main.anomalous_nodes}</td>
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
                                <th width={300} style={thStyle}>Date</th>
                                <th width={200} style={thStyle}>Report Narrative</th>
                                <th width={200} style={thStyle}>Reporter</th>
                            </tr>
                            {
                                data.map((row) => (
                                    <tr>
                                        <td width={300} style={tdStyle}>{row.incident_date}</td>
                                        <td width={200} style={tdStyle}>{row.incident_report_narrative}</td>
                                        <td width={200} style={tdStyle}>{row.reporter}</td>
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
                        <table border={1} style={{width: "100%"}}>
                            <tr>
                                <th width={150} style={thStyle}>Date</th>
                                <th width={350} style={thStyle}>Type</th>
                                <th width={350} style={thStyle}>Remarks</th>
                                <th width={125} style={thStyle}>In-Charge</th>
                                <th width={125} style={thStyle}>Updater</th>
                            </tr>
                            {
                                data.map((row) => (
                                    <tr>
                                        <td width={150} style={tdStyle}>{row.maintenance_date}</td>
                                        <td width={350} style={tdStyle}>{row.type}</td>
                                        <td width={350} style={tdStyle}>{row.remarks}</td>
                                        <td width={125} style={tdStyle}>{row.in_charge}</td>
                                        <td width={125} style={tdStyle}>{row.updater}</td>
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

    const [openNotif, setOpenNotif] = useState(false);
    const [notifText, setNotifText] = useState("");
    const [notifStatus, setNotifStatus] = useState('success');

    const download_ref = useRef();

    const html_string = data.length > 0 ? convertToSimpleHTML(data_type, data) : (<Typography>No data</Typography>);

    const handleSendEmail = (html_string, email_data) => async () => {
        const response = await MarMaintenanceLogs.SendPDFReportViaEmail({
            "email_data": email_data,
            "html": renderToString(html_string),
            "date": moment(date).format("YYYY-MM-DD hh:mm:ss")
        });
        if (response.status === true) {
            console.log("Success in sending PDF");
            setNotifStatus("success");
            setNotifText("Success in sending PDF");
        } else {
            setNotifStatus("error");
            setNotifText("Email report failed to send");
        }
        setOpenNotif(true);
        setEmailOpen(false);
    };

    const [modal, setModal] = useState([<TransitionalModal status={false} />]);

    const download = () => {
        setModal([<TransitionalModal status={true} />])
        setTimeout(() => {
            setModal([<TransitionalModal status={false} />])
            alert("Download success!")
        }, 3000)
    }
    
    const print = () => {
        setModal([<TransitionalModal status={true} />])
        setTimeout(() => {
            setModal([<TransitionalModal status={false} />])
            alert("Print success!")
        }, 3000)
    }

    return (
        <Box width="100%">
           <Grid container>
               <Grid item xs={12} style={{paddingLeft: '10%', paddingRight: '10%'}}>
                    <Paper>
                        <div ref={download_ref}>
                        {!noImport && (
                            <header>
                                <img src={require('../../assets/letter_header.png')} className={img.img_size} alt="footer" />
                            </header>
                        )}
                        <body style={{ margin: "5%", height: "400px"}}>
                            {html_string}
                        </body>
                        {!noImport && (
                            <footer>
                                <img src={require('../../assets/letter_footer.png')} className={img.img_size} alt="footer" />
                            </footer>
                        )}
                        </div>
                    </Paper>
               </Grid>
           </Grid>
            {data.length > 0 && (
                <Grid item xs={12}>
                    <Grid
                        container
                        align="center"
                        style={{ paddingTop: 20 }}
                        spacing={2}
                    >
                        <Grid item xs={2} />
                        <Grid item xs={4}>
                            <Pdf targetRef={download_ref} filename="download.pdf" options={options} x={0} y={0} scale={1.92}>
                                {({ toPdf }) =>     
                                    <Fab
                                        variant="extended"
                                        color="primary"
                                        aria-label="add"
                                        className={classes.button_fluid}
                                        onClick={toPdf}
                                        style={{width: '100%'}}
                                    >
                                        Download
                                    </Fab>
                               }
                            </Pdf>
                        </Grid>
                        <Grid item xs={4}>
                            <Fab
                                variant="extended"
                                color="primary"
                                aria-label="add"
                                className={classes.button_fluid}
                                onClick={() => setEmailOpen(true)}
                                style={{width: '100%'}}
                            >
                                Email
                            </Fab>
                        </Grid>
                        <Grid item xs={2} />
                    </Grid>
                    <EmailModal
                        open={emailOpen}
                        setOpen={setEmailOpen}
                        html={html_string}
                        handleSubmit={handleSendEmail}
                    />
                </Grid>
            )}
            {modal}

        <Snackbar open={openNotif} 
            autoHideDuration={3000} 
            onClose={() => {setOpenNotif(false)}}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            key={'top,right'}>
                <Alert onClose={() => {setOpenNotif(false)}} severity={notifStatus}>
                    {notifText}
                </Alert>
        </Snackbar>
        </Box>
    );
}

export default PDFPreviewer;