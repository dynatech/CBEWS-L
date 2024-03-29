import React, { useState, Fragment, useEffect } from 'react';
import { renderToString } from 'react-dom/server';
import green from '@material-ui/core/colors/green';
import TransitionalModal from '../reducers/loading';
import {
    Container, Grid, Fab, Typography,
    Button, TableBody, TableCell, TableHead,
    TableRow, Paper, Box, Divider
} from '@material-ui/core';
import moment from "moment";
import { useStyles, tableStyle } from '../../styles/general_styles';
import { AlertGeneration, AppConfig } from '@dynaslope/commons';

// import RainfallPlot from './rainfall_plot';
// import SurficialPlot from './surficial_plot';
// import SubsurfacePlot from './subsurface_plot';

import { jsPDF } from "jspdf";
import autoTable, { __createTable } from 'jspdf-autotable';

import letter_header from '../../assets/letter_header.png';
import letter_footer from '../../assets/letter_footer.png';

import EmailModal from '../reducers/EmailModal';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';


function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function identifyAlertStyle (public_alert_level, classes) {
    return classes[`alert_level_${public_alert_level}`];
}

function AlertValidation() {
    const [public_alert, setPublicAlert] = useState("Loading...");
    const [candidate_status, setCandidateStatus] = useState("no_alert");
    const [validity, setValidity] = useState("");
    const [data_ts, setDataTs] = useState("");
    const [as_of_ts, setAsOfTs] = useState("");
    const [ewi_data, setEwiData] = useState({});
    const [is_release_time, setIsReleaseTime] = useState(false);
    const [rx_data, setRxData] = useState(null);
    
    const [rows, setRow] = useState([]);
    const [day, setDay] = useState(null);
    const [all_validated, setAllValidated] = useState(false);

    const [openNotif, setOpenNotif] = useState(false);
    const [notifText, setNotifText] = useState("");
    const [notifStatus, setNotifStatus] = useState('success');


    useEffect(() => {
        // GET CANDIDATE TRIGGER
        updateAlertGen();
    }, []);

    
    function handleFeatureNav(feature) {
        let return_feat = []
        const a_v = "alert_validation";
        // switch (feature) {
        //     case "Rainfall":
        //         return_feat = [<RainfallPlot feature={a_v} />];
        //         break;
        //     case "Surficial":
        //         return_feat = [<SurficialPlot feature={a_v} />];
        //         break;
        //     case "Subsurface":
        //         return_feat = [<SubsurfacePlot feature={a_v} />];
        //         break;
        //     case "Moms":
        //         return_feat = [<SubsurfacePlot feature={a_v} />];
        //         break;
        //     case "Earthquake":
        //         return_feat = [<SubsurfacePlot feature={a_v} />];
        //         break;
        //     default:
        //         return_feat = null;
        //         break;
        // }
        return return_feat;
    }
    
    const get_charts = (release_triggers) => {
        let return_data = [];
        if (release_triggers.length > 0) {
            const chart_list = release_triggers.map(trig => {
    
                const { trigger } = trig;
                let chart_load = null;
                chart_load = handleFeatureNav(trigger);

                return {
                    ...trig,
                    chart: chart_load
                }
            });
            return_data = chart_list;
        } else {
            return_data = release_triggers;
        }
    
        return return_data;
    };

    const updateAlertGen = () => {
        fetch(`${AppConfig.HOSTNAME}/v2/get/alert_gen/umi/alert_validation_data`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(response => response.json())
            .then(responseJson => {
                console.log("get_mar_alert_validation_data responseJson", responseJson);
                const { public_alert_level, as_of_ts, status } = responseJson.data;
                const as_of_ts_format = moment(as_of_ts).format("hh:mm A, D MMMM YYYY, dddd");
                setAsOfTs(as_of_ts_format);
                setEwiData({
                    ...responseJson.data,
                    site_code: responseJson.data.site_code,
                    site_id: responseJson.data.site_id
                });
                let rel_trig = [];
                setCandidateStatus(status);
                if (["on-going", "new", "valid", "extended", "lowering"].includes(status)) {
                    const { validity: val, data_ts: dts, is_release_time: irt, release_triggers, all_validated: a_v, rx_data: rxdata, extend_rain_x: extend_rain_x } = responseJson.data;
                    const color_class = identifyAlertStyle(public_alert_level, classes);
                    setPublicAlert(
                        <Typography variant="h2" className={[classes.label_paddings, classes.alert_level, color_class]}>
                            {`Alert ${public_alert_level}`}
                        </Typography>
                    );
                    setAsOfTs(as_of_ts_format);
                    setValidity(![null, ''].includes(val) ? moment(val).format("MMMM D, YYYY h:mm A") : null);
                    setDataTs(moment(dts).format("MMMM D, YYYY h:mm A"));
                    setIsReleaseTime(irt);
                    setAllValidated(a_v);
                    if(extend_rain_x){
                        setRxData(
                            <Typography variant="h6" display="block" style={{color:'#ff7b00'}}>{rxdata.message}</Typography>
                        );
                    }else{
                        setRxData(null);
                    }
                    rel_trig = release_triggers;
                    if ("day" in responseJson.data) setDay(responseJson.data.day)

                    setNotifText("Successfully retrieved updated candidate data.");
                } else if (status === "no_alert") {
                    setPublicAlert(
                        <Typography variant="h2" color="#28a745" className={[classes.label_paddings, classes.alert_level]}>
                            No candidate alert
                        </Typography>
                        );
                        setRxData(null);
                    setNotifText("No new candidate data.");
                } else {
                    rel_trig = [];
                    setPublicAlert(
                        <Typography variant="h2" color="#28a745" className={[classes.label_paddings, classes.alert_level]}>
                            {`Alert ${public_alert_level}`}
                        </Typography>
                    );
                    setNotifText("No candidate data.");
                }

                setOpenNotif(true);
                setNotifStatus("success");

                return rel_trig;
            })
            .then(temp => get_charts(temp))
            .then(release_triggers => {
                setRow(release_triggers);
            })
            .catch((error) => {
                console.log(error);

                setOpenNotif(true);
                setNotifText("Problem in updating candidate data.");
                setNotifStatus("error");
            });
    }

    const validateAlert = (status, data) => {
        // "#28a745"
        // "#ee9d01"

        // "#195770"
        let alert_validity = 0;
        let remark = "";
        if (status) {
            alert_validity = 1;
            remark = "valid trigger";
        } else {
            alert_validity = -1;
            remark = "invalid trigger";
        }

        const payload = {
            trigger_id: data["trigger_id"],
            alert_status: alert_validity,
            remarks: remark,
            user_id: 1,
            ts_last_retrigger: data["date_time"]
        };

        fetch(`${AppConfig.HOSTNAME}/v2/validate_trigger/public_alerts`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        }).then(response => response.json())
            .then(responseJson => {
                setOpenNotif(true);
                setNotifText("Successfully updated trigger validity.");
                setNotifStatus("success");
                updateAlertGen();
            })
            .catch((error) => {
                setOpenNotif(true);
                setNotifText("Error in changing trigger validity.");
                setNotifStatus("success");
                console.error(error);
            });
    }
    
    const releaseEwi = (payload) => {
        fetch(`${AppConfig.HOSTNAME}/v2/insert/alert_gen/ewi`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        }).then(response => response.json())
            .then(responseJson => {
                setNotifText("Successfully released EWI");
                setOpenNotif(true);
                setNotifStatus("success");
                updateAlertGen();
            })
            .catch((error) => {
                console.error(error);
                setOpenNotif(true);
                setNotifStatus("error");
                setNotifText("Failed to release EWI. Please contact the developers or file a bug report");
            }
            );
    }
    const classes = useStyles();

    return (
        <Fragment>
            <Container style={{minHeight: window.innerHeight - 220}}>
                <Grid container align="center" spacing={4}>
                    <Grid item xs={12} container spacing={2} >
                        <Grid item={12}><Typography variant="h3"> </Typography></Grid>
                    </Grid>

                    {/* TRIGGER TABLE  */}
                    {rows.map(row => {
                        const { is_invalid, has_alert_status } = row;

                        return (
                            <Fragment>
                                <Grid item xs={3}>
                                    <Typography variant="h6" align="left">Date Time of Alert: </Typography>
                                    <Typography variant="h5" align="left">{row.date_time}</Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography variant="h6" align="left">Trigger: </Typography>
                                    <Typography variant="h5" align="left">{row.trigger}</Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography variant="h6" align="left">Data Source:</Typography>
                                    <Typography variant="h5" align="left">{row.data_source}</Typography>
                                </Grid>
                                <Grid item xs={5}>
                                    <Typography variant="h6" align="left">Description:</Typography>
                                    <Typography variant="h5" align="left">{row.description}</Typography>
                                </Grid>

                                {row.chart}

                                <Grid item xs={3} />{/* PREV IS SPACER */}

                                <Grid item xs={3}>
                                    <Fab variant="extended"
                                        color="default"
                                        aria-label="add" className={!is_invalid && has_alert_status ? [classes.button_fluid, classes.fabGreen] : classes.button_fluid}
                                        // style={"backgrondColor: 'green';"}
                                        onClick={() => { validateAlert(true, row) }}>
                                        Valid
                                    </Fab>
                                </Grid>
                                <Grid item xs={3}>
                                    <Fab variant="extended"
                                        color="default"
                                        aria-label="add" className={is_invalid && has_alert_status ? [classes.button_fluid, classes.fabRed] : classes.button_fluid}
                                        onClick={() => { validateAlert(false, row) }}>
                                        Invalid
                                    </Fab>
                                </Grid>

                                <Grid item xs={3} />{/* PREV IS SPACER */}
                                <Grid item xs={12}><Divider /></Grid>
                            </Fragment>
                        )
                    })}
                    <Grid item xs={12}>
                        <Typography variant="h5" className={classes.label_paddings}>
                            As of {as_of_ts}
                        </Typography>
                        {public_alert}
                        <Typography variant="h5" className={classes.label_paddings}>
                            Status: {candidate_status === 'no_alert' ? "No candidate as of the moment" : candidate_status.toUpperCase()}
                        </Typography>
                        {
                            ![null, ''].includes(validity) && (
                                <Fragment>
                                    <Typography variant="h5" className={classes.label_paddings}>
                                        Validity: {validity}
                                    </Typography>
                                </Fragment>
                            )
                        }
                        {
                            day !== null && (
                                <Typography>Day {day}</Typography>
                            )
                        }
                        {/* Insert rx_data.message for Rainfall Rx extension */}
                        <Grid xs={6}>{rx_data}</Grid>
                    </Grid>
                    {
                        ["valid", "new", "on-going", "extended", "routine", "lowering"].includes(candidate_status) && (
                        // is_release_time && (
                            <Fragment>
                            <Grid item xs={4} />
                            <Grid item xs={4}>
                                <Fab variant="extended"
                                    color="primary"
                                    aria-label="add" className={`${classes.button_fluid} ${classes.releaseEwiButton}`}
                                    onClick={() => releaseEwi(ewi_data)}
                                    disabled={!(all_validated && is_release_time)}
                                    >
                                    Release EWI
                                </Fab>
                            </Grid>
                            <Grid item xs={4} />
                            </Fragment>
                        )
                    }

                </Grid>
            </Container>
            <Snackbar open={openNotif} 
                autoHideDuration={3000} 
                onClose={() => {setOpenNotif(false)}}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                key={'top,right'}>
                <Alert onClose={() => {setOpenNotif(false)}} severity={notifStatus}>
                    {notifText}
                </Alert>
            </Snackbar>
        </Fragment>
    );
}


function CurrentAlertArea(props) {
    const { leo, classes, actions } = props;
    const { sendEmail, download, print } = actions;

    const prepareTriggers = (triggers) => {
        if (triggers.length > 0) {
            return triggers.map(trigger => {
                const { trigger_type, timestamp, info, trigger_source } = trigger;
                return (
                    <Typography variant="h6" className={classes.label_paddings}>
                        {`${moment(timestamp).format("MMMM D, YYYY h:mm A")} | ${trigger_source.toUpperCase()} (${trigger_type}): ${info}`}
                    </Typography>
                );
            });
        } else {
            return (
                <Typography variant="h6" className={classes.label_paddings}>
                    No retriggers
                </Typography>
            )
        }

    };

    if(leo === null){
        return (
            <Grid item xs={12} align="center">
                <Typography variant="h4" align="center">Loading...</Typography>
            </Grid>
            
        );
    }
    else if(leo === "no_alert"){
        return (
            <Grid item xs={12} align="center">
                <Typography variant="h2" align="center">No current alert</Typography>
            </Grid>
            
        );
    }
    else{
        console.log("leo", leo);
        const as_of = moment(leo.data_ts).add(30, "mins").format("dddd, MMMM Do YYYY, h:mm A");
        const event_start = moment(leo.event_start).format("MMMM D, YYYY h:mm A");
        const validity = moment(leo.validity).format("MMMM D, YYYY h:mm A");

        const color_class = identifyAlertStyle(leo.public_alert_level, classes);

        return (
            <Fragment>
                <Grid item xs={6} align="center">
                    <Typography variant="h2" className={[classes.label_paddings, classes.alert_level, color_class]}>
                        {`Alert ${leo.public_alert_level}`}
                    </Typography>
                    <Typography variant="h5">
                        {`As of ${as_of}`}
                    </Typography>
                    {/* <Typography variant="h5">
                        {prepareTriggers(leo.release_triggers)}
                    </Typography> */}
                    <Typography variant="h5" className={classes.label_paddings}>
                        <strong>Event started at </strong>{event_start}
                    </Typography>
                    <Typography variant="h5" className={classes.label_paddings}>
                        {
                            ['lowering', 'extended'].includes(leo.event_status) || (leo.event_status == "on-going" && leo.public_alert_level == 0) ? (
                                <Typography variant="h5">Day <strong>{
                                    "day" in leo ? leo.day : '0'
                                }</strong> of Extended Monitoring</Typography>
                            ) : (
                                <Fragment><strong>Valid until </strong>{validity}</Fragment>
                            )
                        }
                    </Typography>
                    <Typography variant="h5" className={classes.label_paddings}>
                        <strong>Recommended Response:</strong><br />
                        {`${leo.recommended_response}`}
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h2" align="center" className={classes.label_paddings}>
                        Triggers
                    </Typography>
                    {prepareTriggers(leo.latest_event_triggers)}
                </Grid>
                <Grid item xs={12} align="right">
                    <Box style={{ paddingTop: 'auto' }}>
                        Prepared by: {leo.reporter}
                    </Box>
                </Grid>

                <Grid container justify="center" className={classes.menu_functions}>
                    <Grid item xs={2} align="center" >
                        <Fab variant="extended"
                            color="primary"
                            aria-label="add" className={classes.button_fluid}
                            onClick={() => { sendEmail() }}>
                            Email
                        </Fab>
                    </Grid>
                    <Grid item xs={2} align="center">
                        <Fab variant="extended"
                            color="primary"
                            aria-label="add" className={classes.button_fluid}
                            onClick={() => { download() }}>
                            Download
                        </Fab>
                    </Grid>
                    <Grid item xs={2} align="center">
                        <Fab variant="extended"
                            color="primary"
                            aria-label="add" className={classes.button_fluid}
                            onClick={() => { print() }}>
                            Print
                        </Fab>
                    </Grid>
                </Grid>     
            </Fragment>
        );
    }
}

function generatePDFReport(data){
    const thStyle = {
        wordWrap: "break-word",
    };
    const tdStyle = {
        wordWrap: "break-word",
        textAlign: "center"
    };

    let output = (
        <div>
            <h3>Umingan Latest Current Alert Level Information</h3>
            <table id='mar_latest_current_alert' style={{width: "30%", borderSpacing: "5px", marginLeft: "10%"}}>
                <tr>
                    <td width={400} style={thStyle}>Date/Time:</td>
                    <td width={700} style={thStyle}><strong>{data.report_date}</strong></td>
                </tr>
                <tr>
                    <td width={400} style={thStyle}>Alert Level Released:</td>
                    <td width={700} style={thStyle}><strong>Alert {data.public_alert_level} ({data.latest_event_triggers.info}, valid until {data.validity})</strong></td>
                </tr>
                <tr>
                    <td width={400} style={thStyle}>Recommended Response:</td>
                    <td width={700} style={thStyle}><strong>{data.recommended_response}</strong></td>
                </tr>
                <tr>
                    <td width={400} style={thStyle}>Released by:</td>
                    <td width={700} style={thStyle}>{data.reporter}</td>
                </tr>
            </table>
        </div>
    );
    return output;
}

function CurrentAlert() {
    const classes = useStyles();
    const [modal, setModal] = useState([<TransitionalModal status={false} />]);
    // const [leo, setLeo] = useState("empty");
    const [leo, setLeo] = useState(null);
    const [releaseStatus, setReleaseStatus] = useState("No event on site.");
    const [htmlString, setHtmlString] = useState(null);

    const [emailOpen, setEmailOpen] = useState(false);
    const [openNotif, setOpenNotif] = useState(false);
    const [notifText, setNotifText] = useState("");
    const [notifStatus, setNotifStatus] = useState('success');

    useEffect(() => {
        initLatestCurrentAlert();
    }, []);

    const initLatestCurrentAlert = async () => {
        const response = await AlertGeneration.UmiGetOngoingAndExtendedMonitoring();
        const { data, status } = response;
        if (status) {
            let key = "";
            if (data.latest.length > 0) key = "latest";
            else if (data.overdue.length > 0) key = "overdue";
            else if (data.extended.length > 0) key = "extended";

            if (key in data) {
                const site_data = data[key].find(site_data => site_data.site_id === 50);
                setLeo(site_data);
                setHtmlString(generatePDFReport(site_data));
            } else {
                //console.error("There is something wrong with the code in latest current alert");
                setLeo("no_alert");
                console.log("No alert on site");
                setHtmlString(<Typography>No data</Typography>);
            }
        }
    }

    const handleSendEmail = (htmlString, email_data) => async () => {
        const response = await AlertGeneration.SendUmiLatestCurrentAlertReportViaEmail({
            "email_data": email_data,
            "html": renderToString(htmlString),
            "date": moment().format("YYYY-MM-DD hh:mm:ss")
        });
        if (response.status === true) {
            console.log("Email report sent successfully");
            setNotifStatus("success");
            setNotifText("Email report sent successfully");
        } else {
            setNotifStatus("error");
            setNotifText("Email report failed to send");
        }
        setOpenNotif(true);
        setEmailOpen(false);

    };

    const handleDownloadPDF = () => {
        const pdf = new jsPDF();
        var pageHeight = pdf.internal.pageSize.height || pdf.internal.pageSize.getHeight();
        var pageWidth = pdf.internal.pageSize.width || pdf.internal.pageSize.getWidth();

        // Header (URL, file_type, left_margin, top, width, height)
        pdf.addImage(letter_header,"PNG", 0, 0, 221, 15);
        
        // Content
        if(htmlString){
            pdf.text("Umingan Latest Alert Report", 100, 25, {align: "center"});
            // pdf.autoTable({
            //     html: renderToString(htmlString),
            //     startY: 32,
            //     headStyles: {
            //         fillColor: [27, 81, 109],
            //     }
            // })
            pdf.html(
                renderToString(htmlString), {
                    x: 10,
                    y: 32
                }
            )
        } else {
            pdf.text("No Data", 100, 25, {align: "center"});
        }

        // Footer (URL, file_type, left_margin, top, width, height)
        pdf.addImage(letter_footer,"PNG", 0, 272, 212, 20);

        pdf.save('report.pdf')
    };

    // Print table function
    const handlePrintPDF = () => {
        const pdf = new jsPDF();
        
        // Header (URL, file_type, left_margin, top, width, height)
        pdf.addImage(letter_header,"PNG", 0, 0, 221, 15);
        
        // Title
        pdf.text("Umingan Latest Alert Report", 100, 25, {align: "center"});

        // Content
        
        // Footer (URL, file_type, left_margin, top, width, height)
        pdf.addImage(letter_footer,"PNG", 0, 272, 212, 20);

        pdf.autoPrint({variant: 'non-conform'});
        pdf.output('pdfobjectnewwindow');
    };

    function sendEmail() {
        setEmailOpen(true);
        // setModal([<TransitionalModal status={true} />])
        // setTimeout(() => {
        //     setModal([<TransitionalModal status={false} />])
        //     alert("Successfully sent email!")
        // }, 3000)
    }

    function download() {
        handleDownloadPDF();
    }

    function print() {
        handlePrintPDF();
    }

    return (
        <Fragment>
            <Container style={{minHeight: window.innerHeight - 220}}>
                <Grid container spacing={2} justify="center" alignItems="center">
                    <CurrentAlertArea leo={leo} classes={classes} actions={{sendEmail, download, print}} />
                </Grid>
                <EmailModal
                    open={emailOpen}
                    setOpen={setEmailOpen}
                    html={htmlString}
                    handleSubmit={handleSendEmail}
                /> 
            </Container>
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
        </Fragment>
    )
}

export { AlertValidation, CurrentAlert }