import {ajax} from "jquery";
import {API_SERVICE_BASE_URL} from '../utils/site-util'

// let sessionId = getCookie('sessionId') || null;

  const request = (path, method = 'get', params = {}, options= {}) => {
  return new Promise((resolve, reject) => {
    let config = {
      url: `${API_SERVICE_BASE_URL}/${path}`,
      // cache: false,
      xhrFields: {
        withCredentials: true
      },
      // beforeSend: (request) => {
      //   request.setRequestHeader("Cookie", sessionId);
      // },
      // crossDomain: true,
      type: method,
      dataType: 'json',
      contentType: (undefined === options.contentType)? "application/json": options.contentType,
      processData: options.processData,
      data: params
    };

    ajax(config).done(result => {
      // if (result.code > 400 && result.code < 500)
      //   toLogin();
      if (result.code < 200 || result.code > 499) {
        window.location.hash = '500';
        reject(result);
      } else {
        resolve(result);
      }
    }).fail(error => {
      if (!error)
        window.location.hash = '500';
      else if (401 === error.status)
        window.location.hash = `#/login${window.location.hash}`;
      else
        reject(error);
    });
  });
};

const requestGet = (url, params = {}) => {
  // params.sessionId = sessionId;
  return request(url, 'get', params).then(response => response);
};

const requestDelete = (url, params = {}) => {
  // params.sessionId = sessionId;
  return request(url, 'delete', params).then(response => response);
};

const requestPost = (url, params = {}) => {
  // params.sessionId = sessionId;
  return request(url, 'post', JSON.stringify(params)).then(response => response);
};

const requestPut = (url, params = {}) => {
  // params.sessionId = sessionId;
  return request(url, 'put', JSON.stringify(params)).then(response => response);
};

const requestMultipart = (url, formData) => {
  return request(url, 'post', formData, {
    contentType: false,
    processData: false,
  }).then(response => response);
};

// const setSession = (session_id) => {
//   sessionId = session_id;
// };

export {
  // setSession,
  requestDelete,
  requestGet,
  requestPost,
  requestPut,
  requestMultipart
};
