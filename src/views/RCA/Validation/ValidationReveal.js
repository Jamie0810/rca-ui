import React from "react";
import { Button } from 'reactstrap';
import ValidationReveal_AssemblingMaster from "./ValidationReveal_AssemblingMaster";
import ValidationReveal_AssemblingBreakdown from "./ValidationReveal_AssemblingBreakdown";
import ValidationReveal_TestData from "./ValidationReveal_TestData";
import {withTranslation} from "react-i18next";

const TAB_TestingData = 'testingData';
const TAB_MainTable = 'mainTable';
const TAB_MainTableBreakDown = 'mainTableBreakDown';

class ValidationReveal extends React.Component{
  state = {
    activeTab: TAB_TestingData
  };

  PoolTargetContent(props) {
    switch (props.activeTab) {
      case TAB_TestingData:
        return (<ValidationReveal_TestData {...props}/>);
      case TAB_MainTable:
        return (<ValidationReveal_AssemblingMaster {...props}/>);
      case TAB_MainTableBreakDown:
        return (<ValidationReveal_AssemblingBreakdown {...props}/>);
      default:
        return (<ValidationReveal_TestData {...props}/>);
    }
  };

  render() {
    const { t } = this.props;
    let PoolTargetContent = this.PoolTargetContent;

    return (
      <React.Fragment>
        <div className="text-right">
          <Button
            size="sm" color='white' className="border-left"
            disabled={this.state.activeTab === TAB_TestingData}
            onClick={e => this.setState({ activeTab: TAB_TestingData })}
          >{t('validation.tab.test_data')}</Button>
          <Button
            size="sm" color='white' className="border-left"
            disabled={this.state.activeTab === TAB_MainTable}
            onClick={e => this.setState({ activeTab: TAB_MainTable })}
          >{t('validation.tab.assemble_master')}</Button>
          <Button
            size="sm" color='white' className="border-left"
            disabled={this.state.activeTab === TAB_MainTableBreakDown}
            onClick={e => this.setState({ activeTab: TAB_MainTableBreakDown })}
          >{t('validation.tab.assemble_detail')}</Button>
        </div>
        <PoolTargetContent {...this.props} activeTab={this.state.activeTab}/>
      </React.Fragment>    
    );
  }
}
export default withTranslation()(ValidationReveal);
