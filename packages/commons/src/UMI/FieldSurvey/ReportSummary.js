import AppConfig from '../../utils/AppConfig';

const GetLatestReportSummary = () => {
    return fetch(`${AppConfig.HOSTNAME}/v2/get/field_survey/umi/latest_report`, {
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

const DownloadLatestReportSummary = (data) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/download/field_survey/umi/latest_report`, {
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

const EmailLatestReportSummary = (data) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/email/field_survey/umi/latest_report`, {
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

export { GetLatestReportSummary, DownloadLatestReportSummary, EmailLatestReportSummary }