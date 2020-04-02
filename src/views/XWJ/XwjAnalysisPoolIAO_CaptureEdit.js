import React from "react";
import {
  XwjAnalysisPoolIAO_PlotAction,
  XwjAnalysisPoolIAO_PlotCardBody,
  XwjAnalysisPoolIAO_PlotLeftPad, 
  XwjAnalysisPoolIAO_PlotRightFill
} from "./XwjAnalysisPoolIAO_PlotLayout";
import {Button} from "reactstrap";
import XwjAnalysisPoolIAO_CaptureContentEdit from './XwjAnalysisPoolIAO_CaptureContentEdit';
import { updateCapture } from '../../action/analysis-pool-action'
import {withTranslation} from "react-i18next";

class XwjAnalysisPoolIAO_CaptureEdit extends React.PureComponent {
 
  render() {
    const { t } = this.props;

    return (
      <div className="animated fadeIn">
        <XwjAnalysisPoolIAO_PlotCardBody>
          <XwjAnalysisPoolIAO_PlotLeftPad>
            <XwjAnalysisPoolIAO_PlotAction>
              <Button 
                block 
                className="btn-ghost-dark mx-0 px-0 py-1 my-2 shadow-none"
                onClick={this.toCaptureReveal}>
                <i className="fa fa-arrow-left fa-lg" />
              </Button>
              <Button 
                block 
                className="btn-ghost-dark mx-0 px-0 py-1 my-2 shadow-none"
                onClick={this.saveCaptureEdit}>
                <i className="fa fa-save fa-lg" />
              </Button>
            </XwjAnalysisPoolIAO_PlotAction>
          </XwjAnalysisPoolIAO_PlotLeftPad>
          <XwjAnalysisPoolIAO_PlotRightFill>
            <XwjAnalysisPoolIAO_CaptureContentEdit
              {...this.props}
              ref={ref => this.captureContentEdit = ref}
              captureInfoForEdit={this.props.captureInfoForEdit}/>
          </XwjAnalysisPoolIAO_PlotRightFill>
        </XwjAnalysisPoolIAO_PlotCardBody>
      </div>
    );
  }

  toCaptureReveal = e => {
    this.props.captureToggle();
  };

  saveCaptureEdit = e => {
    let postData = this.captureContentEdit.getConfig();
    this.props.showConfirm({
      message: this.props.t('analysis_set.capture.save_notice'),
      confirm: () => {
        // let id = { id: this.props.captureInfo.id };
        // let postData = Object.assign({}, id, captureContentConf);
        updateCapture(this.props.captureInfo.id, postData)
        .then(capture => {
          console.log('capture:', capture);
          this.props.showUpdateCapture(capture);
          this.props.captureToggle();
          this.props.pushNotification(this.props.t('message.system.save_succeed'), {level: 'success'});
          // getCapture(this.props.captureInfo.id).then(updatedCaptureContent => {
          //   this.props.showUpdateCapture(updatedCaptureContent);
          //   this.props.captureToggle();
          //   this.props.pushNotification(this.props.t('message.system.save_succeed'), 'success');
          // })
        })
        .then(this.props.toggleLoading)
        .catch(err => {
          this.props.pushNotification(this.props.t('message.system.save_failed'));
          this.props.toggleLoading(false);
        });
      },
      cancel: null
    });
    
  };

  remove = e => {};
}

export default withTranslation()(XwjAnalysisPoolIAO_CaptureEdit);
