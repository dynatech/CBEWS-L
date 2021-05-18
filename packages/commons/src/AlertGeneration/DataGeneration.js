import { axiosPOST } from '../utils/AjaxHelper';
import AppConfig from '../utils/AppConfig';

const ChangeServerTime = (server_time, callback) => {
  axiosPOST(`${AppConfig["HOSTNAME"]}/v2/data_gen/change_server_time`, {
    "ts": server_time
  }, response => {
    console.log("response", response);
    callback(response);
  });
}

export {
  ChangeServerTime,
}
