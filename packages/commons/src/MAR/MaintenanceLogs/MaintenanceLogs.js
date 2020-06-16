import AppConfig from '../../utils/AppConfig';

const GetMaintenanceLogs = () => {
    return fetch(`${AppConfig.HOSTNAME}/v2/fetch/maintenance/mar/maintenance_logs`, {
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

const InsertMaintenanceLogs = (data) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/add/maintenance/mar/maintenance_logs`, {
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

const UpdateMaintenanceLogs = () => {

}

const DeleteMaintenanceLogs = () => {

}

export {
    GetMaintenanceLogs,
    InsertMaintenanceLogs,
    UpdateMaintenanceLogs,
    DeleteMaintenanceLogs
}