import AppConfig from '../../utils/AppConfig';

const GetLatestReportSummary = () => {
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

const DownloadLatestReportSummary = () => {

}

const EmailLatestReportSummary = () => {

}

export { GetLatestReportSummary, DownloadLatestReportSummary, EmailLatestReportSummary }