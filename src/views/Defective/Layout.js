import React, {PureComponent} from 'react';
import { Card } from 'reactstrap';
import withNotify from '../../utils/hoc/withNotify'
import QueryForm from './QueryForm';
import DefectiveInfo from './DefectiveInfo';
import FailureSymptomList from './FailureSymptomList';
import FailureSymptomInfo from './FailureSymptomInfo';
import RiskFactorList from './RiskFactorList';
import RiskFactorInfo from './RiskFactorInfo';
import RiskSourceList from './RiskSourceList';

class Layout extends PureComponent {
  state = {
    defectiveInfo: undefined,
    failureSymptomList: [],
    failureSymptomInfo: undefined,
    assemblyList: [],
    stationList: [],
    dateCodeList: [],
    riskFactorList: [],
    riskFactorInfo: undefined,
    riskSourceList: [],
  };

  render () {
    return (
        <Card className="animated fadeIn">
          <QueryForm
            collapse={!!this.state.defectiveInfo}
            commit={this.commit}
            pushNotification={this.props.pushNotification} />
          {/*level 1: defective data*/}
          {!this.state.defectiveInfo? null:
            <DefectiveInfo
              defectiveInfo={this.state.defectiveInfo}
              collapse={this.state.failureSymptomInfo}
              close={() => {
                this.setState({
                  defectiveInfo: undefined,
                  failureSymptomList: [],
                  failureSymptomInfo: undefined,
                  assemblyList: [],
                  stationList: [],
                  dateCodeList: [],
                  riskFactorList: [],
                  riskFactorInfo: undefined,
                  riskSourceList: [],
                });
              }}
              // collapse={!!this.state.failureSymptomInfo}
              pushNotification={this.props.pushNotification}>
              <FailureSymptomList
                commit={this.commit}
                defectiveInfo={this.state.defectiveInfo}
                failureSymptomList={this.state.failureSymptomList}
                pushNotification={this.props.pushNotification} />
            </DefectiveInfo>}

          {/*level 2: failureSymptom data*/}
          {!this.state.failureSymptomInfo? null: (
            <FailureSymptomInfo
              close={e => this.setState({
                failureSymptomInfo: undefined,
                assemblyList: [],
                stationList: [],
                dateCodeList: [],
                riskFactorList: [],
                riskFactorInfo: undefined,
                riskSourceList: [],
              })}
              failureSymptomInfo={this.state.failureSymptomInfo}
              collapse={!!this.state.riskFactorInfo}
              pushNotification={this.props.pushNotification}
            >
              <RiskFactorList
                commit={this.commit}
                defectiveInfo={this.state.defectiveInfo}
                assemblyList={this.state.assemblyList}
                stationList={this.state.stationList}
                dateCodeList={this.state.dateCodeList}
                failureSymptomInfo={this.state.failureSymptomInfo}
                pushNotification={this.props.pushNotification} />
            </FailureSymptomInfo>
          )}

          {/*level 3: risk factor data*/}
          {!this.state.riskFactorInfo? null: (
            <RiskFactorInfo
              failureSymptomInfo={this.state.failureSymptomInfo}
              riskFactorInfo={this.state.riskFactorInfo}
              close={e => this.setState({
                riskFactorInfo: undefined,
                riskSourceList: [],
              })}
            >
              <RiskSourceList
                // defectiveInfo={this.state.defectiveInfo}
                // failureSymptomInfo={this.state.failureSymptomInfo}
                riskFactorInfo={this.state.riskFactorInfo}
                riskSourceList={this.state.riskSourceList} />
            </RiskFactorInfo>
          )}
        </Card>
    );
  }

  commit = (
    {
      defectiveInfo,
      failureSymptomList,
      failureSymptomInfo,
      assemblyList,
      stationList,
      dateCodeList,
      riskFactorList,
      riskFactorInfo,
      riskSourceList
    }) => {
    this.setState(prevState => ({
      defectiveInfo: defectiveInfo || prevState.defectiveInfo,
      failureSymptomList: failureSymptomList || prevState.failureSymptomList,
      failureSymptomInfo: failureSymptomInfo || prevState.failureSymptomInfo,
      assemblyList: assemblyList || prevState.assemblyList,
      stationList: stationList || prevState.stationList,
      dateCodeList: dateCodeList || prevState.dateCodeList,
      riskFactorList: riskFactorList || prevState.riskFactorList,
      riskFactorInfo: riskFactorInfo || prevState.riskFactorInfo,
      riskSourceList: riskSourceList || prevState.riskSourceList
    }));
  };
}

export default withNotify(Layout);
