import { axiosPOST } from '../utils/AjaxHelper';
import AppConfig from '../utils/AppConfig';

const ChangeServerTime = (server_time, callback) => {
  axiosPOST(`${AppConfig["HOSTNAME"]}/v2/data_gen/change_server_time`, {
    "ts": server_time
  }, response => {
    console.log("ChangeServerTime response", response);
    callback(response);
  });
};

const AddRainfallTrigger = (payload, callback) => {
  axiosPOST(
    `${AppConfig["HOSTNAME"]}/v2/data_gen/add/rainfall`,
    payload,
    response => {
      console.log("AddRainfallTrigger response", response);
      callback(response);
    });
};

const AddSurficialTrigger = (payload, callback) => {
  axiosPOST(
    `${AppConfig["HOSTNAME"]}/v2/data_gen/add/surficial`,
    payload,
    response => {
      console.log("AddSurficialTrigger response", response);
      callback(response);
    });
};

const AddSubsurfaceTrigger = (payload, callback) => {
  axiosPOST(
    `${AppConfig["HOSTNAME"]}/v2/data_gen/add/subsurface`,
    payload,
    response => {
      console.log("AddSubsurfaceTrigger response", response);
      callback(response);
    });
};

export {
  ChangeServerTime,
  AddRainfallTrigger,
  AddSurficialTrigger,
  AddSubsurfaceTrigger,
}
