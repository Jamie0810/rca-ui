import {requestGet, requestPost, requestMultipart, requestPut} from './action';
import {ACTION_TYPE, actionDataLogger} from "./common-action";
import format from 'string-template';

const product_names_get_url = 'products/name';
const product_list_get_url = 'products';
const product_create_url = 'products';
const product_information_get_url = 'products/{id}';
const data_logic_get_url= 'products/{id}/etl/rules';
const data_logic_update_url = 'products/{id}/etl/rules';
const station_filter_get_url = 'products/{id}/etl/filters/station';
const station_filter_upload_url = 'products/{id}/etl/filters/station/upload';
const component_filter_get_url = 'products/{id}/etl/filters/component';
const component_filter_upload_url = 'products/{id}/etl/filters/component/upload';
const material_transform_data_get_url = 'products/{id}/etl/transformation/component';
// const code_mapper_data_get_url = 'product/getCodeByProduct';
const validation_info_get_url = 'products/{id}/validation';
// const validation_result_get_url = 'product/getVerifyResult';
const ftp_data_validation_get_url = 'products/{id}/validation/ftp';
const product_validation_get_url = 'products/{id}/validation/product';
const summary_data_validation_get_url = 'products/{id}/validation/summary';
const product_update_url = 'products/{id}';
const validate_record_get_url = 'products/{id}/validation/history';
// const testStation_file_upload_url = 'product/upload';

const getProductNames = () => {
  return requestGet(product_names_get_url).then(({data, code, message}) => {
    return data;
  });
};

const getProducts = () => {
  actionDataLogger(product_list_get_url, {}, ACTION_TYPE.QUERY);
  return requestGet(product_list_get_url).then(({ data, code, message }) => data);
};

const createNewProduct = data => {
  actionDataLogger(product_create_url, data, ACTION_TYPE.CREATE);
  return requestPost(product_create_url, data).then(({ data, code, message }) => data);
};

const updateDataLogic = (id, data) => {
  let url = format(data_logic_update_url, {id});
  actionDataLogger(url, data, ACTION_TYPE.UPDATE);
  return requestPut(url, data).then(({ data, code, message }) => data);
};

const updateProduct = (id, data) => {
  let url = format(product_update_url, {id});
  actionDataLogger(url, data, ACTION_TYPE.UPDATE);
  return requestPut(url, data).then(({ data, code, message }) => data);
};

const getProductInformation = id => {
  let url = format(product_information_get_url, {id});
  actionDataLogger(url, {}, ACTION_TYPE.QUERY);
  return requestGet(url).then(({ data, code, message }) => data);
};

const getDataLogicInformation = id => {
  let url = format(data_logic_get_url, {id});
  actionDataLogger(url, {}, ACTION_TYPE.QUERY);
  return requestGet(url).then(({ data, code, message }) => data);
};

const getValidationRecords = id => {
  let url = format(validate_record_get_url, {id});
  actionDataLogger(url, {}, ACTION_TYPE.QUERY);
  return requestGet(url).then(({ data, code, message }) => data);
};

const getStationFilterList = (id, params) => {
  let url = format(station_filter_get_url, {id});
  actionDataLogger(url, params, ACTION_TYPE.QUERY);
  return requestGet(url, params).then(({ data, code, message }) => data);
};

const uploadStationFilterList = (id, formData) => {
  let url = format(station_filter_upload_url, {id});
  actionDataLogger(url, formData, ACTION_TYPE.CREATE);
  return requestMultipart(url, formData).then(({data, code, message}) => code);
};

const getComponentFilterList = (id, params) => {
  let url = format(component_filter_get_url, {id});
  actionDataLogger(url, params, ACTION_TYPE.QUERY);
  return requestGet(url, params).then(({ data, code, message }) => data);
};

const uploadComponentFilterList = (id, formData) => {
  let url = format(component_filter_upload_url, {id});
  actionDataLogger(url, formData, ACTION_TYPE.CREATE);
  return requestMultipart(url, formData).then(({data, code, message}) => code);
};

const getMaterialTransformData = (id, params) => {
  let url = format(material_transform_data_get_url, {id});
  actionDataLogger(url, params, ACTION_TYPE.QUERY);
  return requestGet(url, params).then(({ data, code, message }) => data);
};

// const getCodeMapperData = (product, category) => {
//   let data = { product, category };
//   actionDataLogger(code_mapper_data_get_url, data, ACTION_TYPE.QUERY);
//   return requestGet(code_mapper_data_get_url, { product, category }).then(({ data, code, message }) => data);
// };

const getValidationInfo = id => {
  let url = format(validation_info_get_url, {id});
  actionDataLogger(url, {}, ACTION_TYPE.QUERY);
  return requestGet(url).then(({ data, code, message }) => data);
};

// const getValidationResult = (product, verifyType) => {
//   let data = { product, verifyType };
//   actionDataLogger(validation_result_get_url, data, ACTION_TYPE.QUERY);
//   return requestGet(validation_result_get_url, { product, verifyType }).then(({ data, code, message }) => data);
// };

const getFtpDataValidation = id => {
  let url = format(ftp_data_validation_get_url, {id});
  actionDataLogger(url, {}, ACTION_TYPE.QUERY);
  return requestGet(url).then(({ data, code, message }) => data);
};

const getProductValidation = id => {
  let url = format(product_validation_get_url, {id});
  actionDataLogger(url, {}, ACTION_TYPE.QUERY);
  return requestGet(url).then(({ data, code, message }) => data);
};

const getSummaryValidation = id => {
  let url = format(summary_data_validation_get_url, {id});
  actionDataLogger(url, {}, ACTION_TYPE.QUERY);
  return requestGet(url).then(({ data, code, message }) => data);
};

// const uploadTestStationFile = data => {
//   actionDataLogger(testStation_file_upload_url, data, ACTION_TYPE.CREATE);
//   return requestMultipart(testStation_file_upload_url, data).then(({data, code, message}) => code);
// };

export {
  getProductNames,
  getProducts,
  createNewProduct,
  updateDataLogic,
  getProductInformation,
  getDataLogicInformation,
  getValidationRecords,
  getStationFilterList,
  uploadStationFilterList,
  getComponentFilterList,
  uploadComponentFilterList,
  getMaterialTransformData,
  // getCodeMapperData,
  getValidationInfo,
  // getValidationResult,
  updateProduct,
  // uploadTestStationFile
  getFtpDataValidation,
  getProductValidation,
  getSummaryValidation
};
