import {requestPost, requestGet, requestDelete} from './action';
import {ACTION_TYPE, actionDataLogger} from "./common-action";
import format from 'string-template';

const code_group_query_url = 'codes';
const code_group_item_create_url = 'codes';
const code_group_item_delete_url = 'codes/{id}';
const code_group_of_product_symptom_get_url = 'codes/product/{id}/symptom';
const code_group_of_product_component_get_url = 'codes/product/{id}/component';
const code_group_of_product_vendor_get_url = 'codes/product/{id}/vendor';
const code_group_of_product_date_code_get_url = 'codes/product/{id}/date_code';

const queryCodeGroup = () => {
  actionDataLogger(code_group_query_url, {}, ACTION_TYPE.QUERY);
  return requestGet(code_group_query_url).then(({data, code, message}) => {
    return data;
  });
};

const deleteCodeGroupItem = id => {
  let url = format(code_group_item_delete_url, {id})
  actionDataLogger(url, {}, ACTION_TYPE.DELETE);
  return requestDelete(url).then(({data, code, message}) => {
    return data;
  });
};

const createCodeGroupItem = data => {
  actionDataLogger(code_group_item_create_url, data, ACTION_TYPE.CREATE);
  return requestPost(code_group_item_create_url, data).then(({data, code, message}) => {
    return data;
  });
};

const getProductSymptomCodeGroup = id => {
  let url = format(code_group_of_product_symptom_get_url, {id});
  actionDataLogger(url, {}, ACTION_TYPE.QUERY);
  return requestGet(url).then(({ data, code, message }) => data);
};

const getProductComponentCodeGroup = id => {
  let url = format(code_group_of_product_component_get_url, {id});
  actionDataLogger(url, {}, ACTION_TYPE.QUERY);
  return requestGet(url).then(({ data, code, message }) => data);
};

const getProductVendorCodeGroup = id => {
  let url = format(code_group_of_product_vendor_get_url, {id});
  actionDataLogger(url, {}, ACTION_TYPE.QUERY);
  return requestGet(url).then(({ data, code, message }) => data);
};

const getProductDateCodeCodeGroup = id => {
  let url = format(code_group_of_product_date_code_get_url, {id});
  actionDataLogger(url, {}, ACTION_TYPE.QUERY);
  return requestGet(url).then(({ data, code, message }) => data);
};

export {
  queryCodeGroup,
  createCodeGroupItem,
  deleteCodeGroupItem,
  getProductSymptomCodeGroup,
  getProductComponentCodeGroup,
  getProductVendorCodeGroup,
  getProductDateCodeCodeGroup
};
