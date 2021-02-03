import AppConfig from '../../utils/AppConfig';

const GetSubsurfacePlotData = () => {
    return fetch(`${AppConfig.HOSTNAME}/v2/get/data_analysis/mar/subsurface/plot_data`, {
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

const GetSubsurfacePlotDataWithDays = (days) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/get/data_analysis/umi/subsurface/plot_data/${days}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: null
    })
    .then((response) => {
        console.log(response)
        return response.json()
    })
    .then((responseJson) => {
    
        return responseJson;
    })
    .catch((error) => {
        console.error("Error on fetching all surficial markers data. Err: ", error);
    });
};

export { GetSubsurfacePlotData, GetSubsurfacePlotDataWithDays }
