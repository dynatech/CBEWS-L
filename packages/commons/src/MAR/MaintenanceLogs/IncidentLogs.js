import AppConfig from '../../utils/AppConfig';
import moment from 'moment';

const GetIncidentLogs = () => {
    return fetch(`${AppConfig.HOSTNAME}/v2/fetch/maintenance/mar/incident_logs`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
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

const GetDayIncidentLogs = (timestamp) => {
    const str_date = moment(timestamp).format("YYYY-MM-DD HH:mm:ss");
    return fetch(`${AppConfig.HOSTNAME}/v2/fetch/day/maintenance/mar/incident_logs/${str_date}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
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

const GetMonthIncidentLogs = (start, end) => {
    console.log("di naman nareject");
    return fetch(`${AppConfig.HOSTNAME}/v2/fetch/month/maintenance/mar/incident_logs/${start}/${end}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
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

const InsertIncidentLogs = (data) => {
    console.log("data", data);
    return fetch(`${AppConfig.HOSTNAME}/v2/add/maintenance/mar/incident_logs`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then((response) => response.json())
    .then((responseJson) => {
        return responseJson;
    })
    .catch((error) => {
        console.error("Problem in common Submit Incident Logs", error);
    });
}

const UpdateIncidentLogs = (data) => {
    console.log("data", data);
    return fetch(`${AppConfig.HOSTNAME}/v2/update/maintenance/mar/incident_logs`, {
        method: 'PATCH',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then((response) => response.json())
    .then((responseJson) => {
        return responseJson;
    })
    .catch((error) => {
        console.error("Problem in common Submit Incident Logs", error);
    });
}

const DeleteIncidentLogs = (data) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/delete/maintenance/mar/incident_logs`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((responseJson) => {
        return responseJson;
    })
    .catch((error) => {
        console.error("Problem in Delete Incident Logs", error);
    });
}

const UploadReportAttachment = (data) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/maintenance/incident_reports/upload_report_attachment`, {
        method: 'POST',
        body: data,
    }).then(response => response.json())
    .then((responseJson) => {
        return responseJson;
    })
    .catch(error => console.error("Problem in Upload Incident Logs", error));
}


export {
    GetIncidentLogs,
    GetDayIncidentLogs,
    GetMonthIncidentLogs,
    InsertIncidentLogs,
    UpdateIncidentLogs,
    DeleteIncidentLogs,
    UploadReportAttachment
}