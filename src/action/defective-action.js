import { requestGet } from './action';
import {ACTION_TYPE, actionDataLogger} from "./common-action";
import format from 'string-template';

const product_floor_line_get_url = 'qc/defect/products/floors/lines';
const operating_product_floor_line_get_url = 'qc/defect/products/floors/lines/{start}/{end}';
const product_line_station_get_url = 'qc/defect/products/lines/stations';
const product_names_get_url = 'qc/defect/products/name';

const failure_symptom_query_url = 'qc/defect/dimension/symptoms';
const failure_symptom_case_query_url = 'qc/defect/dimension/symptoms/records';
const failure_symptom_risk_query_url = 'qc/defect/dimension/symptoms/risks';
const failure_symptom_risk_type_query_url = 'qc/defect/dimension/symptoms/risks/source';

const risk_test_query_url = 'qc/defect';
const failure_analysis_test_symptom_query_url = 'qc/defect/symptoms';

const statistic_yield_data_get_url = 'qc/defect/statistic/yield';

const getProductFloorLines = () => {
  // actionDataLogger(product_floor_line_get_url, data, ACTION_TYPE.QUERY);
  return requestGet(product_floor_line_get_url).then(({data, code, message}) => (data));
};

const getOperatingProductFloorLines = (start, end) => {
  let url = format(operating_product_floor_line_get_url, {start, end});
  // actionDataLogger(operating_product_floor_line_get_url, data, ACTION_TYPE.QUERY);
  return requestGet(url).then(({data, code, message}) => (data));
};

const getProductLineStations = () => {
  return requestGet(product_line_station_get_url).then(({data, code, message}) => (data));
};

const getProductNames = () => {
  return requestGet(product_names_get_url).then(({data, code, message}) => {
    return data;
  });
};

const commonDataHandler = (item) => {
  item.failRate = Number((parseFloat(item.failRate)*100).toFixed(2));
  item.commonality = Number((parseFloat(item.commonality)*100).toFixed(2));
  item.defectQty = parseInt(item.defectQty).toString();
  let s = parseFloat(item.significant);
  item.significant = Number(parseFloat(s).toFixed(2));
  item.significantCate = (s >= 2)? 'common.high': 'common.low';
  item.throughputRatio = Number((parseFloat(item.throughputRatio)*100).toFixed(2));
  item.failureContRatio = Number((parseFloat(item.failureContRatio)*100).toFixed(2));
  item.accountFor = item.accountFor? (Number(item.accountFor*100).toFixed(2) + '%'): undefined;
  return item;
};

const filter = (criteria) => {
  actionDataLogger(failure_symptom_query_url, criteria, ACTION_TYPE.QUERY);
  return requestGet(failure_symptom_query_url, criteria).then(({data, code, message}) => {
    data.recordList.forEach(commonDataHandler);
    return data;
  });
};

const defectStationList = (product, floor, line, failureSymptom, testStation, startTime, stopTime) => {
  let data = { product, floor, line, failureSymptom, testStation, startTime, stopTime };
  actionDataLogger(failure_symptom_case_query_url, data, ACTION_TYPE.QUERY);
  return requestGet(
    failure_symptom_case_query_url, data)
    .then(({data, code, message}) => (data.defectSNList));
};

const defectSymptomInfo = (failureSymptom, testStation, startTime, stopTime, product, floor, line) => {
  let data = { failureSymptom, testStation, startTime, stopTime, product, floor, line };
  actionDataLogger(failure_symptom_risk_query_url, data, ACTION_TYPE.QUERY);
  return requestGet(
    failure_symptom_risk_query_url, data)
    .then(({data, code, message}) => {
      data.assemblyList.forEach(commonDataHandler);
      data.stationList.forEach(commonDataHandler);
      data.dateCodeList.forEach(commonDataHandler);
      return data;
    });
};

const defectRiskSource = (failureSymptom, floor, product, line, riskName, riskType, startTime, stopTime, testStation) => {
  let data = { failureSymptom, floor, product, line, riskName, riskType, startTime, stopTime, testStation };
  actionDataLogger(failure_symptom_risk_type_query_url, data, ACTION_TYPE.QUERY);
  return requestGet(
    failure_symptom_risk_type_query_url, data)
    .then(({data, code, message}) => {
      data = data.recordList;
      data.forEach(commonDataHandler);
      return data;
    });
};

const fatalRecordQuery = criteria => {
  actionDataLogger(risk_test_query_url, criteria, ACTION_TYPE.QUERY);
  return requestGet(risk_test_query_url, criteria).then(({data, code, message}) => (data));
};

const getTestSymptoms = (product, line, station) => {
  let data = {product, line, station};
  // actionDataLogger(failure_analysis_test_symptom_query_url, data, ACTION_TYPE.QUERY);
  return requestGet(failure_analysis_test_symptom_query_url, data).then(({data, code, message}) => (data));
};

const fetchYieldData = (criteria) => {
  actionDataLogger(statistic_yield_data_get_url, criteria, ACTION_TYPE.QUERY);
  return requestGet(statistic_yield_data_get_url, criteria).then(({data, code, message}) => {
    // console.log('filter criteria:', criteria, '\ndata:', data);
    data.alertList = data.alertList.map(item => {
      let commonality = [null, null, null];
      let riskList = item.riskList;
      riskList.map(riskItem => {
        const isCommonalityAssess = ('confirmed' === riskItem.commonalityAssess);
        if ('riskAssemblyBy' === riskItem.riskType) {
          riskItem.riskTypeLabel = 'defect.assembling';
          isCommonalityAssess && (commonality[0] = Number((parseFloat(riskItem.commonality) * 100).toFixed(2)));
        } else if ('riskStation' === riskItem.riskType) {
          riskItem.riskTypeLabel = 'defect.station';
          isCommonalityAssess && (commonality[1] = Number((parseFloat(riskItem.commonality) * 100).toFixed(2)));
        } else if ('relatedMaterial' === riskItem.riskType) {
          riskItem.riskTypeLabel = 'defect.date_code';
          isCommonalityAssess && (commonality[2] = Number((parseFloat(riskItem.commonality) * 100).toFixed(2)));
        }

        if (isCommonalityAssess) {
          riskItem.riskSignalColor = '#FF9120';
          riskItem.commonalityLabel = Number((parseFloat(riskItem.commonality) * 100).toFixed(2));
          // riskItem.failQtyInputCntLabel = riskItem.riskFailQty + '/' + Math.round(riskItem.riskInput);
        } else {
          if ('datalack' === riskItem.commonalityAssess) {
            // riskItem.riskName = '不良數量不足分析';
            riskItem.riskSignalColor = '#A8ABB5';
          } else if ('negative' === riskItem.commonalityAssess) {
            // riskItem.riskName = '無風險傾向';
            riskItem.riskSignalColor = '#2B908F';
          }

          riskItem.commonalityLabel = '-';
          riskItem.failQtyInputCntLabel = '-';
          riskItem.riskId_display = '-';
        }
        return riskItem;
      });
      item.commonality = commonality;
      return item;
    });
    return data;
  });
};

export {
  getProductFloorLines,
  getOperatingProductFloorLines,
  getProductLineStations,
  getProductNames,
  filter,
  defectStationList,
  defectSymptomInfo,
  defectRiskSource,
  fatalRecordQuery,
  getTestSymptoms,
  fetchYieldData
};
