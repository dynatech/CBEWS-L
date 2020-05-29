import AppConfig from '../../utils/AppConfig';

const GetAllSummary = () => {
    return fetch(`${AppConfig.HOSTNAME}/v2/get/risk_assessment/umi/summary`, {
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

const InsertSummary = (data) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/add/risk_assessment/umi/summary`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
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

const UpdateSummary = (data) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/update/risk_assessment/umi/summary`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
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


const DeleteSummary = (data) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/delete/risk_assessment/umi/summary`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
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

export { GetAllSummary, InsertSummary, UpdateSummary, DeleteSummary }