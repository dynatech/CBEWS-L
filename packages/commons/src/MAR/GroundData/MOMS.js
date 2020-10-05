import AppConfig from "../../utils/AppConfig";

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

const InsertMomsFeatureType = (data) => {
  return fetch(`${AppConfig.HOSTNAME}/v2/add/ground_data/moms/feature/types`, {
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
      console.error("Error on adding moms feature. Err: ", error);
    });
};

const FetchMoMSFeatures = (data) => {
  // return fetch(`${AppConfig.HOSTNAME}/v2/get/ground_data/moms/feature/types/${site_id}`, {
  return fetch(`${AppConfig.HOSTNAME}/v2/get/ground_data/moms/feature/types`, {
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
      console.error("Error on fetching all moms feature types. Err: ", error);
    });
}

const FetchOneMomsFeatures = (feature_type, site_id) => {
  // return fetch(`${AppConfig.HOSTNAME}/v2/get/ground_data/moms/feature/types/${site_id}`, {
  return fetch(`${AppConfig.HOSTNAME}/v2/get/ground_data/moms/feature/types/${feature_type}`, {
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
      console.error("Error on fetching all moms feature types. Err: ", error);
    });
}

const UpdateMomsFeatureType = (data) => {
  return fetch(`${AppConfig.HOSTNAME}/v2/update/ground_data/moms/feature/types`, {
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
      console.error("Error on updating moms feature. Err: ", error);
    });
};

const DeleteMomsFeatureType = (data) => {
  return fetch(`${AppConfig.HOSTNAME}/v2/delete/ground_data/moms/feature`, {
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
      console.error("Error on deleting moms feature data. Err: ", error);
    });
};

const InsertMomsInstance = (data) => {
  return fetch(`${AppConfig.HOSTNAME}/v2/add/ground_data/moms/instance`, {
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
      console.error("Error on adding moms feature. Err: ", error);
    });
};

const FetchMomsInstances = (feature_id, site_id) => {
  return fetch(`${AppConfig.HOSTNAME}/v2/get/ground_data/moms/instance/${feature_id}/${site_id}`, {
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
      console.error("Error on fetching all moms features. Err: ", error);
    });
};

const UpdateMomsInstance = (data) => {
  return fetch(`${AppConfig.HOSTNAME}/v2/update/ground_data/moms/instance`, {
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
      console.error("Error on updating moms feature. Err: ", error);
    });
};

const DeleteMomsInstance = (data) => {
  return fetch(`${AppConfig.HOSTNAME}/v2/delete/ground_data/moms/instance`, {
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
      console.error("Error on deleting moms instance data. Err: ", error);
    });
};

export { 
  InsertMOMSData, GetMOMSData, UpdateMOMSData, DeleteMOMSData,
  InsertMomsFeatureType, FetchMomsInstances, UpdateMomsFeatureType, DeleteMomsFeatureType,
  InsertMomsInstance, FetchMoMSFeatures, FetchOneMomsFeatures, UpdateMomsInstance, DeleteMomsInstance,
};
