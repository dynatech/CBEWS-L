import AppConfig from '../../utils/AppConfig';

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

const InsertIncidentLogs = (data) => {
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
        console.error("Problem in common SubmitCAV", error);
    });
}

const UpdateIncidentLogs = (data) => {
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
        console.error("Problem in common SubmitCAV", error);
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
        console.error("Problem in Delete CAV", error);
    });
}

export {
    GetIncidentLogs,
    InsertIncidentLogs,
    UpdateIncidentLogs,
    DeleteIncidentLogs
}