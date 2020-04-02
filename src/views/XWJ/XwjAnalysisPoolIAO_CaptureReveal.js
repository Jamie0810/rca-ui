import React from "react";
import {Button} from "reactstrap";
import XwjAnalysisPoolIAO_CaptureContent from "./XwjAnalysisPoolIAO_CaptureContent";
import XwjAnalysisPoolIAO_CaptureRevealDetail from "./XwjAnalysisPoolIAO_CaptureRevealDetail";
import {
  XwjAnalysisPoolIAO_PlotAction, 
  XwjAnalysisPoolIAO_PlotCardBody, 
  XwjAnalysisPoolIAO_PlotRightFill,
  XwjAnalysisPoolIAO_PlotLeftPad, 
  XwjAnalysisPoolIAO_PlotFooter
} from "./XwjAnalysisPoolIAO_PlotLayout";
import DataModal from "../Coommon/DataModal";
import {withTranslation} from "react-i18next";

class XwjAnalysisPoolIAO_CaptureReveal extends React.PureComponent {
  state = {
    captureInfo: {},
    captureDetailModal: false
  }

  componentDidMount () {
    if (Object.keys(this.props.captureInfoForEdit).length !== 0){
      this.setState({ captureInfo: this.props.captureInfoForEdit});
    } else {
      this.setState({ captureInfo: this.props.captureInfo});
    }
  }

  render() {
    if (!this.props.captureInfo) {
      return null;
    }

    const { t } = this.props;

    let PlotChart = this.props.plotContainer.chart;
    let chartSetting = this.props.captureInfo.plotJson? JSON.parse(this.props.captureInfo.plotJson): {};
    let chartData = this.props.captureInfo.dataJson? JSON.parse(this.props.captureInfo.dataJson): {};
    // let dataJsonAndPlotJsonBothExist = !(!this.props.captureInfo.dataJson || !this.props.captureInfo.plotJson);
    return (
      <div className="animated fadeIn">
        <XwjAnalysisPoolIAO_PlotCardBody>
          <XwjAnalysisPoolIAO_PlotLeftPad>
            <XwjAnalysisPoolIAO_PlotAction>
            <Button 
              block 
              className="btn-ghost-dark mx-0 px-0 py-1 my-2 shadow-none"
              onClick={this.toCaptureEdit}>
              <i className="fa fa-pencil fa-lg" />
            </Button>
            <Button   
              block 
              className="btn-ghost-dark mx-0 px-0 py-1 my-2 shadow-none"
              onClick={this.toCaptureDetail}>
              <i className="fa fa-info-circle fa-lg" />
            </Button>
            <Button 
              block 
              className="btn-ghost-danger px-0 py-1 mb-4 mt-auto shadow-none"
              onClick={this.removeCapture}>
              <i className="fa fa-trash fa-lg" />
            </Button>
            </XwjAnalysisPoolIAO_PlotAction>
          </XwjAnalysisPoolIAO_PlotLeftPad>
          <XwjAnalysisPoolIAO_PlotLeftPad>
            <XwjAnalysisPoolIAO_CaptureContent 
              captureInfo={this.state.captureInfo}/>
          </XwjAnalysisPoolIAO_PlotLeftPad>
          {/*<XwjAnalysisPoolIAO_PlotLeftPad>*/}
          {/*  <div className="h-100 d-flex align-content-center flex-wrap py-3">*/}
          {/*    <div className="h-100 border-right border-light"/>*/}
          {/*  </div>*/}
          {/*</XwjAnalysisPoolIAO_PlotLeftPad>*/}
          <XwjAnalysisPoolIAO_PlotRightFill>
            <PlotChart setting={chartSetting} data={chartData}/>
          </XwjAnalysisPoolIAO_PlotRightFill>
        </XwjAnalysisPoolIAO_PlotCardBody>
        <XwjAnalysisPoolIAO_PlotFooter>
          <div className="nowrap small text-muted">
            <span>{`#${this.props.captureInfo.id}`}</span>
            <span className="ml-3">{this.props.captureInfo.createTime}</span>
          </div>
        </XwjAnalysisPoolIAO_PlotFooter>
        <DataModal 
          size="xl"
          caption={t('analysis_set.capture.information')}
          toggle={this.toCaptureDetail}
          isOpen={this.state.captureDetailModal}>
          <XwjAnalysisPoolIAO_CaptureRevealDetail 
            {...this.props} chartSetting={chartSetting} chartData={chartData}/>
        </DataModal>
      </div>
    );
  }

  toCaptureDetail = e => this.setState(prevState => ({
    captureDetailModal: !prevState.captureDetailModal
  }));

  toCaptureEdit = e => {
    this.props.captureToggle();
  };

  removeCapture = e => {
    let noteId = this.props.captureInfo.id;
    this.props.removeCapture(noteId);
  };
}

export default withTranslation()(XwjAnalysisPoolIAO_CaptureReveal);
