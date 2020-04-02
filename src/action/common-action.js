import {requestPost} from "./action";

const ACTION_TYPE = {
  CREATE: 'C',
  QUERY: 'R',
  UPDATE: 'U',
  DELETE: 'D',
  COPY: 'COPY',
  LOGIN: 'LI',
  LOGOUT: 'LO',
};

const action_log_url = 'logger/api_record';
const track_log_url = 'logger/page_record';

const actionDataLogger = (funcName, data, userAction) => {
  // data.userAction = actionType;
  // console.log(data);
  requestPost(action_log_url, { funcName, userAction, userActionJson: JSON.stringify(data) });
};

const actionFormDataLogger = (funcName, formData, userAction) => {
  let data = {};
  formData.forEach((value, key) => {
    if (value instanceof File) return;

    if (!data.hasOwnProperty(key)){
      data[key] = value;
      return;
    }
    if (!Array.isArray(data[key])){
      data[key] = [data[key]];
    }
    data[key].push(value);
  });
  // data.userAction = actionType;
  // console.log(data);
  requestPost(action_log_url, { funcName, userAction, userActionJson: JSON.stringify(data) });
};

const trackLogger = (funcName) => {
  requestPost(track_log_url, {funcName});
};

export {
  ACTION_TYPE,
  actionDataLogger,
  actionFormDataLogger,
  trackLogger
};
