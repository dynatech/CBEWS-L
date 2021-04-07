import AppConfig from '../../utils/AppConfig';

const InsertOnDemandData = (data) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/add/ground_data/on_demand`, {
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
        console.error("Error on adding on demand data. Err: ", error);
    });
};

const GetOnDemandData = () => {
    return fetch(`${AppConfig.HOSTNAME}/v2/fetch/ground_data/mar/on_demand`, {
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
        console.error("Error on fetching all on demand data. Err: ", error);
    });
};


// const UpdateSurficialMarkerData = (data) => {
//     return fetch(`${AppConfig.HOSTNAME}/v2/modify/ground_data/surficial_markers`, {
//         method: 'PATCH',
//         headers: {
//             Accept: 'application/json',
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//     }).then((response) => response.json())
//     .then((responseJson) => {
//         return responseJson;
//     })
//     .catch((error) => {
//         console.error("Error on updating on demand data. Err: ", error);
//     });
// };

// const DeleteSurficialMarkersData = (data) => {
//     return fetch(`${AppConfig.HOSTNAME}/v2/delete/mar/events_template`, {
//         method: 'DELETE',
//         headers: {
//             Accept: 'application/json',
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//     })
//     .then((response) => response.json())
//     .then((responseJson) => {
//         return responseJson;
//     })
//     .catch((error) => {
//         console.error("Error on deleting on demand data. Err: ", error);
//     });
// };

const RaiseOnDemandAlert = (data) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/raise/ground_data/on_demand`, {
        method: 'POST',
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
        console.error("Error on raising on demand data. Err: ", error);
    });
};

export { 
    InsertOnDemandData,
    GetOnDemandData,
    RaiseOnDemandAlert,
};
