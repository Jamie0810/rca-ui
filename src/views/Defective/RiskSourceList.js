import React, {PureComponent} from 'react';
import { Table, Tooltip } from 'reactstrap';
import BarChart from './BarChart';
import {withTranslation} from "react-i18next";
// import LoadingMask from "../Coommon/LoadingMask";

class RiskSourceList extends PureComponent {
  state = {
    // loading: true,
    // riskSourceList: [],
    tooltipOpen: Array(this.props.riskSourceList.length).fill(false)
  };

  // componentDidMount () {
  //   const { riskFactorInfo, defectiveInfo, failureSymptomInfo } = this.props;
  //
  //   defectRiskSource(
  //     failureSymptomInfo.failureSymptom,
  //     defectiveInfo.floor,
  //     defectiveInfo.product,
  //     riskFactorInfo.riskName,
  //     riskFactorInfo.riskType,
  //     defectiveInfo.startTime,
  //     defectiveInfo.stopTime,
  //     failureSymptomInfo.testStation
  //   ).then(data => {
  //     this.setState({
  //       loading: false,
  //       riskSourceList: data,
  //       tooltipOpen: Array(data.length).fill(false)
  //     });
  //   });
  // }

  render () {
    const { t } = this.props;
    const riskFactorInfo = this.props.riskFactorInfo;

    return (
      <React.Fragment>
        <Table className="nowrap" responsive hover>
          <thead>
          <tr className="text-center">
            <th className="border-top-0">{riskFactorInfo.riskKeyLabel}</th>
            <th className="border-top-0">{t('defect.commonality')}</th>
            <th className="border-top-0">{t('defect.significance')}</th>
            <th className="border-top-0">{t('defect.throughput_ratio')}</th>
            <th className="border-top-0">{t('defect.succession')}</th>
            <th className="border-top-0">{t('defect.risk_review')}</th>
            {/*<th className="border-top-0">不良品時序圖</th>*/}
          </tr>
          </thead>
          <tbody className="border-bottom">
          {this.props.riskSourceList.map((item, index) => {
            return (
              <tr key={item.riskCode} className="text-center">
                <td className="align-middle">{item.riskCode_display}</td>
                <td className="align-middle">
                  <div className="d-block">{item.commonality}%</div>
                  <div className="d-block">{`(${item.failQty}/${item.defectQty})`}</div>
                </td>
                <td className="align-middle">
                  <span id={`rs-significant-tip-${index}`}>{t(item.significantCate)}</span>
                  <Tooltip
                    placement="top"
                    isOpen={this.state.tooltipOpen[index]}
                    autohide={false}
                    target={`rs-significant-tip-${index}`}
                    toggle={() => this.tooltipToggle(index)}
                  >
                    {item.significant}
                  </Tooltip>
                </td>
                <td className="align-middle">
                  <div className="d-block">{item.throughputRatio}%</div>
                  <div className="d-block">{`(${item.throughputQty}/${item.outputQty})`}</div>
                </td>
                <td className="align-middle">{item.failureContRatio}%</td>
                <td className="align-middle">{item.riskPoint}</td>
                {/*<td className="align-middle">{item.}</td>*/}
              </tr>
            );
          })}
          </tbody>
        </Table>
        <ChartDrawer chartData={this.props.riskSourceList} />
      </React.Fragment>
    );
  };

  tooltipToggle = (index) => {
    this.setState((prevState) => {
      prevState.tooltipOpen[index] = !prevState.tooltipOpen[index];
      return { tooltipOpen: prevState.tooltipOpen.concat([]) };
    })
  };
}

const ChartDrawer = withTranslation()(
  class extends PureComponent {
    render () {
      if (!this.props.chartData) {
        return (<i className="fa fa-circle-o-notch fa-spin fa-3x fa-fw"/>);
      }

      const { t } = this.props;
      let labels = [], graph_1_values = [], graph_2_values = [], datasets = [];

      this.props.chartData.forEach(item => {
        labels.push(item.riskCode_display);
        graph_1_values.push(item.commonality);
        graph_2_values.push(item.throughputRatio);
      });

      datasets.push({
        label: t('defect.commonality'),
        backgroundColor: 'rgba(25, 90, 152, 0.2)',
        borderColor: 'rgba(25, 90, 152, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(25, 90, 152, 0.4)',
        hoverBorderColor: 'rgba(25, 90, 152, 1)',
        data: graph_1_values
      });
      datasets.push({
        label: t('defect.throughput_ratio'),
        backgroundColor: 'rgba(215, 113, 14, 0.2)',
        borderColor: 'rgba(215, 113, 14, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(215, 113, 14, 0.4)',
        hoverBorderColor: 'rgba(215, 113, 14, 1)',
        data: graph_2_values
      });
      return <BarChart labels={labels} datasets={datasets}/>;
    }
  }
);

export default withTranslation()(RiskSourceList);
