import { groupBy } from "lodash";
import {requestPost, requestGet, requestDelete, requestPut} from './action';
import {ACTION_TYPE, actionDataLogger} from "./common-action";
import format from 'string-template'

const analysisSet_create_url = 'dataset/analysis';
const analysisSet_update_url = 'dataset/analysis/{id}';
const analysisSet_query_url = 'dataset/analysis';
const analysisSet_get_url = 'dataset/analysis/{id}';
const analysisSet_copy_url = 'dataset/analysis/{id}/copy';
const analysisSet_delete_url = 'dataset/analysis/{id}';
const analysisSet_field_config_url = 'dataset/analysis/{id}/pool/define';
const analysisSet_get_fields_url = 'dataset/analysis/{id}/pool/properties';
const analysisSet_get_numeric_item_field = 'dataset/analysis/{id}/pool/properties/type/numeric/test_items';
const analysisSet_query_plots_url = 'dataset/analysis/{id}/plots';
const analysisSet_create_plot_url = 'dataset/analysis/{id}/plot';
const analysisSet_update_plot_url = 'dataset/analysis/plots/{id}';
const analysisSet_delete_plot_url = 'dataset/analysis/plots/{id}';
const analysisSet_get_plot_url = 'dataset/analysis/plots/{id}/chart';
const capture_create_url = 'dataset/analysis/plots/{id}/capture';
const captures_get_url = 'dataset/analysis/{id}/captures';
const capture_update_url = 'dataset/analysis/captures/{id}';
const capture_get_url = 'dataset/analysis/captures/{id}';
const capture_delete_url = 'dataset/analysis/captures/{id}';
const pool_data_get_url = 'dataset/analysis/{id}/pool/page/{page}/size/{size}';
const pool_data_statistic_get_url = 'dataset/analysis/{id}/pool/statistic';
const matrix_get_url = 'dataset/analysis/matrices/{id}';
const matrix_query_url = 'dataset/analysis/{id}/matrices';
const matrix_delete_url = 'dataset/analysis/matrices/{id}';
const matrix_create_url = 'dataset/analysis/matrices';

const queryAnalysisSet = () => {
  actionDataLogger(analysisSet_query_url, {}, ACTION_TYPE.QUERY);
  return requestGet(analysisSet_query_url).then(({ data, code, message }) => data);
};

const createAnalysisSet = data => {
  actionDataLogger(analysisSet_create_url, data, ACTION_TYPE.CREATE);
  return requestPost(analysisSet_create_url, data).then(({ data, code, message }) => data);
};

const updateAnalysisSet = (id, data) => {
  let url = format(analysisSet_update_url, {id});
  actionDataLogger(url, data, ACTION_TYPE.UPDATE);
  return requestPut(url, data).then(({ data, code, message }) => data);
};

const updateAnalysisSetFieldConfig = (id, data) => {
  let url = format(analysisSet_field_config_url, {id});
  data.settingJson = JSON.stringify(data.settingJson);

  actionDataLogger(url, data, ACTION_TYPE.UPDATE);
  return requestPut(url, data).then(({ data, code, message }) => data);
};

const getAnalysisSetInfo = id => {
  let url = format(analysisSet_get_url, {id});
  actionDataLogger(url, {}, ACTION_TYPE.QUERY);
  return requestGet(url).then(({ data, code, message }) => data);
};

const copyAnalysisSet = (id, data) => {
  let url = format(analysisSet_copy_url, {id});
  actionDataLogger(url, data, ACTION_TYPE.COPY);
  return requestPost(url, data).then(({ data, code, message }) => data);
};

const deleteAnalysisSet = id => {
  let url = format(analysisSet_delete_url, {id});
  actionDataLogger(url, {}, ACTION_TYPE.DELETE);
  return requestDelete(url).then(({ data, code, message }) => data);
};

const getAnalysisSetPlots = id => {
  let url = format(analysisSet_query_plots_url, {id});
  actionDataLogger(url, {}, ACTION_TYPE.QUERY);
  return requestGet(url).then(({ data, code, message }) => data);
};

const getAnalysisSetFields = id => {
  let url = format(analysisSet_get_fields_url, {id});
  // actionDataLogger(analysisSet_get_fields_url, data, ACTION_TYPE.QUERY);
  return requestGet(url).then(({data, code, message}) => data.field);
};

const getAnalysisSetNumericItemFields = id => {
  let url = format(analysisSet_get_numeric_item_field, {id});
  // actionDataLogger(url, data, ACTION_TYPE.QUERY);
  return requestGet(url).then(({data, code, message}) => data.field);
};

const addAnalysisSetPlot = (id, data) => {
  let url = format(analysisSet_create_plot_url, {id});
  data.plotJson = JSON.stringify(data.plotJson);

  actionDataLogger(url, data, ACTION_TYPE.CREATE);
  return requestPost(url, data).then(({ data, code, message }) => data);
};

const updateAnalysisSetPlot = (id, data) => {
  let url = format(analysisSet_update_plot_url, {id});
  data.plotJson = JSON.stringify(data.plotJson);

  actionDataLogger(url, data, ACTION_TYPE.UPDATE);
  return requestPut(url, data).then(({ data, code, message }) => data);
};

const updateCapture = (id, data) => {
  let url = format(capture_update_url, {id});
  actionDataLogger(url, data, ACTION_TYPE.UPDATE);
  return requestPut(url, data).then(({ data, code, message }) => data);
};

const getCapture = id => {
  let url = format(capture_get_url, {id});
  actionDataLogger(url, {}, ACTION_TYPE.QUERY);
  return requestGet(url).then(({ data, code, message }) => data);
};

const deleteAnalysisSetPlot = id => {
  let url = format(analysisSet_delete_plot_url, {id});
  actionDataLogger(url, {}, ACTION_TYPE.DELETE);
  return requestDelete(url).then(({ data, code, message }) => data);
};

const captureAnalysisSetPlot = (id, data) => {
  let url = format(capture_create_url, {id});
  data.dataJson = JSON.stringify(data.dataJson);

  actionDataLogger(url, data, ACTION_TYPE.CREATE);
  return requestPost(url, data).then(({ data, code, message }) => data);
};

const getPlotData = id => {
  let url = format(analysisSet_get_plot_url, {id});
  actionDataLogger(url, {}, ACTION_TYPE.QUERY);
  return requestGet(url).then(({ data, code, message }) => data);
};

const getAllCaptures = id => {
  let url = format(captures_get_url, {id});
  actionDataLogger(url, {}, ACTION_TYPE.QUERY);
  return requestGet(url).then(({ data, code, message }) => data);
};

const deleteCapture = id => {
  let url = format(capture_delete_url, {id});
  actionDataLogger(url, {}, ACTION_TYPE.DELETE);
  return requestDelete(url).then(({ data, code, message }) => data);
};

const getAnalysisPoolData = (id, page, size) => {
  let url = format(pool_data_get_url, {id, page, size});
  actionDataLogger(url, {}, ACTION_TYPE.QUERY);
  return requestGet(url).then(({ data, code, message }) => data);
};

const getAnalysisPoolStatisticsData= id => {
  let url = format(pool_data_statistic_get_url, {id});
  actionDataLogger(url, {}, ACTION_TYPE.QUERY);
  return requestGet(url).then(({ data, code, message }) => data);
};

const getMatrix = id => {
  let url = format(matrix_get_url, {id});
  actionDataLogger(url, {}, ACTION_TYPE.QUERY);
  return requestGet(url).then(({ data, code, message }) => data);
};

const queryMatrix = id => {
  let url = format(matrix_query_url, {id});
  actionDataLogger(url, {}, ACTION_TYPE.QUERY);
  return requestGet(url).then(({ data, code, message }) => data);
};

const deleteMatrix = id => {
  let url = format(matrix_delete_url, {id});
  actionDataLogger(url, {}, ACTION_TYPE.DELETE);
  return requestDelete(url).then(({ data, code, message }) => data);
};

const createMatrix = data => {
  actionDataLogger(matrix_create_url, data, ACTION_TYPE.CREATE);
  return requestPost(matrix_create_url, data).then(({ data, code, message }) => data);
};


export {
  createAnalysisSet,
  updateAnalysisSet,
  updateAnalysisSetFieldConfig,
  queryAnalysisSet,
  getAnalysisSetInfo,
  copyAnalysisSet,
  deleteAnalysisSet,
  getAnalysisSetFields,
  getAnalysisSetNumericItemFields,
  getAllCaptures,
  getAnalysisSetPlots,
  addAnalysisSetPlot,
  updateAnalysisSetPlot,
  deleteAnalysisSetPlot,
  captureAnalysisSetPlot,
  getPlotData,
  updateCapture,
  getCapture,
  deleteCapture,
  getAnalysisPoolData,
  getAnalysisPoolStatisticsData,
  getMatrix,
  queryMatrix,
  deleteMatrix,
  createMatrix
}
