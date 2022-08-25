import AppConfig from '../../utils/AppConfig';

const GetRainfallPlotData = () => {
    return fetch(`${AppConfig.HOSTNAME}/v2/get/data_analysis/mar/rainfall/plot_data`, {
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
        console.error("Error on fetching rainfall plot data. Err: ", error);
    });
};

const GetRainfallPlotDataWithDays = (days) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/get/data_analysis/mar/rainfall/plot_data/${days}`, {
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
        console.error("Error on fetching rainfall plot data. Err: ", error);
    });
};

const GetRainfallAnalysis = () => {
    // return fetch(`${AppConfig.HOSTNAME}/v2/get/data_analysis/mar/rainfall/plot_analysis`, {
    //     method: 'GET',
    //     headers: {
    //         Accept: 'application/json',
    //         'Content-Type': 'application/json',
    //     }
    // })
    // .then((response) => response.json())
    // .then((responseJson) => {
    //     return responseJson;
    // })
    // .catch((error) => {
    //     console.error("Error on fetching rainfall analysis. Err: ", error);
    // });
    let rainfall = require('../../../../web/public/dummy_data/rainfall.json');
    console.log(rainfall);
    return rainfall;
}

export { GetRainfallPlotData, GetRainfallAnalysis, GetRainfallPlotDataWithDays }
