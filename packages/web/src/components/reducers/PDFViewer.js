import React from 'react';
import { renderToString } from 'react-dom/server';
import { Grid, Paper } from '@material-ui/core';
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
        <TableContainer component={Paper}>
            <Table
                // className={classes.table}
                aria-label="simple table">
                <TableHead>
                    {
                        data_type === "reports" ? (
                            <TableRow>
                                <TableCell align="center">Date Time</TableCell>
                                <TableCell align="center">Report Description</TableCell>
                                <TableCell align="center">Reporter</TableCell>
                                <TableCell align="center">Attachments</TableCell>
                            </TableRow>
                        ) : (
                                <TableRow>
                                    <TableCell align="center">Date Time</TableCell>
                                    <TableCell align="center">Maintenance Type</TableCell>
                                    <TableCell align="center">Remarks</TableCell>
                                    <TableCell align="center">In-Charge</TableCell>
                                    <TableCell align="center">Updater</TableCell>
                                </TableRow>
                            )
                    }
                </TableHead>
                <TableBody>
                    {rows.map((row) => {
                        return data_type === "incident_report" ? (
                            <TableRow>
                                <TableCell align="center">{row.incident_date}</TableCell>
                                <TableCell align="center">{row.incident_report_narrative}</TableCell>
                                <TableCell align="center">{row.reporter}</TableCell>
                                <TableCell align="center">{row.last_ts}</TableCell>
                                {/* <TableCell align="center">{row.attachments}</TableCell> */}
                            </TableRow>
                        ) : (
                                <TableRow>
                                    <TableCell align="center">{row.maintenance_date}</TableCell>
                                    <TableCell align="center">{row.type}</TableCell>
                                    <TableCell align="center">{row.remarks}</TableCell>
                                    <TableCell align="center">{row.in_charge}</TableCell>
                                    <TableCell align="center">{row.updater}</TableCell>
                                </TableRow>
                            )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

function PDFPreviewer(props) {
    console.log(props);
    const img = imageStyle();
    const summary = summaryStyle();
    const { data, dataType: data_type, noImport } = props;

    const html = data.length > 0 ? convertToSimpleTable(data_type, data) : data;

    return (
        <Paper>
            {!noImport && (
                <Grid item xs={12}>
                    {/* <img src={require('../assets/letter_header.png')} className={img.img_size} alt="footer" /> */}
                </Grid>
            )}
            <Grid item xs={12} className={summary.content}>
                {html}
            </Grid>
            {!noImport && (
                <Grid item xs={12}>
                    {/* <img src={require('../assets/letter_footer.png')} className={img.img_size} alt="footer" /> */}
                </Grid>
            )}
        </Paper>
    );
}

export default PDFPreviewer;