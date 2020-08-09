import AppConfig from '../../utils/AppConfig';
import moment from 'moment';

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

const GetDayMaintenanceLogs = (timestamp) => {
    const str_date = moment(timestamp).format("YYYY-MM-DD HH:mm:ss");
    return fetch(`${AppConfig.HOSTNAME}/v2/fetch/day/maintenance/mar/maintenance_logs/${str_date}`, {
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

const GetMonthMaintenanceLogs = (start, end) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/fetch/month/maintenance/mar/maintenance_logs/${start}/${end}`, {
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

const UpdateMaintenanceLogs = (data) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/update/maintenance/mar/maintenance_logs`, {
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

const DeleteMaintenanceLogs = (data) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/delete/maintenance/mar/maintenance_logs`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((responseJson) => {
        console.log(responseJson);
        return responseJson;
    })
    .catch((error) => {
        console.error("Problem in Delete CAV", error);
    });
}

export {
    GetMaintenanceLogs,
    GetDayMaintenanceLogs,
    GetMonthMaintenanceLogs,
    InsertMaintenanceLogs,
    UpdateMaintenanceLogs,
    DeleteMaintenanceLogs
}