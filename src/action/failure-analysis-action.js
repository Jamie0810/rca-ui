import {requestGet, requestMultipart} from './action';
import format from 'string-template'
import {ACTION_TYPE, actionDataLogger, actionFormDataLogger} from "./common-action";

// const risk_test_query_url = 'qc/defect';
// const failure_record_query_url = 'data/failure_record_query';
const failure_analysis_query_url = 'fa';
const failure_analysis_create_url = 'fa';
const failure_analysis_update_url = 'fa/{id}';
// const failure_analysis_product_line_station_query_url = 'fa/product_line_station';
// const failure_analysis_test_symptom_query_url = 'qc/defect/symptoms';
const failure_analysis_creator_query_url = 'fa/creators';
const failure_analysis_product_symptoms_query_url = 'fa/symptoms';
const failure_analysis_reference_testing_query_url = 'fa/{id}/references/defect';
const failure_analysis_reference_files_query_url = 'fa/{id}/references/objects';

// const fatalRecordQuery = criteria => {
//   actionDataLogger(risk_test_query_url, criteria, ACTION_TYPE.QUERY);
//   return requestGet(risk_test_query_url, criteria).then(({data, code, message}) => (data));
// };

const fatalAnalysisQuery = criteria => {
  actionDataLogger(failure_analysis_query_url, criteria, ACTION_TYPE.QUERY);
  return requestGet(failure_analysis_query_url, criteria).then(({data, code, message}) => (data));
};

const createFailureAnalysisReport = formData => {
  actionFormDataLogger(failure_analysis_create_url, formData, ACTION_TYPE.CREATE);
  return requestMultipart(failure_analysis_create_url, formData).then(({data, code, message}) => (data));
};

const updateFailureAnalysisReport = (id, formData) => {
  let url = format(failure_analysis_update_url, {id});
  actionFormDataLogger(url, formData, ACTION_TYPE.UPDATE);
  return requestMultipart(url, formData).then(({data, code, message}) => (data));
};

const getFaReferenceTesting = id => {
  let url = format(failure_analysis_reference_testing_query_url, {id});
  actionDataLogger(url, {}, ACTION_TYPE.QUERY);
  return requestGet(url).then(({data, code, message}) => (data));
};

const getFaReferenceFiles = id => {
  let url = format(failure_analysis_reference_files_query_url, {id});
  actionDataLogger(url, {}, ACTION_TYPE.QUERY);
  return requestGet(url).then(({data, code, message}) => (data));
};

// const getProductLineStations = () => {
//   // actionDataLogger(failure_analysis_product_line_station_query_url, {}, ACTION_TYPE.QUERY);
//   return requestGet(failure_analysis_product_line_station_query_url).then(({data, code, message}) => (data));
// };

// const getTestSymptoms = (product, line, station) => {
//   let data = {product, line, station};
//   // actionDataLogger(failure_analysis_test_symptom_query_url, data, ACTION_TYPE.QUERY);
//   return requestGet(failure_analysis_test_symptom_query_url, data).then(({data, code, message}) => (data));
// };

const getFaCreateUsers = () => {
  // actionDataLogger(failure_analysis_creator_query_url, {}, ACTION_TYPE.QUERY);
  return requestGet(failure_analysis_creator_query_url).then(({data, code, message}) => (data));
};

const getFaProductSymptoms = () => {
  // actionDataLogger(failure_analysis_product_symptoms_query_url, {}, ACTION_TYPE.QUERY);
  return requestGet(failure_analysis_product_symptoms_query_url).then(({data, code, message}) => (data));
};

export {
  // fatalRecordQuery,
  fatalAnalysisQuery,
  createFailureAnalysisReport,
  updateFailureAnalysisReport,
  getFaReferenceTesting,
  getFaReferenceFiles,
  // getProductLineStations,
  // getTestSymptoms,
  getFaCreateUsers,
  getFaProductSymptoms
};
