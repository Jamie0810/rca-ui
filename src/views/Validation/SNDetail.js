import React from "react";
import { Button } from 'reactstrap';
import SNDetailMainTable from "./SNDetailMainTable";
import SNDetailMainTableBreakDown from "./SNDetailMainTableBreakDown";
import SNDetailTestingData from "./SNDetailTestingData";
import {withTranslation} from "react-i18next";

const TAB_TestingData = 'testingData';
const TAB_MainTable = 'mainTable';
const TAB_MainTableBreakDown = 'mainTableBreakDown';

class SNDetail extends React.Component{
  state = {
    activeTab: TAB_TestingData
  };

  PoolTargetContent(props) {
    switch (props.activeTab) {
      case TAB_TestingData:
        return (<SNDetailTestingData {...props}/>);
      case TAB_MainTable:
        return (<SNDetailMainTable {...props}/>);
      case TAB_MainTableBreakDown:
        return (<SNDetailMainTableBreakDown {...props}/>);
      default:
        return null;
    }
  };

  render() {
    const { t } = this.props;
    let PoolTargetContent = this.PoolTargetContent;

    return (
      <PoolTargetContent {...this.props} activeTab={this.state.activeTab}>
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
      </PoolTargetContent>
    );
  }
}
export default withTranslation()(SNDetail);
