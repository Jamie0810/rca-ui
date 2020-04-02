import {requestGet, requestPost, requestPut} from './action';
import {ACTION_TYPE, actionDataLogger} from "./common-action";
import format from 'string-template';

const role_list_url = 'roles';
const role_list_more_url = 'roles/more';
const role_get_url = 'roles/{id}';
const role_create_url = role_list_url;
const role_update_url = role_get_url;
const user_list_url = 'users';
const user_get_url = 'users/{account}';
const user_update_url = user_get_url;
const user_create_url = user_list_url;
const user_reset_pwd_url = 'users/{account}/pwd';

const getUser = account => {
  let url = format(user_get_url, {account});
  actionDataLogger(url, {}, ACTION_TYPE.QUERY);
  return requestGet(url).then(({ data, code, message }) => data);
};

const getUsers = criteria => {
  actionDataLogger(user_list_url, criteria, ACTION_TYPE.QUERY);
  return requestGet(user_list_url, criteria).then(({ data, code, message }) => data);
};

const createUser = data => {
  actionDataLogger(user_create_url, data, ACTION_TYPE.CREATE);
  return requestPost(user_create_url, data).then(({ data, code, message }) => data);
};

const updateUser = (account, data) => {
  let url = format(user_update_url, {account});
  actionDataLogger(url, data, ACTION_TYPE.UPDATE);
  return requestPut(url, data).then(({ data, code, message }) => data);
};

const resetPassword = (account, password) => {
  let url = format(user_reset_pwd_url, {account});
  let data = { password };
  actionDataLogger(url, data, ACTION_TYPE.UPDATE);
  return requestPut(url, data).then(({ data, code, message }) => data);
};

const getRoles = () => {
  actionDataLogger(role_list_url, {}, ACTION_TYPE.QUERY);
  return requestGet(role_list_url).then(({ data, code, message }) => data);
};

const getRolesDetail = () => {
  actionDataLogger(role_list_more_url, {}, ACTION_TYPE.QUERY);
  return requestGet(role_list_more_url).then(({ data, code, message }) => data);
};

const getRole = id => {
  let url = format(role_get_url, {id});
  actionDataLogger(url, {}, ACTION_TYPE.QUERY);
  return requestGet(url).then(({ data, code, message }) => data);
};

const createRole = data => {
  actionDataLogger(role_create_url, data, ACTION_TYPE.CREATE);
  return requestPost(role_create_url, data).then(({ data, code, message }) => data);
};

const updateRole = (id, data) => {
  let url = format(role_update_url, {id});
  actionDataLogger(url, data, ACTION_TYPE.UPDATE);
  return requestPut(url, data).then(({ data, code, message }) => data);
};

export {
  getUser, getUsers, createUser, updateUser, resetPassword,
  getRoles, getRole, getRolesDetail, createRole, updateRole
}
