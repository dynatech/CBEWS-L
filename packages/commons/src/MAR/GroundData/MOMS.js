import AppConfig from "../../utils/AppConfig";

const FetchMOMSFeatures = (feature_id, site_id) => {
  return fetch(`${AppConfig.HOSTNAME}/v2/get/ground_data/moms/feature/${feature_id}/${site_id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((responseJson) => {
        console.log("SAMPLE DATA", responseJson);   
      return responseJson;
    })
    .catch((error) => {
      console.error("Error on fetching all moms features. Err: ", error);
    });
};

const InsertMOMSData = (data) => {
  return fetch(`${AppConfig.HOSTNAME}/v2/add/ground_data/mar/moms`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson;
    })
    .catch((error) => {
      console.error("Error on adding moms data. Err: ", error);
    });
};

const UpdateMOMSData = (data) => {
  return fetch(`${AppConfig.HOSTNAME}/v2/update/ground_data/moms`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson;
    })
    .catch((error) => {
      console.error("Error on updating moms data. Err: ", error);
    });
};

const GetMOMSData = () => {
  return fetch(`${AppConfig.HOSTNAME}/v2/get/ground_data/mar/moms`, {
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
    .catch((error) => {
      console.error("Error on fetching all moms data. Err: ", error);
    });
};

const DeleteMOMSData = (data) => {
  return fetch(`${AppConfig.HOSTNAME}/v2/delete/ground_data/moms`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson;
    })
    .catch((error) => {
      console.error("Error on deleting moms data. Err: ", error);
    });
};

export { FetchMOMSFeatures, InsertMOMSData, UpdateMOMSData, GetMOMSData, DeleteMOMSData };
