import React from 'react';
import { renderToString } from 'react-dom/server';
import { Grid, Paper, Typography, Box, Fab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

// const useStyles = makeStyles({
//     table: {
//         minWidth: 650,
//     },
// });

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
        <table style={{border: "1px solid black", width: "100%", borderSpacing: "5px"}}>
            {
                data_type === "incident_report" ? (
                    <tr>
                        <th>Date</th>
                        <th>Report Narrative</th>
                        <th>Reporter</th>
                    </tr>
                ) : (
                    <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Remarks</th>
                        <th>In-Charge</th>
                        <th>Updater</th>
                    </tr>
                )
            }
            {
                rows.map((row) => {
                    return data_type === "incident_report" ? (
                        <tr id={`report-${row.id}`}>
                            <td>{row.incident_date}</td>
                            <td>{row.incident_report_narrative}</td>
                            <td>{row.reporter}</td>
                        </tr>
                    ) : (
                        <tr id={`log-${row.id}`}>
                            <td>{row.maintenance_date}</td>
                            <td>{row.type}</td>
                            <td>{row.remarks}</td>
                            <td>{row.in_charge}</td>
                            <td>{row.updater}</td>
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
    const { data, dataType: data_type, noImport, classes, handleDownload } = props;

    const html = data.length > 0 ? convertToSimpleTable(data_type, data) : (<Typography>No data</Typography>);

    return (
        <Box width="100%">
            <Paper>
                {!noImport && (
                    <Grid item xs={12}>
                        <img src={require('../../assets/letter_header.png')} className={img.img_size} alt="footer" />
                    </Grid>
                )}
                <Grid item xs={12} className={summary.content}>
                    {html}
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
                                onClick={() => {}}
                            >
                                Print
                            </Fab>
                        </Grid>
                    </Grid>
                </Grid>
            )}
        </Box>
    );
}

export default PDFPreviewer;