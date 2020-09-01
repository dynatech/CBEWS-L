import React, { useEffect, useState } from 'react';
import { renderToString } from 'react-dom/server';
import { Grid, Paper, Typography, Box, Fab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PDFViewer from '../../reducers/PDFViewer';
import { UmiFieldSurvey } from '@dynaslope/commons';


export default function LatestReportSummary(props) {
    const { classes } = props;
    const [data, setData] = useState([]);

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        const response = await UmiFieldSurvey.GetLatestReportSummary();
        console.log("response", response);
        if (response.status === true) {
            setData(response.data);
        }
    };

    return (
        <PDFViewer 
            date={data.report_date}
            data={data}
            dataType="umi_field_survey"
            noImport={false}
            classes={classes}
            handleDownload={() => console.log("clicked download")}
        />
    );
}
