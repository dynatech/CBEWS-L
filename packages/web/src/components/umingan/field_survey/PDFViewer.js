import React, { useEffect, useState } from 'react';
import { renderToString } from 'react-dom/server';
import { Grid, Paper, Typography, Box, Fab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { UmiFieldSurvey } from '@dynaslope/commons';
 
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

function convertToSimpleTable(data) {
    // const classes = useStyles();

    return (
        <table style={{width: "30%", borderSpacing: "5px", marginLeft: "10%"}}>
            <tr>
                <td><strong>Date:</strong></td>
                <td>{data.report_date}</td>
                <td>&nbsp;</td>
            </tr>
            <tr>
                <td><strong>Features:</strong></td>
                <td>{data.feature}</td>
                <td>&nbsp;</td>
            </tr>
            <tr>
                <td><strong>Materials Characterization:</strong></td>
                <td>{data.materials_characterization}</td>
                <td>&nbsp;</td>
            </tr>
            <tr>
                <td><strong>Mechanism:</strong></td>
                <td>{data.mechanism}</td>
                <td>&nbsp;</td>
            </tr>
            <tr>
                <td><strong>Exposure:</strong></td>
                <td>{data.exposure}</td>
                <td>&nbsp;</td>
            </tr>
            <tr>
                <td><strong>Report Narrative:</strong></td>
                <td>{data.report_narrative}</td>
                <td>&nbsp;</td>
            </tr>
        </table>
    )
}

function PDFPreviewer(props) {
    const img = imageStyle();
    const summary = summaryStyle();
    const { noImport, classes, handleDownload } = props;
    const [data, setData] = useState([]);

    const html = data.length > 0 ? convertToSimpleTable(data[0]) : (<Typography>No data</Typography>);

    useEffect(() => {
        initPDFViewer();
    }, []);

    const initPDFViewer = async () => {
        const response = await UmiFieldSurvey.GetLatestReportSummary();
        console.log("response", response);
        if (response.status === true) {
            setData(response.data);
        }

    };

    return (
        <Box width="100%">
            <Paper>
                {!noImport && (
                    <Grid item xs={12}>
                        <img src={require('../../../assets/letter_header.png')} className={img.img_size} alt="footer" />
                    </Grid>
                )}
                <Grid item xs={12} className={summary.content}>
                    {html}
                </Grid>
                {!noImport && (
                    <Grid item xs={12}>
                        <img src={require('../../../assets/letter_footer.png')} className={img.img_size} alt="footer" />
                    </Grid>
                )}
            </Paper>
            {/* {data.length > 0 && (
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
            )} */}
        </Box>
    );
}

export default PDFPreviewer;