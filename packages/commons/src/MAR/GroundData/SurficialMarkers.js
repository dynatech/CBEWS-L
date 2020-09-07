import AppConfig from '../../utils/AppConfig';

const InsertSurficialMarkersData = (data) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/add/ground_data/surficial_markers`, {
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
        console.error("Error on adding surficial markers data. Err: ", error);
    });
};

const UpdateSurficialMarkerData = (data) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/modify/ground_data/surficial_markers`, {
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
        console.error("Error on updating surficial markers data. Err: ", error);
    });
};

const GetSurficialMarkersData = () => {
    return fetch(`${AppConfig.HOSTNAME}/v2/get/ground_data/mar/surficial_markers`, {
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

const DeleteSurficialMarkersData = (data) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/delete/mar/events_template`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((responseJson) => {
        return responseJson;
    })
    .catch((error) => {
        console.error("Error on deleting surficial markers data. Err: ", error);
    });
};

export { 
    InsertSurficialMarkersData,
    UpdateSurficialMarkerData,
    GetSurficialMarkersData,
    DeleteSurficialMarkersData,
}