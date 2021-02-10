import AppConfig from '../../utils/AppConfig';

const GetSubsurfacePlotData = () => {
    console.log("GETTING SUBS");
    return fetch(`${AppConfig.HOSTNAME}/v2/get/data_analysis/umi/subsurface/plot_data`, {
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
        console.error("Error on fetching all subsurface data. Err: ", error);
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
        console.error(`Error on fetching ${days} days subsurface data. Err: `, error);
    });
};

export { GetSubsurfacePlotData, GetSubsurfacePlotDataWithDays }
