import AppConfig from '../utils/AppConfig';

const GetEarthquakeData = () => {
    return fetch(`${AppConfig.HOSTNAME}/v2/fetch/sensor_data/mar/earthquake`, {
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
        console.error("Error on fetching earthquake data. Err: ", error);
    });
};

export {
    GetEarthquakeData,
}