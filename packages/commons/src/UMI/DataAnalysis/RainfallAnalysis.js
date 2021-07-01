import AppConfig from '../../utils/AppConfig';

const GetRainfallPlotData = () => {
    return fetch(`${AppConfig.HOSTNAME}/v2/get/data_analysis/umi/rainfall/plot_data`, {
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
        console.error("Error on fetching all rainfall plot data. Err: ", error);
    });
};


const GetRainfallPlotDataWithDays = (days) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/get/data_analysis/umi/rainfall/plot_data/${days}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    })
    .then((response) => response.json())
    .then((responseJson) => {
        console.log("rainfall responseJson", responseJson);
        return responseJson;
    })
    .catch((error) => {
        console.error(`Error on fetching ${days} days rainfall data. Err: `, error);
    });
};


export { GetRainfallPlotData, GetRainfallPlotDataWithDays }
