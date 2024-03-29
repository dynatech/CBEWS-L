import AppConfig from '../../utils/AppConfig';

const GetHazardMaps = () => {
    return fetch(`${AppConfig.HOSTNAME}/v2/get/risk_assessment/umi/hazard_map`, {
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
    return fetch(`${AppConfig.HOSTNAME}/v2/upload/risk_assessment/umi/hazard_map`, {
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
