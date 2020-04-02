import React, {Component, PureComponent} from 'react';
import { Badge, Button, TabPane, Table, Tooltip, Nav, NavItem, NavLink, TabContent} from 'reactstrap';
import {defectRiskSource, defectSymptomInfo} from "../../action/defective-action";
import LoadingMask from '../Coommon/LoadingMask'
import BarChart from './BarChart';
import {RISK_FACTOR_MAPPER} from "../../utils/constant-util";
import {withTranslation} from "react-i18next";

class RiskFactorList extends PureComponent {
  state = {
    loading: false,
    activeTab: 'assembly', //assembly, station, datecode
    // assemblyList: [],
    // stationList: [],
    // dateCodeList: [],
  };

  render () {
    const { t } = this.props;
    let mapToProps = {
      defectiveInfo: this.props.defectiveInfo,
      failureSymptomInfo: this.props.failureSymptomInfo,
      commit: this.props.commit,
      loading: (loading) => this.setState({ loading })
    };

    return (
      <LoadingMask loading={this.state.loading}>
        <Nav tabs>
          <NavItem>
            <NavLink
              href="#"
              active={this.state.activeTab === 'assembly'}
              onClick={() => { this.toggle('assembly'); }}
            >
              <i className="icon-calculator" />
              <span className="mx-1">{t(RISK_FACTOR_MAPPER['assembly'])}</span>
              <Badge pill color="primary">{this.props.assemblyList.length}</Badge>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              href="#"
              active={this.state.activeTab === 'station'}
              onClick={() => { this.toggle('station'); }}
            >
              <i className="icon-basket-loaded" />
              <span className="mx-1">{t(RISK_FACTOR_MAPPER['station'])}</span>
              <Badge pill color="primary">{this.props.stationList.length}</Badge>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              href="#"
              active={this.state.activeTab === 'dateCode'}
              onClick={() => { this.toggle('dateCode'); }} >
              <i className="icon-pie-chart" />
              <span className="mx-1">{t(RISK_FACTOR_MAPPER['dateCode'])}</span>
              <Badge pill color="primary">{this.props.dateCodeList.length}</Badge>
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="assembly">
            <RiskFactorListTable
              {...mapToProps}
              data={this.props.assemblyList}
              tabId="assembly"
              riskKeyLabel={t('defect.operator')}
              // riskCategory={RISK_FACTOR_MAPPER['assembly']}
            >
              <th className="border-top-0">{t('defect.assemble_station')}</th>
              <th className="border-top-0">{t('defect.operator')}</th>
            </RiskFactorListTable>
          </TabPane>
          <TabPane tabId="station">
            <RiskFactorListTable
              {...mapToProps}
              data={this.props.stationList}
              tabId="station"
              riskKeyLabel={t('defect.equipment_serial')}
              // riskCategory={RISK_FACTOR_MAPPER['station']}
            >
              <th className="border-top-0">{t('defect.test_station')}</th>
              <th className="border-top-0">{t('defect.equipment_serial')}</th>
            </RiskFactorListTable>
          </TabPane>
          <TabPane tabId="dateCode">
            <RiskFactorListTable
              {...mapToProps}
              data={this.props.dateCodeList}
              tabId="dateCode"
              riskKeyLabel={t('defect.materiel_vendor')}
              // riskCategory={RISK_FACTOR_MAPPER['dateCode']}
            >
              <th className="border-top-0">{t('defect.risk_materiel')}</th>
              <th className="border-top-0">{t('defect.materiel_vendor')}</th>
            </RiskFactorListTable>
          </TabPane>
        </TabContent>
        <div className="animated fadeIn pt-4">
          <ChartDrawer chartData={this.props[`${this.state.activeTab}List`]} />
        </div>
        {/*{this.props.isExpanded?*/}
        {/*<div className="animated fadeIn pt-4">*/}
        {/*<ChartDrawer chartData={this.state[`${this.state.activeTab}List`]}/>*/}
        {/*</div> : null}*/}
      </LoadingMask>
    );
  };

  toggle = (tab) => this.setState({ activeTab: tab });
}

const RiskFactorListTable = withTranslation()(
  class extends PureComponent {
    state = { tooltipOpen: Array(this.props.data.length).fill(false) };

    render () {
      const { t } = this.props;

      return (
        <React.Fragment>
          <Table className="nowrap" responsive hover>
            <thead>
            <tr className="text-center">
              {this.props.children}
              <th className="border-top-0">{t('defect.commonality')}</th>
              <th className="border-top-0">{t('defect.significance')}</th>
              <th className="border-top-0">{t('defect.throughput_ratio')}</th>
              <th className="border-top-0">{t('defect.succession')}</th>
              <th className="border-top-0">{t('defect.risk_review')}</th>
            </tr>
            </thead>
            <tbody className="border-bottom">
            {this.props.data.map((item, index) => {
              return (
                <tr key={index} className="text-center">
                  <td className="align-middle">
                    <Button
                      color="link"
                      onClick={this.riskClickHandler(item)}
                      // onClick={() => {
                      //   item.riskKeyLabel = this.props.riskKeyLabel;
                      //   item.riskCategory = this.props.riskCategory;
                      //   this.props.commit({riskFactorInfo: item});
                      // }}
                    >{item.riskName_display}</Button>
                  </td>
                  <td className="align-middle">{item.riskCode_display}</td>
                  <td className="align-middle">
                    <div className="d-block">{item.commonality}%</div>
                    <div className="d-block">{`(${item.failQty}/${item.defectQty})`}</div>
                  </td>
                  <td className="align-middle">
                    <span id={`rf-significant-tip-${index}-${this.props.tabId}`}>{t(item.significantCate)}</span>
                    <Tooltip
                      placement="top"
                      isOpen={this.state.tooltipOpen[index]}
                      autohide={false}
                      target={`rf-significant-tip-${index}-${this.props.tabId}`}
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
                </tr>
              );
            })}
            </tbody>
          </Table>
        </React.Fragment>
      );
    };

    tooltipToggle = (index) => {
      this.setState((prevState) => {
        prevState.tooltipOpen[index] = !prevState.tooltipOpen[index];
        return {tooltipOpen: prevState.tooltipOpen.concat([])};
      })
    };

    riskClickHandler = riskFactorInfo => e => {
      this.props.loading(true);

      riskFactorInfo.riskKeyLabel = this.props.riskKeyLabel;
      riskFactorInfo.riskCategory = RISK_FACTOR_MAPPER[this.props.tabId];

      const { defectiveInfo, failureSymptomInfo } = this.props;

      defectRiskSource(
        failureSymptomInfo.failureSymptom,
        defectiveInfo.floor,
        defectiveInfo.product,
        defectiveInfo.line,
        riskFactorInfo.riskName,
        riskFactorInfo.riskType,
        defectiveInfo.startTime,
        defectiveInfo.stopTime,
        failureSymptomInfo.testStation
      ).then(riskSourceList => {
        this.props.commit({ riskFactorInfo, riskSourceList });
        // this.setState({
        //   loading: false,
        //   riskSourceList: data,
        //   tooltipOpen: Array(data.length).fill(false)
        // });
      }).catch(error => {
        this.props.pushNotification(this.props.t('message.system.error'));
      }).finally(() => {
        this.props.loading(false);
      });
    }
  }
);

const ChartDrawer = withTranslation()(
  class extends PureComponent {
    render () {
      const { t } = this.props;
      let labels = [], graph_1_values = [], graph_2_values = [], datasets = [];

      this.props.chartData.forEach(item => {
        labels.push(item.riskName_display);
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

export default withTranslation()(RiskFactorList);
