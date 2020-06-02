import AppConfig from '../../utils/AppConfig';

const GetHazardMaps = () => {
    fetch(`${AppConfig.HOSTNAME}/v2/get/community_risk_assessment/mar/hazard_map/51`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    })
    .then((response) => response.json())
    .then((responseJson) => {
        return responseJson;
    })
    .catch((error) => console.error("Problem in commons GetHazMap", error));
};

const UploadHazardMaps = (data) => {
    fetch(`${AppConfig.HOSTNAME}/v2/upload/community_risk_assessment/mar/hazard_map`, {
        method: "POST",
        body: data,
    })
    .then((response) => response.json())
    .then((responseJson) => {
        return responseJson;
    })
    .catch((error) => console.error("Problem in commons UploadHazmaps", error));
};

export {
    GetHazardMaps,
    UploadHazardMaps,
}
