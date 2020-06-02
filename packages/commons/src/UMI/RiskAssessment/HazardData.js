import AppConfig from '../../utils/AppConfig';

const GetAllHazardData = () => {
    return fetch(`${AppConfig.HOSTNAME}/v2/get/risk_assessment/umi/hazard_data`, {
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

const InsertHazardData = (data) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/add/risk_assessment/umi/hazard_data`, {
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

const UpdateHazardData = (data) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/update/risk_assessment/umi/hazard_data`, {
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

const DeleteHazardData = (data) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/delete/risk_assessment/umi/hazard_data`, {
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
export { GetAllHazardData, InsertHazardData, UpdateHazardData, DeleteHazardData }