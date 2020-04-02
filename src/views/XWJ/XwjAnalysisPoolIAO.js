import React from "react";
import { 
  TabContent, 
  TabPane, 
  Nav, 
  NavItem, 
  NavLink
} from 'reactstrap';
import classnames from 'classnames';
import XwjAnalysisPoolIAO_Target from './XwjAnalysisPoolIAO_Target';
import XwjAnalysisPoolIAO_Visualize from './XwjAnalysisPoolIAO_Visualize';
import XwjAnalysisPoolIAO_Capture from './XwjAnalysisPoolIAO_Capture';
import XwjAnalysisPoolIAO_Matrix from './XwjAnalysisPoolIAO_Matrix';
import {isEmpty} from "lodash";
import {withTranslation} from "react-i18next";

class XwjAnalysisPoolIAO extends React.PureComponent {
  state = {
    visualizeDisabled: isEmpty(this.props.analysisPoolInfo.settingJson),
    activeTab: isEmpty(this.props.analysisPoolInfo.settingJson)? 'IAO_Target': 'IAO_Visualize',
    dataset: null,
    dataPool: [],
    plotTypeId: null
  };

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({ activeTab: tab });
    }
  };

  render() {
    const { t } = this.props;

    return (
      <div>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ 
                active: this.state.activeTab === 'IAO_Target' 
              })}
              onClick={() => { this.toggle('IAO_Target'); }}
            >{t('analysis_set.reveal_tab_target')}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              disabled={this.state.visualizeDisabled}
              className={classnames({
                active: this.state.activeTab === 'IAO_Visualize' 
              })}
              onClick={() => { this.toggle('IAO_Visualize'); }}
            >{t('analysis_set.reveal_tab_visualize')}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({
                active: this.state.activeTab === 'IAO_Capture' 
              })}
              onClick={() => { this.toggle('IAO_Capture'); }}
            >{t('analysis_set.reveal_tab_capture')}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({
                active: this.state.activeTab === 'IAO_Matrix'
              })}
              onClick={() => { this.toggle('IAO_Matrix'); }}
            >{t('analysis_set.reveal_tab_matrix')}
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <IAO_TabPane tabId="IAO_Target">
            {this.state.activeTab === 'IAO_Target'? (
              <XwjAnalysisPoolIAO_Target
                {...this.props}
                next={() => this.setState({
                  visualizeDisabled: false,
                  activeTab: 'IAO_Visualize'
                })}/>
            ): null}
          </IAO_TabPane>
          <IAO_TabPane tabId="IAO_Visualize">
            {this.state.activeTab === 'IAO_Visualize'? (
              <XwjAnalysisPoolIAO_Visualize 
                {...this.props}/>
            ): null}
          </IAO_TabPane>
          <IAO_TabPane tabId="IAO_Capture">
            {this.state.activeTab === 'IAO_Capture'? (
              <XwjAnalysisPoolIAO_Capture 
                {...this.props}/>
            ): null}
          </IAO_TabPane>
          <IAO_TabPane tabId="IAO_Matrix">
            {this.state.activeTab === 'IAO_Matrix'? (
              <XwjAnalysisPoolIAO_Matrix
                {...this.props}/>
            ): null}
          </IAO_TabPane>
        </TabContent>
      </div>
    );
  }
}

class IAO_TabPane extends React.PureComponent {
  render() {
    return (
      <TabPane className="px-5" {...this.props}>
        {this.props.children}
      </TabPane>
    );
  }
}

export default withTranslation()(XwjAnalysisPoolIAO);
