import React, { useState, useEffect } from 'react';
import { renderToString } from 'react-dom/server';
import { Grid, Paper, Typography, Box, Fab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import EmailModal from './EmailModal';

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

function convertToSimpleTable(data_type, rows) {
    // const classes = useStyles();

    return (
        <table border={1}>
            {
                data_type === "incident_report" ? (
                    <tr>
                        <th width={300}>Date</th>
                        <th width={200}>Report Narrative</th>
                        <th width={200}>Reporter</th>
                    </tr>
                ) : (
                    <tr>
                        <th width={200}>Date</th>
                        <th width={200}>Type</th>
                        <th width={200}>Remarks</th>
                        <th width={200}>In-Charge</th>
                        <th width={200}>Updater</th>
                    </tr>
                )
            }
            {
                rows.map((row) => {
                    return data_type === "incident_report" ? (
                        <tr>
                            <td width={300}>{row.incident_date}</td>
                            <td width={200}>{row.incident_report_narrative}</td>
                            <td width={200}>{row.reporter}</td>
                        </tr>
                    ) : (
                        <tr>
                            <td width={200}>{row.maintenance_date}</td>
                            <td width={200}>{row.type}</td>
                            <td width={200}>{row.remarks}</td>
                            <td width={200}>{row.in_charge}</td>
                            <td width={200}>{row.updater}</td>
                        </tr>
                    )
                })
            }
        </table>
    )
}

function PDFPreviewer(props) {
    const img = imageStyle();
    const summary = summaryStyle();
    const { data, dataType: data_type, noImport, classes, handleDownload, handleEmail } = props;
    const [email_data, setEmailData] = useState({
        "recipient_list": [],
        "subject": "",
        "email_body": ""
    });
    const [emailOpen, setEmailOpen] = useState(false);
    const [html, setHtml] = useState("");

    // useEffect(() => {
    //     console.log("data", data);
    //     const html_string = data.length > 0 ? convertToSimpleTable(data_type, data) : (<Typography>No data</Typography>);
    //     console.log("html", html_string);
    //     setHtml(html_string);
    // }, []);
    const html_string = data.length > 0 ? convertToSimpleTable(data_type, data) : (<Typography>No data</Typography>);

    const handleEmailChange = (key) => (event) => {
        const value = event.target.value;
        setEmailData({
            ...email_data,
            [key]: value 
        });
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
                                onClick={handleDownload(html)}
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
                        data={email_data}
                        html={html_string}
                        handleSubmit={handleEmail}
                        handleChange={handleEmailChange}
                    />
                </Grid>
            )}
        </Box>
    );
}

export default PDFPreviewer;