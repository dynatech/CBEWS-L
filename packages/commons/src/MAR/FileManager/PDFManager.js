import AppConfig from '../../utils/AppConfig';
import moment from 'moment';

const RenderPDF = (module_type, filename, html_string) => {
    let api;
    switch(module_type){
        case "mar_maintenance_logs":
            api = "write/mar/maintenance_log/pdf";
            break;
        case "mar_incident_logs":
            api = "write/mar/incident_log/pdf";
            break;
        case "umi_situation_reports":
            api = "write/umi/situation_report/pdf";
            break;
        default:
            pass
    }

    return fetch(`${AppConfig.HOSTNAME}/v2/${api}`, {
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

const DownloadPDF = (filename) => {
    let api;
    switch(module_type){
        case "mar_maintenance_logs":
            api = `download/mar/maintenance_log/${filename}`;
            break;
        case "mar_incident_logs":
            api = `download/mar/incident_log/${filename}`;
            break;
        case "umi_situation_reports":
            api = `download/umi/situation_report/${filename}`;
            break;
        default:
            pass
    }
    window.location.href = `${AppConfig.HOSTNAME}/v2/${api}`;
}
export { RenderPDF, DownloadPDF, }
