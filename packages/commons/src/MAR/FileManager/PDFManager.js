import AppConfig from '../../utils/AppConfig';
import moment from 'moment';

const RenderPDF = (filename, html_string) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/write_pdf`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            html: html_string,
            filename
        })
    })
    .then((response) => response.json())
    .then((responseJson) => {
        return responseJson;
    })
    .catch((error) => {
        return {
            "status": false,
            "message": error
        }
    });
}

const DownloadPDF = (html_string) => {
    window.location.href = `${AppConfig.HOSTNAME}/v2/download/mar/maintenance_log/${html_string}`;
}


const SendPDFReportViaEmail = (data) => {
    // Data -> html, recipient, subject
    return fetch(`${AppConfig.HOSTNAME}/v2/send/report/pdf`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then((response) => response.json())
    .then((responseJson) => {
        return responseJson;
    })
    .catch((error) => {
        return {
            "status": false,
            "message": error
        }
    });
}

export { RenderPDF, DownloadPDF, SendPDFReportViaEmail }
