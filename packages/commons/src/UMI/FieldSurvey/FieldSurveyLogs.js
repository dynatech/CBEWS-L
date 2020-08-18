import AppConfig from '../../utils/AppConfig';

const GetFieldSurveyLogs = () => {
    return fetch(`${AppConfig.HOSTNAME}/v2/get/field_survey/umi/field_survey_logs`, {
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

const InsertFieldSurveyLogs = (data) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/add/field_survey/umi/field_survey_logs`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    }).then((response) => response.json())
        .then((responseJson) => {
            return responseJson
        })
        .catch((error) => {
            console.log(error)
        }
    );
}

const UpdateFieldSurveyLogs = (data) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/update/field_survey/umi/field_survey_logs`, {
        method: 'PATCH',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then((response) => response.json())
        .then((responseJson) => {
            return responseJson
        })
        .catch((error) => {
            console.log(error)
        }
    );
}

const DeleteFieldSurveyLogs = (data) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/delete/field_survey/umi/field_survey_logs`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then((response) => response.json())
        .then((responseJson) => {
            return responseJson
        })
        .catch((error) => {
            console.log(error)
        }
    );
}

const UpdateAttachmentFile = (data) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/update/field_survey/umi/attachment`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then((response) => response.json())
        .then((responseJson) => {
            return responseJson
        })
        .catch((error) => {
            console.log(error)
        }
    );
}

export { GetFieldSurveyLogs, InsertFieldSurveyLogs, UpdateFieldSurveyLogs, DeleteFieldSurveyLogs, UpdateAttachmentFile }