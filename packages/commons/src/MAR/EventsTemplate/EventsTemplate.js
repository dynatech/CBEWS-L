import AppConfig from '../../utils/AppConfig';

const InsertEventsTemplate = (data) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/add/mar/events_template`, {
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
        console.error("Error on adding events template. Err: ", error);
    });
};

const UpdateEventsTemplate = (data) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/update/mar/events_template`, {
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
        console.error("Error on updating events template. Err: ", error);
    });
};

const GetAllEventsTemplate = () => {
    return fetch(`${AppConfig.HOSTNAME}/v2/fetch/mar/events_template`, {
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
        console.error("Error on fetching all events template. Err: ", error);
    });
};

const DeleteEventsTemplate = (data) => {
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
        console.error("Error on deleting events template. Err: ", error);
    });
};

export { 
    InsertEventsTemplate, 
    UpdateEventsTemplate,
    GetAllEventsTemplate,
    DeleteEventsTemplate,
}