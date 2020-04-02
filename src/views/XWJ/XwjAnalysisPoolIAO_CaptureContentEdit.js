import React from "react";
import { 
  Col, 
  FormGroup, 
  Input, 
  Label,
  FormText
} from "reactstrap";
import {BoldLabel, FormPropertyColumn, FormRow, FormValueColumn} from "../Layout";

class XwjAnalysisPoolIAO_CaptureContentEdit extends React.PureComponent {
  render() {
    const { t } = this.props;

    return (
      <React.Fragment>
        <FormRow>
          <FormPropertyColumn md={2}>
            <BoldLabel>{t('common.caption')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn md={8}>
            <Input
              type="text" bsSize="sm"
              placeHolder={t('analysis_set.capture.caption_placeholder')}
              defaultValue={this.props.captureInfoForEdit.noteTitle}
              innerRef={ref => this.captureCaption = ref}/>
          </FormValueColumn>
        </FormRow>
        <FormRow>
          <FormPropertyColumn md={2}>
            <BoldLabel>
              {t('analysis_set.capture.content')}
            </BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn md={8}>
            <Input
              type="textarea" bsSize="sm" name="description" rows="15"
              placeHolder={t('analysis_set.capture.content_placeholder')}
              defaultValue={this.props.captureInfoForEdit.noteText}
              innerRef={ref => this.captureContent = ref}/>
            <FormText className="help-block">{t('common.limit_1000_letters_tip')}</FormText>
          </FormValueColumn>
        </FormRow>
      </React.Fragment>
    );
  }

  getConfig = () => {
    return {
      noteTitle: this.captureCaption.value,
      noteText: this.captureContent.value,
    };
  };

}

export default XwjAnalysisPoolIAO_CaptureContentEdit;
