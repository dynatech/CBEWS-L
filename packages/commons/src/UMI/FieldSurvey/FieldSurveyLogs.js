import AppConfig from '../../utils/AppConfig';

const GetFieldSurveyLogs = () => {
    // return fetch(`${AppConfig.HOSTNAME}/v2/get/risk_assessment/umi/family_risk_profile`, {
    //     method: 'GET',
    //     headers: {
    //         Accept: 'application/json',
    //         'Content-Type': 'application/json',
    //     }
    // }).then((response) => response.json())
    //     .then((responseJson) => {
    //         return responseJson
    //     })
    //     .catch((error) => {
    //         console.log(error)
    //     }
    // );
}

const InsertFieldSurveyLogs = (data) => {
    // return fetch(`${AppConfig.HOSTNAME}/v2/add/risk_assessment/umi/family_risk_profile`, {
    //     method: 'POST',
    //     headers: {
    //         Accept: 'application/json',
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(data),
    // }).then((response) => response.json())
    //     .then((responseJson) => {
    //         return responseJson
    //     })
    //     .catch((error) => {
    //         console.log(error)
    //     }
    // );
}

const UpdateFieldSurveyLogs = (data) => {
    // return fetch(`${AppConfig.HOSTNAME}/v2/update/risk_assessment/umi/family_risk_profile`, {
    //     method: 'PATCH',
    //     headers: {
    //         Accept: 'application/json',
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(data)
    // }).then((response) => response.json())
    //     .then((responseJson) => {
    //         return responseJson
    //     })
    //     .catch((error) => {
    //         console.log(error)
    //     }
    // );
}

const DeleteFieldSurveyLogs = (data) => {
    // return fetch(`${AppConfig.HOSTNAME}/v2/delete/risk_assessment/umi/family_risk_profile`, {
    //     method: 'DELETE',
    //     headers: {
    //         Accept: 'application/json',
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(data)
    // }).then((response) => response.json())
    //     .then((responseJson) => {
    //         return responseJson
    //     })
    //     .catch((error) => {
    //         console.log(error)
    //     }
    // );
}

export { GetFieldSurveyLogs, InsertFieldSurveyLogs, UpdateFieldSurveyLogs, DeleteFieldSurveyLogs }