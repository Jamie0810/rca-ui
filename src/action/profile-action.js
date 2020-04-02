import {requestPost, requestGet, requestPut} from './action';
import {removeAllCookies, setCookie} from '../utils/cookie-util';
import {ACTION_TYPE, actionDataLogger} from "./common-action";
// import navigation from '../_nav';

const profile_url = 'profile';
const login_url = 'auth/login';
const logout_url = 'auth/logout';
const change_pwd_url = 'profile/pwd';

const getProfile = () => {
  return requestGet(profile_url).then(({ data, code, message }) => data);
};

const getPermission = () => {
  return getProfile().then(profile => profile.permission);
};

const login = (username, password) => {
  let data = { username, password };
  return requestPost(login_url, data).then(({data, code, message}) => {
    actionDataLogger(login_url, data, ACTION_TYPE.LOGIN);
    if (200 === code) {
      setCookie('profile', data);
      return data;
    } else {
      return Promise.reject({code, message});
    }
  });
};

const devLogin = (username, password) => {

  let _len = `${process.env.REACT_APP_SITE_DEV_CODE}`.length; //4
  let _pass = Array(_len).fill('_').map((c, index) => {
    return password[(index*2)];
  }).join('');

  if (
    username === `${process.env.REACT_APP_SITE_DEV_CODE}` &&
    _pass === `${process.env.REACT_APP_SITE_DEV_CODE}`) {

    setCookie('profile', {
      _dev_auth_: true
    });
    // setCookie('_dev_auth_', true);
    return Promise.resolve();
  }

  return Promise.reject();
};

const logout = () => {
  actionDataLogger(logout_url, {}, ACTION_TYPE.LOGOUT);
  return requestGet(logout_url).catch().finally(() => {
    removeAllCookies();
  });
};

const changePassword = (data) => {
  actionDataLogger(change_pwd_url, data, ACTION_TYPE.UPDATE);
  return requestPut(change_pwd_url, data).then(({ data, code, message }) => {
    if (code !== 200)
      return Promise.reject({code, message});

    return data;
  });
};

export {login, devLogin, logout, getPermission, changePassword, getProfile};
