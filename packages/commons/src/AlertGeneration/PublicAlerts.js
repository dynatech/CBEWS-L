import AppConfig from '../utils/AppConfig';

const MarGetOngoingAndExtendedMonitoring = () => {
    return fetch(`${AppConfig.HOSTNAME}/v2/alert_gen/public_alerts/get_ongoing_and_extended_monitoring/mar`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    }).then((response) => response.json())
        .then((responseJson) => {
            return responseJson
        })
        .catch((error) => {
            console.log(error)
        }
    );
}

const UmiGetOngoingAndExtendedMonitoring = () => {
    return fetch(`${AppConfig.HOSTNAME}/v2/alert_gen/public_alerts/get_ongoing_and_extended_monitoring/umi`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    }).then((response) => response.json())
        .then((responseJson) => {
            return responseJson
        })
        .catch((error) => {
            console.log(error)
        }
    );
}

const InsertEWI = (payload) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/insert/alert_gen/ewi`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    }).then(response => response.json())
        .then((responseJson) => {
            return responseJson
        })
        .catch((error) => {
            console.log("Problem in InsertEWI", error)
        }
    );
}

const GetMarAlertValidationData = () => {
    return fetch(`${AppConfig.HOSTNAME}/v2/get/alert_gen/mar/alert_validation_data`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    }).then(response => response.json())
        .then((responseJson) => {
            return responseJson
        })
        .catch((error) => {
            console.log("Problem in GetMarAlertValidationData", error)
        }
    );
}

const GetUmiAlertValidationData = () => {
    return fetch(`${AppConfig.HOSTNAME}/v2/get/alert_gen/umi/alert_validation_data`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    }).then(response => response.json())
        .then((responseJson) => {
            return responseJson
        })
        .catch((error) => {
            console.log("Problem in GetUmiAlertValidationData", error)
        }
    );
}

const ValidateTrigger = (payload) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/validate_trigger/public_alerts`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    }).then(response => response.json())
        .then((responseJson) => {
            return responseJson
        })
        .catch((error) => {
            console.log("Problem in GetUmiAlertValidationData", error)
        }
    );
}

const SendMarLatestCurrentAlertReportViaEmail = (data) => {
    console.log("data", data);
    return fetch(`${AppConfig.HOSTNAME}/v2/send/latest_current_alert/report`, {
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
        };
    });
}

export { 
    MarGetOngoingAndExtendedMonitoring, UmiGetOngoingAndExtendedMonitoring, 
    GetUmiAlertValidationData, GetMarAlertValidationData,
    InsertEWI, ValidateTrigger, SendMarLatestCurrentAlertReportViaEmail
}
