import {requestDelete, requestGet, requestPost, requestPut} from './action';
import {ACTION_TYPE, actionDataLogger} from "./common-action";
import format from 'string-template'
import {groupBy} from "lodash";

// const products_url = 'qc/dataset/products';
const test_station_url = 'qc/dataset/test_items/stations';
const test_station_item_url = 'qc/dataset/test_items';
const material_type_url = 'qc/dataset/components/types';
const material_type_item_url = 'qc/dataset/components';
const dataset_create_url = 'dataset';
const dataset_update_url = 'dataset/{id}';
const dataset_copy_url = 'dataset/{id}/copy';
const dataset_delete_url = 'dataset/{id}';
const dataset_get_url = 'dataset/{id}';
const dataset_query_url = 'dataset';
const product_dataset_query_url = 'dataset/less';
const dataset_data_pool_paging_url = 'dataset/{id}/pool/page/{page}/size/{size}';
const dataset_get_fields_url = 'dataset/{id}/pool/properties';

// const getProducts = () => {
//   // actionDataLogger(products_url, {}, ACTION_TYPE.QUERY);
//   return requestGet(products_url).then(({data, code, message}) => data);
// };

const queryProductDatasetMapper = () => {
  // actionDataLogger(product_dataset_query_url, {}, ACTION_TYPE.QUERY);
  return requestGet(product_dataset_query_url).then(({data, code, message}) => {
    return groupBy(data, 'product');
  });
};

const getDataset = id => {
  let url = format(dataset_get_url, {id});
  actionDataLogger(url, {}, ACTION_TYPE.QUERY);
  return requestGet(url).then(({data, code, message}) => {
    data.dataSetStationItem.forEach(item => item.key = `${item.station}@${item.item}`);
    data.dataSetPart.forEach(item => item.key = `${item.partType}@${item.component}`);
    return data;
  });
};

const queryDataset = () => {
  actionDataLogger(dataset_query_url, {}, ACTION_TYPE.QUERY);
  return requestGet(dataset_query_url).then(({data, code, message}) => {
    return data;
  });
};

const pageDataSetData = (id, page, size) => {
  let url = format(dataset_data_pool_paging_url, {id, page, size});
  actionDataLogger(url, {}, ACTION_TYPE.QUERY);
  return requestGet(url, {}).then(({data, code, message}) => {
    return data;
  });
};

const getTestStations = product => {
  // actionDataLogger(test_station_url, product, ACTION_TYPE.QUERY);
  return requestGet(test_station_url, product).then(({data, code, message}) => data);
};

const getTestStationItems = ({ product, station, size, name }) => {
  let data = { product, station, size, name };
  actionDataLogger(test_station_item_url, data, ACTION_TYPE.QUERY);
  return requestGet(test_station_item_url, data).then(
    ({data, code, message}) => {
      data.forEach(item => item.key = `${item.station}@${item.item}`);
      return data;
    });
};

const getMaterialTypes = product => {
  // actionDataLogger(material_type_url, product, ACTION_TYPE.QUERY);
  return requestGet(material_type_url, product).then(({data, code, message}) => data);
};

const getMaterialTypeItems = ({ product, type, size, name }) => {
  let data = { product, type, size, name };
  actionDataLogger(material_type_item_url, data, ACTION_TYPE.QUERY);
  return requestGet(material_type_item_url, data).then(
    ({data, code, message}) => {
      data.forEach(item => item.key = `${item.partType}@${item.component}`);
      return data;
    });
};

const createDataset = params => {
  actionDataLogger(dataset_create_url, params, ACTION_TYPE.CREATE);
  return requestPost(dataset_create_url, params).then(({data, code, message}) => data);
};

const updateDataset = (id, params) => {
  let url = format(dataset_update_url, {id});
  actionDataLogger(url, params, ACTION_TYPE.UPDATE);
  return requestPut(url, params).then(({data, code, message}) => data);
};

const deleteDataset = id => {
  let url = format(dataset_delete_url, {id});
  actionDataLogger(url, {}, ACTION_TYPE.DELETE);
  return requestDelete(url).then(({data, code, message}) => data);
};

const copyDataset = (id, data) => {
  let url = format(dataset_copy_url, {id});
  actionDataLogger(url, data, ACTION_TYPE.COPY);
  return requestPost(url, data).then(({data, code, message}) => data);
};

const getDatasetFields = id => {
  let url = format(dataset_get_fields_url, {id});
  return requestGet(url).then(({data, code, message}) => data.field);
};

export {
  queryProductDatasetMapper,
  createDataset,
  updateDataset,
  deleteDataset,
  copyDataset,
  // getProducts,
  getDataset,
  getDatasetFields,
  getTestStations,
  getTestStationItems,
  getMaterialTypes,
  getMaterialTypeItems,
  queryDataset,
  pageDataSetData
};
