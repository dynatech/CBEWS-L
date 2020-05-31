import AppConfig from '../../utils/AppConfig';

const GetAllResourceAndCapacities = () => {
    return fetch(`${AppConfig.HOSTNAME}/v2/get/risk_assessment/umi/resource_and_capacities`, {
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

const InsertResourceAndCapacities = (data) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/add/risk_assessment/umi/resource_and_capacities`, {
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

const UpdateResourceAndCapacities = (data) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/update/risk_assessment/umi/resource_and_capacities`, {
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

const DeleteResourceAndCapacities = (data) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/delete/risk_assessment/umi/resource_and_capacities`, {
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
export { GetAllResourceAndCapacities, InsertResourceAndCapacities, UpdateResourceAndCapacities, DeleteResourceAndCapacities }