import React from "react";
import {
  XwjAnalysisPoolIAO_Panel,
  XwjAnalysisPoolIAO_PanelBody,
  XwjAnalysisPoolIAO_PanelHeader
} from "./XwjAnalysisPoolIAO_Panel";
import XwjAnalysisPoolIAO_CapturePlotCard from "./XwjAnalysisPoolIAO_CapturePlotCard";
import { getAllCaptures, deleteCapture } from '../../action/analysis-pool-action'
import XwjAnalysisPoolIAO_ChartScatter from "./XwjAnalysisPoolIAO_ChartScatter";
import XwjAnalysisPoolIAO_ChartBox from "./XwjAnalysisPoolIAO_ChartBox";
import XwjAnalysisPoolIAO_ChartNormalDistribution from "./XwjAnalysisPoolIAO_ChartNormalDistribution";
import XwjAnalysisPoolIAO_ChartBar from "./XwjAnalysisPoolIAO_ChartBar";
import XwjAnalysisPoolIAO_ChartLine from "./XwjAnalysisPoolIAO_ChartLine";
import {withTranslation} from "react-i18next";
import XwjAnalysisPoolIAO_InformationScatter from "./XwjAnalysisPoolIAO_InformationScatter";
import XwjAnalysisPoolIAO_InformationBox from "./XwjAnalysisPoolIAO_InformationBox";
import XwjAnalysisPoolIAO_InformationNormalDistribution from "./XwjAnalysisPoolIAO_InformationNormalDistribution";
import XwjAnalysisPoolIAO_InformationLine from "./XwjAnalysisPoolIAO_InformationLine";
import XwjAnalysisPoolIAO_InformationBar from "./XwjAnalysisPoolIAO_InformationBar";

class XwjAnalysisPoolIAO_Capture extends React.PureComponent {
  
  state = {
    captureInfo: [], 
  }
  
  componentDidMount() {
    getAllCaptures(this.props.analysisPoolInfo.id).then(captureInfo => {
      this.setState({ captureInfo }, this.props.toggleLoading)
    })
  }

  getPlotContainers(plotType) {
    switch (plotType) {
      case 1:
        return {
          chart: XwjAnalysisPoolIAO_ChartScatter,
          information: XwjAnalysisPoolIAO_InformationScatter
        };
      case 2:
        return {
          chart: XwjAnalysisPoolIAO_ChartBox,
          information: XwjAnalysisPoolIAO_InformationBox
        };
      case 3:
        return {
          chart: XwjAnalysisPoolIAO_ChartNormalDistribution,
          information: XwjAnalysisPoolIAO_InformationNormalDistribution
        };
      case 4:
        return {
          chart: XwjAnalysisPoolIAO_ChartBar,
          information: XwjAnalysisPoolIAO_InformationBar
        };
      case 5:
        return {
          chart: XwjAnalysisPoolIAO_ChartLine,
          information: XwjAnalysisPoolIAO_InformationLine
        };
      default:
        return undefined;
    }
  }

  render() {
    const { t } = this.props;

    return (
      <XwjAnalysisPoolIAO_Panel>
        <XwjAnalysisPoolIAO_PanelHeader caption={t('analysis_set.capture.list')}>
          {/*<Button*/}
          {/*  color="dark"*/}
          {/*  size="sm"*/}
          {/*  className="btn-ghost-dark py-1 px-2 mx-1 shadow-none"*/}
          {/*>*/}
          {/*  <i className="fa fa-download fa-lg" />*/}
          {/*</Button>*/}
        </XwjAnalysisPoolIAO_PanelHeader>
        <XwjAnalysisPoolIAO_PanelBody>
          {this.state.captureInfo.map((captureInfo, index) => {
            return(
            <XwjAnalysisPoolIAO_CapturePlotCard 
              {...this.props}
              key={index}
              captureInfo={captureInfo}
              removeCapture={(noteId) => this.removeCapture(noteId)} 
              plotContainer={this.getPlotContainers(captureInfo.plotType)} />
            )}
          )}
        </XwjAnalysisPoolIAO_PanelBody>
      </XwjAnalysisPoolIAO_Panel>
    );
  }

  removeCapture(noteId) {
    this.props.showDeleteConfirm({
      message: this.props.t('analysis_set.capture.delete_notice'),
      confirm: () => {
        this.props.toggleLoading(true);
        deleteCapture(noteId)
          .then(() => {
            this.props.pushNotification(this.props.t('message.system.delete_succeed'), {level: 'success'});
            this.props.toggleLoading(false);
            getAllCaptures(this.props.match.params.id).then(captureInfo => {
              this.setState({ captureInfo }, this.props.toggleLoading)
            })
          })
          .catch(err => {
            this.props.pushNotification(this.props.t('message.system.delete_failed'));
            this.props.toggleLoading(false);
          });
      },
      cancel: null,
    });
  };
}

export default withTranslation()(XwjAnalysisPoolIAO_Capture);
