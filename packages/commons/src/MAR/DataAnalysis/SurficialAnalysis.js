import AppConfig from '../../utils/AppConfig';

const GetSurficialPlotData = () => {
    return fetch(`${AppConfig.HOSTNAME}/v2/get/data_analysis/mar/surficial/plot_data`, {
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
        console.error("Error on fetching all surficial markers data. Err: ", error);
    });
};

const GetSurficialPlotAnalysis = () => {
    return fetch(`${AppConfig.HOSTNAME}/v2/get/data_analysis/mar/surficial/plot_analysis`, {
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
        console.error("Error on fetching surficial analysis. Err: ", error);
    });
};

export { GetSurficialPlotData, GetSurficialPlotAnalysis }
