import AppConfig from '../../utils/AppConfig';

const GetCurrentSituationReport = () => {
    return fetch(`${AppConfig.HOSTNAME}/v2/get/situation_report/umi/latest_report`, {
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

const DownloadSituationReport = (data) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/download/situation_report/umi/latest_report`, {
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

const EmailSituationReport = (data) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/email/situation_report/umi/latest_report`, {
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

export { GetCurrentSituationReport, DownloadSituationReport, EmailSituationReport }