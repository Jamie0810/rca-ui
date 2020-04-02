import { requestGet, requestPost } from './action';
import {ACTION_TYPE, actionDataLogger} from "./common-action";
import format from 'string-template';

// const products_get_url = 'product/listProduct';
const validation_task_create_url = 'validation';
const validation_task_list_url = 'validation';
const validation_task_delete_url = 'validation/sn/{id}/delete';
const validation_information_get_url = 'validation/sn/{sn}/{tab}';
const latest_validation_time_get_url = 'validation/summary';
const latest_product_validation_time_get_url = 'validation/summary/product';

// const getProducts = () => {
//   // actionDataLogger(products_get_url, {}, ACTION_TYPE.QUERY);
//   return requestGet(products_get_url).then(({ data, code, message }) => data);
// };

const createValidationTask = data => {
  actionDataLogger(validation_task_create_url, data, ACTION_TYPE.CREATE);
  return requestPost(validation_task_create_url, data).then(({ data, code, message }) => data);
};

const getValidationTasks = () => {
  actionDataLogger(validation_task_list_url, {}, ACTION_TYPE.QUERY);
  return requestGet(validation_task_list_url).then(({ data, code, message }) => data);
};

const deleteValidationTask = id => {
  let url = format(validation_task_delete_url, {id});
  actionDataLogger(url, {}, ACTION_TYPE.DELETE);
  return requestGet(url).then(({ data, code, message }) => data);
};

// const getSNInformation = (sn, type) => {
//   let data = { sn, type };
//   actionDataLogger(sn_information_get_url, data, ACTION_TYPE.QUERY);
//   return requestGet(sn_information_get_url, data).then(({ data, code, message }) => data);
// };

const getTestDataValidation = sn => {
  let url = format(validation_information_get_url, {sn, tab: 'test'});
  actionDataLogger(url, {}, ACTION_TYPE.QUERY);
  return requestGet(url).then(({ data, code, message }) => data);
};

const getAssemblingMasterDataValidation = sn => {
  let url = format(validation_information_get_url, {sn, tab: 'master'});
  actionDataLogger(url, {}, ACTION_TYPE.QUERY);
  return requestGet(url).then(({ data, code, message }) => data);
};

const getAssemblingBreakdownDataValidation = sn => {
  let url = format(validation_information_get_url, {sn, tab: 'detail'});
  actionDataLogger(url, {}, ACTION_TYPE.QUERY);
  return requestGet(url).then(({ data, code, message }) => data);
};

const getLatestProductValidationTime = data => {
  actionDataLogger(latest_product_validation_time_get_url, data, ACTION_TYPE.QUERY);
  return requestGet(latest_product_validation_time_get_url, data).then(({ data, code, message }) => data);
};

const getLatestValidationTime = () => {
  actionDataLogger(latest_validation_time_get_url, {}, ACTION_TYPE.QUERY);
  return requestGet(latest_validation_time_get_url).then(({ data, code, message }) => data);
};

export {
  // getProducts,
  createValidationTask,
  getValidationTasks,
  deleteValidationTask,
  // getSNInformation,
  getLatestValidationTime,
  getLatestProductValidationTime,
  getTestDataValidation,
  getAssemblingMasterDataValidation,
  getAssemblingBreakdownDataValidation
};
