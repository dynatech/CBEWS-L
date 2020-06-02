import AppConfig from '../../utils/AppConfig';

const GetAllFamilyRiskProfile = () => {
    return fetch(`${AppConfig.HOSTNAME}/v2/get/risk_assessment/umi/family_risk_profile`, {
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

const InsertFamilyRiskProfile = (data) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/add/risk_assessment/umi/family_risk_profile`, {
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

const UpdateFamilyRiskProfile = (data) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/update/risk_assessment/umi/family_risk_profile`, {
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

const DeleteFamilyRiskProfile = (data) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/delete/risk_assessment/umi/family_risk_profile`, {
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
export { GetAllFamilyRiskProfile, InsertFamilyRiskProfile, UpdateFamilyRiskProfile, DeleteFamilyRiskProfile }