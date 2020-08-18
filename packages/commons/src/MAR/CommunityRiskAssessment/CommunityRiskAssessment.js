import AppConfig from '../../utils/AppConfig';

const UploadCommunityRiskAssessment = (data) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/upload/community_risk_assessment/mar/community_risk_assessment`, {
        method: 'POST',
        body: data,
    }).then(response => response.json())
    .then(responseJson => {
        return responseJson;
    })
    .catch(error => console.error(error));
}

const GetCommunityRiskAssessment = () => {
    const input = {
        "path": `${AppConfig.MARIRONG_DIR}/DOCUMENTS`
    }
    return fetch(`${AppConfig.HOSTNAME}/v2/get/community_risk_assessment/mar/community_risk_assessment`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
    }).then(response => response.json())
    .then(responseJson => {
        return responseJson;
    })
    .catch(error => console.error(error));
}

const DownloadCommunityRiskAssessmentFile = (filename) => {
    window.location.href = `${AppConfig.HOSTNAME}/v2/download/community_risk_assessment/mar/community_risk_assessment/${filename}`;
}

const DeleteCommunityRiskAssessment = (filename) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/delete/community_risk_assessment/mar/community_risk_assessment`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename }),
    }).then(response => response.json())
    .then(responseJson => {
        return responseJson;
    })
    .catch(error => console.error(error));
}

export { 
    UploadCommunityRiskAssessment,
    GetCommunityRiskAssessment,
    DownloadCommunityRiskAssessmentFile,
    DeleteCommunityRiskAssessment
}
