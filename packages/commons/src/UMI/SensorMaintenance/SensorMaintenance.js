import AppConfig from '../../utils/AppConfig';
import moment from 'moment';

const GetSensorMaintenanceLogs = () => {
    return fetch(`${AppConfig.HOSTNAME}/v2/fetch/sensor_maintenance/umi/logs`, {
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

const GetDaySensorMaintenanceLogs = (timestamp) => {
    const str_date = moment(timestamp).format("YYYY-MM-DD HH:mm:ss");
    return fetch(`${AppConfig.HOSTNAME}/v2/fetch/day/sensor_maintenance/umi/logs/${str_date}`, {
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

const GetMonthSensorMaintenanceLogs = (start, end) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/fetch/month/sensor_maintenance/umi/logs/${start}/${end}`, {
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

const InsertSensorMaintenanceLogs = (data) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/add/sensor_maintenance/umi/logs`, {
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
        console.error("Problem in commons Insert Sensor Maintenance Logs", error);
    });
}

const UpdateSensorMaintenanceLogs = (data) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/update/sensor_maintenance/umi/logs`, {
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

const DeleteSensorMaintenanceLogs = (data) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/delete/sensor_maintenance/umi/logs`, {
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
    GetSensorMaintenanceLogs,
    GetDaySensorMaintenanceLogs,
    GetMonthSensorMaintenanceLogs,
    InsertSensorMaintenanceLogs,
    UpdateSensorMaintenanceLogs,
    DeleteSensorMaintenanceLogs,
}