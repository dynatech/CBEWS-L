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

export { MarGetOngoingAndExtendedMonitoring, UmiGetOngoingAndExtendedMonitoring }
