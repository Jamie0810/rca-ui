import React from "react";
import {withTranslation} from "react-i18next";

class XwjAnalysisPoolIAO_CaptureContent extends React.PureComponent {
  render() {
    const { t } = this.props;

    return (
      <div className="pl-2 pt-2" style={{width: '265px'}}>
        <div>
          <span className="h5">{this.props.captureInfo.noteTitle || t('common.no_caption')}</span>
          {/* <Badge pill className="ml-2" color="info">{this.props.captureInfo.id}</Badge> */}
        </div>
        <div>
          <div className="pt-2">{this.props.captureInfo.noteText || t('analysis_set.capture.no_content')}</div>
        </div>
        {/* <div 
          className="pt-2"
          style={{display: 'inline-block'}}
          dangerouslySetInnerHTML = {{__html: this.state.noteText || '無筆記內容'}}/> */}
      </div>
    );
  }
}

export default withTranslation()(XwjAnalysisPoolIAO_CaptureContent);
