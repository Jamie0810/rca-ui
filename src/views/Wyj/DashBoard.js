import React, {PureComponent} from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import withNotify from '../../utils/hoc/withNotify';
import withLoading from "../../utils/hoc/withLoading";
import WyjCaption from './WyjCaption';
import WyjCriteria from './WyjCriteria';
import FailureFactorsAnalysis from './FailureFactorsAnalysis';
import WyjBarChart from './WyjBarChart';
import CommonalityAnalysis from './CommonalityAnalysis';
import CommonalityRadarChart from './CommonalityRadarChart';
import { getCookie } from '../../utils/cookie-util';
import { getLatestProductValidationTime } from "../../action/validation-action";
import {withTranslation} from "react-i18next";
import {fetchYieldData} from "../../action/defective-action";

class Dashboard extends PureComponent {

  state = {
    yieldData: {},
    selectedYield: null,
    // riskList: [],
    // failureSymptom: [],
    // testStation: [],
    // commonality: [],
    criteria: {},
    validationData: null
  };
  
  componentDidMount () {
    let state = getCookie('wyj-state') || {};
    let criteria = state.criteria || {};
    this.setState ({ criteria });
    if (!criteria.stopTimeStr) {
      // console.log('Data will be updated every 15 mins');
      this.fetchData(criteria);
      this.interval = setInterval(this.fetchData, 900000, criteria) //900000,15 min
    } else {
      // console.log('Data will not be updated');
      this.fetchData(criteria)
    }
  }
 
  fetchData = (criteria) => {
    this.props.clearNotification();
    this.props.toggleLoading(true);

    return fetchYieldData(criteria).then(yieldData => {
      getLatestProductValidationTime({ product: yieldData.product }).then(validationData => {
        this.setState({ validationData });
      });

      this.setState({ yieldData });
      // if (yieldData.alertList.length !== 0) {
      //   this.setState({
      //     // selectedAlertListItem: yieldData.alertList[0],
      //     riskList: yieldData.alertList[0].riskList,
      //     commonality: yieldData.alertList[0].commonality,
      //     testStation: yieldData.alertList[0].testStation,
      //     failureSymptom: yieldData.alertList[0].failureSymptom_display,
      //   });
      // }
    }).catch(error => {
      this.props.pushNotification(this.props.t('message.system.error'), 'danger', false);
    }).finally(this.props.toggleLoading);
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  };

  render () {
    const yieldData = this.state.yieldData;
    let {commonality = []} = this.state.selectedYield || {};
    return yieldData?
    // return(
      <div className="text-white wyj-background-color">
        <Container fluid>
          <Row>
            <Col className="px-0">
              <WyjCaption criteria={this.state.criteria}/>
            </Col>
          </Row>
            <Row className="border-bottom">
              <Col>
                <WyjCriteria
                  validationData={this.state.validationData}
                  prod={yieldData.product}
                  line={this.state.criteria.line} 
                  startTime={yieldData.startTime} 
                  stopTime={yieldData.stopTime}
                  dataStartTime={yieldData.dataStartTime}
                  dataEndTime={yieldData.dataEndTime} />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col lg={7}>
                <FailureFactorsAnalysis
                  alertList={yieldData.alertList}
                  changeCommonalityAnalysisData={this.changeCommonalityAnalysisData} />
              </Col>
              <Col lg={5}>
                <WyjBarChart alertList={yieldData.alertList} />
              </Col>
            </Row>
            <Row>
              <Col lg={7}>
                <CommonalityAnalysis selectedYield={this.state.selectedYield} />
              </Col>
              <Col lg={5}>
                <CommonalityRadarChart key={Date.now()} commonality={commonality} />
              </Col>
            </Row>
        </Container>
      {/* </div>) */}
      </div>:
      <Redirect to='/wyj'/>
  }

  changeCommonalityAnalysisData = (selectedYield) => {
    this.setState({ selectedYield })
    // console.log('selectedItem: ', selectedRow, selectedItem);
  }
}

export default withTranslation()(withNotify(withLoading(Dashboard)));
