import React, {PureComponent} from 'react';
import { Table } from 'reactstrap';
import { AppSwitch } from '@coreui/react';
import {withTranslation} from "react-i18next";

class FailureFactorsAnalysis extends PureComponent {
  state = {
    selectedRow: 0,
    selectedItem: null,
    isSwitchOn: true,
    // selectedRowHover: 'wyj-table-hover',
    alertList: [],
  };

  // componentDidMount() {
  //   this.loopTrigger();
  // }

  static getDerivedStateFromProps(props, state) {
    // console.log('getDerivedStateFromProps: ', props);
    let alertList = props.alertList || [];
    // let selectedRow = state.selectedRow;
    // if (alertList.length <= selectedRow)
    //   selectedRow = 0;
    return {alertList};

    /////

    // let selectedRow = state.selectedRow;
    // let selectedItem = null;
    //

    //
    // selectedItem = alertList[selectedRow];
    //
    // // props.changeCommonalityAnalysisData(selectedItem);
    // return {alertList, selectedRow, selectedItem};
  }

  componentDidUpdate (prevProps, prevState) {
    // console.log('componentDidUpdate');
    // console.log('prevProps.alertList: ', prevProps.alertList);
    // console.log('this.props.alertList: ', this.props.alertList);
    // console.log(prevProps.alertList !== this.props.alertList);
    if (prevProps.alertList !== this.props.alertList) {
      let selectedRow = 0;
      this.clickOnYieldData(selectedRow);
      // clearInterval(this.loopTimer);
      //
      // this.setState({selectedRow}, () => {
      //   this.clickOnYieldData(selectedRow);
      //   this.loopTimer = this.looper()
      // });
    }
    // let alertList = this.props.alertList || [];
    //
    // if (alertList.length > 0) {
    //   this.clickOnYieldData(this.state.selectedRow);
    // }

    // console.log('=======Failure componentDidUpdate=======')
    // console.log('prevProps.alertList',prevProps.alertList)
    // console.log('this.props.alertList',this.props.alertList)
    // if (prevProps.alertList !== this.props.alertList) {
    //   if (this.props.alertList.length !== 0 ) {
    //     this.loopTimer = this.looper();
    //   }
    // }
  }

  componentWillUnmount() {
    clearInterval(this.loopTimer);
  }

  render () {
    const { t } = this.props;

    return (
      <React.Fragment>
        <div className="pb-6 align-middle text-center">
          <span className="h2 wyj-text-brown">{t('wyj.defect_analysis')}</span>
          <AppSwitch
            className={'ml-3'} 
            variant={'pill'}
            // color={'warning'}
            defaultChecked={this.state.isSwitchOn}
            onChange={this.toggleLooping} />
        </div>
        <Table className="h4 mt-3 text-white">
          <thead className="font-weight-bold">
            <tr>
              <th className="text-left">{t('defect.test_station')}</th>
              <th className="text-left">{t('defect.fail_symptom')}</th>
              <th className="text-right">{t('defect.fail_rate')}</th>
              <th className="text-center">{t('wyj.defect_producing_amount')}</th>
            </tr>
          </thead>
          <tbody className="font-weight-normal wyj-table-hover">
            {this.state.alertList.map((item, i) => {
              let selectedRowColor = (this.state.selectedRow === i)? 'wyj-table-selected': '';
              // let selectedItem = this.state.selectedItem;
              // if (selectedItem.failureSymptom === item.failureSymptom
              //   && selectedItem.testStation === item.testStation) {
              //   selectedRowColor = "wyj-table-selected";
              // } else {
              //   selectedRowColor = "";
              // }
              return (
                <tr key={`${item.testStation}_${item.failureSymptom}`}
                    onClick={(e) => this.clickOnYieldData(i)}
                    className={selectedRowColor}>
                  <td className="text-left">{item.testStation}</td>
                  <td className="text-left">{item.failureSymptom_display}</td>
                  <td className="text-right">{Number((item.failRate * 100).toFixed(2))}
                    <span className="wyj-punctuation-color"> %</span>
                  </td>
                  <td className="text-center">{item.testStationFail} 
                    <span className="wyj-punctuation-color"> / </span> 
                    {item.riskList[0].outputQty}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </React.Fragment>
    );
  }

  highlightNext = () => {
    let selectedRow = (this.state.selectedRow + 1) % (this.state.alertList.length);
    // let selectedItem = this.state.alertList[selectedRow];
    // this.setState({ selectedRow });
    // this.props.changeCommonalityAnalysisData(selectedItem);
    this.highlight(selectedRow);
  };

  highlight = selectedRow => {
    this.setState({ selectedRow });
    let selectedItem = this.state.alertList[selectedRow];
    this.props.changeCommonalityAnalysisData(selectedItem);
  };

  loopTrigger = () => {
    clearInterval(this.loopTimer);
    this.loopTimer = setInterval(this.highlightNext, 5000);
  };

  clickOnYieldData(selectedRow) {
    // let selectedItem = this.state.alertList[selectedRow];
    // this.setState({ selectedRow });
    // this.props.changeCommonalityAnalysisData(selectedItem);
    this.highlight(selectedRow);
    if (this.state.isSwitchOn) {
      this.loopTrigger();
    }
  };

  toggleLooping = e  => {
    let isSwitchOn = e.target.checked;
    this.setState({ isSwitchOn }, () => {
      if (isSwitchOn) {
        // console.log("switch on")
        this.loopTrigger();
      } else {
        // console.log("switch off")
        clearInterval(this.loopTimer);
      }
    });
  }
}

export default withTranslation()(FailureFactorsAnalysis);
