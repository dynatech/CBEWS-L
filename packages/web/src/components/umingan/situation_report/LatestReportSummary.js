import React, { useEffect, useState } from 'react';
import moment from "moment";
import { renderToString } from 'react-dom/server';
import { Grid, Paper, Typography, Box, Fab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { UmiSituationReport } from '@dynaslope/commons';
import PDFPreviewer from '../../reducers/PDFViewer';


export default function LatestReportSummary(props) {
    const { classes } = props;
    const [data, setData] = useState([]); 

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        const response = await UmiSituationReport.GetCurrentSituationReport();
        if (response.status === true) {
            console.log(response);
            setData(response.data);
        }
    };

    const handleSituationReportDownload = (html) => async () => {
        const file_date = moment(data["report_ts"]).format("YYYY-MM-DD");
        const filename = `${file_date}_situation_log.pdf`;
        const response = await UmiSituationReport.RenderPDF(filename, renderToString(html));
        if (response.status === true) {
            UmiSituationReport.DownloadPDF(filename);
        }
    };

    return (
        <PDFPreviewer
            date={data.report_ts}
            data={data}
            dataType="umi_situation_report"
            noImport={false}
            classes={classes}
            handleDownload={handleSituationReportDownload} 
        />
    );
}
