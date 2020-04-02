import {SITE_CODE} from './site-util'

const cookies = new (require('react-cookie').Cookies)();
// import cookies from 'react-cookie.Cookies'
// const cookieStore = new Cookies();
const assign = require('lodash.assign');
const prefix = `${SITE_CODE || '_rca_fdj_'}`;
const prefixLen = prefix.length;

const setCookie = (name, value, options) => {
  return cookies.set(`${prefix}_${name}`, value, options);
};

const getCookie = (key) => {
  return cookies.get(`${prefix}_${key}`);
};

const getAllCookies = () => {
  let allCookies = cookies.getAll();
  let siteCookies = Object.keys(allCookies).filter(rawKey => {
    return rawKey.startsWith(prefix);
  }).map(rawKey => ({
    [rawKey.substr(prefixLen)]: allCookies.get(rawKey)
  }));

  return assign({}, ...siteCookies);
};

const removeCookie = (key) => {
  let value = cookies.get(`${prefix}_${key}`);
  cookies.remove(`${prefix}_${key}`);
  return value;
};

const removeAllCookies = () => {
  let allCookies = cookies.getAll();

  return Object.keys(allCookies).reduce((_siteCookies, key) => {
    if (key.startsWith(prefix)) {
      _siteCookies.push(cookies.get(key));
      cookies.remove(key);
    }
    return _siteCookies;
  }, []);
  //
  // let siteCookieRawKeys = Object.keys(allCookies).filter(rawKey => {
  //   return rawKey.startsWith(prefix);
  // });
  // let siteCookies = siteCookieRawKeys.map(rawKey => ({
  //   [rawKey.substr(prefixLen)]: allCookies[rawKey]
  // }));
  // siteCookieRawKeys.forEach(rawKey => {
  //   cookies.remove(rawKey);
  // });
  // return siteCookies;
};

export {setCookie, getCookie, getAllCookies, removeCookie, removeAllCookies};
