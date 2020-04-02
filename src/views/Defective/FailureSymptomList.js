import React, {PureComponent} from 'react';
import {Button, CardBody, CardHeader, Table, Tooltip} from 'reactstrap';
import {defectStationList, defectSymptomInfo} from '../../action/defective-action';
import BarChart from './BarChart'
import LoadingMask from "../Coommon/LoadingMask";
import DataModal from "../Coommon/DataModal";
import {withTranslation} from "react-i18next";

const riskNameMapper = (commonalityAssess, riskName, trans) => {
  switch (commonalityAssess) {
    case 'negative':
      return trans('defect.top_risk_negative');
    case 'datalack':
      return trans('defect.top_risk_lack_of_data');
    default:
      return riskName
  }
};

class FailureSymptomList extends PureComponent {
  state = {
    loading: false,
    infoTipOpen: false,
    selectedItem: null,
    tooltipOpen: Array(this.props.failureSymptomList.length).fill(false),
    failRateTipOpen: Array(this.props.failureSymptomList.length).fill(false),
    defectQtyList: null
  };

  render () {
    const { t } = this.props;
    const failureSymptomList = this.props.failureSymptomList;
    return (
      <React.Fragment>
        <CardHeader className="border-top px-4">
          {t('defect.list_by_fail_symptom')}
          <span id="di_info_tip"><i className="fa fa-info-circle" /></span>
          <Tooltip
            placement="right"
            isOpen={this.state.infoTipOpen}
            autohide={false}
            target="di_info_tip"
            toggle={this.infoTipToggle}>
            <div className="text-left">
              <div>{t('defect.tip_by_fail_symptom.part1')}</div>
              <div>{t('defect.tip_by_fail_symptom.part2')}</div>
              <div>{t('defect.tip_by_fail_symptom.part3')}</div>
              <div>{t('defect.tip_by_fail_symptom.part4')}</div>
              <div>{t('defect.tip_by_fail_symptom.part5')}</div>
              <div>{t('defect.tip_by_fail_symptom.part6')}</div>
              <div>{t('defect.tip_by_fail_symptom.part7')}</div>
            </div>
          </Tooltip>
        </CardHeader>
        <LoadingMask loading={this.state.loading}>
          <CardBody>
            <Table className="nowrap" responsive hover>
              <thead>
              <tr className="text-center">
                <th className="border-top-0">{t('common.rank')}</th>
                <th className="border-top-0">{t('defect.test_station')}</th>
                <th className="border-top-0">{t('defect.fail_symptom')}</th>
                <th className="border-top-0">{t('defect.fail_rate')}</th>
                <th className="border-top-0">{t('defect.quantity_of_failure')}</th>
                <th className="border-top-0">{t('defect.hours_of_abnormal')}</th>
                <th className="border-top-0">{t('defect.top_risk')}</th>
                <th className="border-top-0">{t('defect.risk_source')}</th>
                <th className="border-top-0">{t('defect.commonality')}</th>
                <th className="border-top-0">{t('defect.significance')}</th>
                <th className="border-top-0">{t('defect.throughput_ratio')}</th>
                {/*<th className="border-top-0">未送修機台</th>*/}
              </tr>
              </thead>
              <tbody className="border-bottom">
              {failureSymptomList.map((item, index) => {
                return (
                  <tr key={`${item.testStation}_${item.failureSymptom}`} className="text-center">
                    <td className="align-middle">{index + 1}</td>
                    <td className="align-middle">{item.testStation}</td>
                    <td className="align-middle">
                      <Button
                        color="link"
                        onClick={() => this.defectSymptomClickHandler(item)}>{item.failureSymptom_display}</Button>
                    </td>
                    <td id={`failRate_info_tip-${index}`} className="align-middle">{item.failRate}%</td>
                    <Tooltip
                      placement="right"
                      isOpen={this.state.failRateTipOpen[index]}
                      autohide={false}
                      target={`failRate_info_tip-${index}`}
                      toggle={() => this.failRateTipToggle(index)}>
                        <div>不良佔比: {item.accountFor}</div>
                        <div>({item.defectQty}/{this.props.defectiveInfo.totalFailureCount})</div>
                    </Tooltip>
                    <td className="align-middle">
                      <Button
                        color="link"
                        onClick={() => {
                          this.defectQtyClickHandler(item);
                        }}>{item.defectQty}</Button>
                    </td>
                    <td className="align-middle">{item.failureContHour}</td>
                    <td className="align-middle">{riskNameMapper(item.commonalityAssess, item.riskName_display, t)}</td>
                    {('confirmed' === item.commonalityAssess)? (
                      <React.Fragment>
                        <td className="align-middle">{item.riskCode_display}</td>
                        <td className="align-middle">
                          <div className="d-block">{item.commonality}%</div>
                          <div className="d-block">{`(${item.failQty}/${item.defectQty})`}</div>
                        </td>
                        <td className="align-middle">
                          <span id={`fs-significant-tip-${index}`}>{t(item.significantCate)}</span>
                          <Tooltip
                            autohide={false}
                            placement="top"
                            isOpen={this.state.tooltipOpen[index]}
                            target={`fs-significant-tip-${index}`}
                            toggle={() => this.tooltipToggle(index)}>{item.significant}</Tooltip>
                        </td>
                        <td className="align-middle">
                          <div className="d-block">{item.throughputRatio}%</div>
                          <div className="d-block">{`(${item.throughputQty}/${item.outputQty})`}</div>
                        </td>
                      </React.Fragment>
                    ): (
                      <React.Fragment>
                        <td className="align-middle"> - </td>
                        <td className="align-middle"> - </td>
                        <td className="align-middle"> - </td>
                        <td className="align-middle"> - </td>
                      </React.Fragment>
                    )}
                  </tr>
                );
              })}
              </tbody>
            </Table>
            <ChartDrawer chartData={failureSymptomList}/>
          </CardBody>
        </LoadingMask>
        <DataModal isOpen={!!this.state.selectedItem} toggle={this.closeModal} caption={t('defect.list_in_fail_symptom')}>
          {!this.state.selectedItem? null: (
            <DefectiveModalBody defectQtyList={this.state.defectQtyList} />
          )}
        </DataModal>
      </React.Fragment>
    );
  };

  infoTipToggle = () => {
    this.setState({ infoTipOpen: !this.state.infoTipOpen });
  };

  closeModal = () => {
    this.setState({
      selectedItem: null,
      defectQtyList: null
    });
  };

  defectQtyClickHandler = (selectedItem) => {
    this.setState({
      selectedItem,
      defectQtyList: null
    });
    defectStationList(
      this.props.defectiveInfo.product,
      this.props.defectiveInfo.floor,
      this.props.defectiveInfo.line,
      selectedItem.failureSymptom,
      selectedItem.testStation,
      this.props.defectiveInfo.startTime,
      this.props.defectiveInfo.stopTime).then(defectQtyList => {
      this.setState({
        defectQtyList
      });
    }).catch(error => {
      this.closeModal();
      this.props.pushNotification(this.props.t('message.system.error'));
    });
  };

  defectSymptomClickHandler = (failureSymptomInfo) => {
    this.setState({ loading: true });
    // this.props.commit({ failureSymptomInfo });
    // const failureItem = this.props.failureSymptomInfo;
    const defectiveInfo = this.props.defectiveInfo;

    defectSymptomInfo(
      failureSymptomInfo.failureSymptom,
      failureSymptomInfo.testStation,
      defectiveInfo.startTime,
      defectiveInfo.stopTime,
      defectiveInfo.product,
      defectiveInfo.floor,
      defectiveInfo.line,).then(({ assemblyList, stationList, dateCodeList }) => {
      this.props.commit({ failureSymptomInfo, assemblyList, stationList, dateCodeList });
    }).catch(error => {
      this.props.pushNotification(this.props.t('message.system.error'));
    }).finally(() => {
      this.setState({
        loading: false
      });
    });
  };

  tooltipToggle = (index) => {
    this.setState((prevState) => {
      prevState.tooltipOpen[index] = !prevState.tooltipOpen[index];
      return { tooltipOpen: prevState.tooltipOpen.concat([]) };
    })
  };

  failRateTipToggle = (index) => {
    this.setState((prevState) => {
      prevState.failRateTipOpen[index] = !prevState.failRateTipOpen[index];
      return { failRateTipOpen: prevState.failRateTipOpen.concat([]) };
    })
  };
}

const DefectiveModalBody = withTranslation()(
  class extends PureComponent {

    render () {
      const { t } = this.props;
      if (!this.props.defectQtyList) {
        return (<div className="text-center"><i className="fa fa-circle-o-notch fa-spin fa-3x fa-fw" /></div>);
      }

      return (
        <Table className="nowrap" responsive hover>
          {/*<thead className="d-table" style={{ width: 'calc( 100% - 1em )' }}>*/}
          <thead>
          <tr className="text-center">
            <th className="border-top-0 w-25">{t('common.serial')}</th>
            <th className="border-top-0 w-25">{t('defect.test_equipment')}</th>
            <th className="border-top-0 w-25">{t('defect.test_datetime')}</th>
            <th className="border-top-0 w-25">{t('defect.fail_symptom')}</th>
            <th className="border-top-0 w-25">{t('defect.fail_note')}</th>
            <th className="border-top-0 w-25">{t('common.note')}</th>
          </tr>
          </thead>
          <tbody>
          {this.props.defectQtyList.map(item => {
            return (
              <tr key={item.sn} className="text-center">
                <td className="align-middle">{item.sn}</td>
                <td className="align-middle">{item.machine}</td>
                <td className="align-middle">{item.testStartTime}</td>
                <td className="align-middle">{item.failureSymptom}</td>
                <td className="align-middle">{item.failureDesc}</td>
                <td className="align-middle">{item.remark}</td>
              </tr>
            );
          })}
          </tbody>
        </Table>
      );
    };
  }
);

const ChartDrawer = withTranslation()(
  class extends PureComponent {
    render () {
      const { t } = this.props;
      let labels = [], values = [], datasets = [];

      this.props.chartData.forEach(item => {
        labels.push(item.failureSymptom_display);
        values.push(item.failRate);
      });

      datasets.push({
        label: t('defect.fail_rate'),
        backgroundColor: 'rgba(215, 113, 14, 0.2)',
        borderColor: 'rgba(215, 113, 14, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(215, 113, 14, 0.4)',
        hoverBorderColor: 'rgba(215, 113, 14, 1)',
        data: values
      });
      return (<BarChart labels={labels} datasets={datasets} />);
    }
  }
);

export default withTranslation()(FailureSymptomList);
