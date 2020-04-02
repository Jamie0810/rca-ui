import React from 'react'
import { XwjAnalysisPoolIAO_PlotCard } from './XwjAnalysisPoolIAO_PlotLayout'
import XwjAnalysisPoolIAO_CaptureReveal from './XwjAnalysisPoolIAO_CaptureReveal';
import XwjAnalysisPoolIAO_CaptureEdit from './XwjAnalysisPoolIAO_CaptureEdit';

class XwjAnalysisPoolIAO_CapturePlotCard extends React.PureComponent {
  
  state = {
    isEdit: false,
    captureInfoForEdit: this.props.captureInfo || {}
  }

  PlotContent(isEdit) {
    return isEdit? XwjAnalysisPoolIAO_CaptureEdit: XwjAnalysisPoolIAO_CaptureReveal;
  };

  render() {
    let PlotContent = this.PlotContent(this.state.isEdit);
      return (
        <XwjAnalysisPoolIAO_PlotCard>
          <PlotContent
            {...this.props}
            isEdit={this.state.isEdit}
            captureToggle={this.toggle}
            captureInfoForEdit={this.state.captureInfoForEdit}
            showUpdateCapture={(updatedCaptureContent) => this.showUpdateCapture(updatedCaptureContent)} 
            />
        </XwjAnalysisPoolIAO_PlotCard>
      );
    }

  toggle = () => {
    this.setState({ isEdit: !this.state.isEdit });
    if (Object.keys(this.state.captureInfoForEdit).length !== 0){
      this.setState({ captureInfoForEdit: this.state.captureInfoForEdit});
    } else {
      this.setState({ captureInfoForEdit: this.props.captureInfo });
    }
  }

  showUpdateCapture(updatedCaptureContent) {
    this.setState({ captureInfoForEdit: updatedCaptureContent})
  };
}

export default XwjAnalysisPoolIAO_CapturePlotCard;
