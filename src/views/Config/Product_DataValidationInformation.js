import React from "react";
import {
  XwjAnalysisPoolIAO_Panel,
  XwjAnalysisPoolIAO_PanelBody,
  XwjAnalysisPoolIAO_PanelHeader
} from "../XWJ/XwjAnalysisPoolIAO_Panel";
import { Col, FormGroup } from "reactstrap";
import {withTranslation} from "react-i18next";
import {BlockLabel, BoldLabel, FormPropertyColumn, FormRow, FormValueColumn} from "../Layout";

class Product_DataValidationInformation extends React.PureComponent{
  
  render() {
    const { t } = this.props;

    return (
      <XwjAnalysisPoolIAO_Panel>
        <XwjAnalysisPoolIAO_PanelHeader caption={t('product.validation.information_caption')} />
        <XwjAnalysisPoolIAO_PanelBody>
          <FormRow>
            <FormPropertyColumn md={3}>
              <BoldLabel>{t('product.validation.ftp_directory')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn md={3}>
              <BlockLabel>{this.props.validationInfo.ftpPath}</BlockLabel>
            </FormValueColumn>
          </FormRow>

          <FormRow>
            <FormPropertyColumn md={3}>
              <BoldLabel>{t('product.validation.summary_file_directory')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn md={3}>
              <BlockLabel>{this.props.validationInfo.summaryFilePath}</BlockLabel>
            </FormValueColumn>
          </FormRow>

          <FormRow>
            <FormPropertyColumn md={3}>
              <BoldLabel>{t('product.validation.validate_period')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn md={3}>
              <BlockLabel>
                {this.props.validationInfo.verify_start_time} ~{this.props.validationInfo.verify_end_time}
              </BlockLabel>
            </FormValueColumn>
          </FormRow>

        </XwjAnalysisPoolIAO_PanelBody>
      </XwjAnalysisPoolIAO_Panel>
    );
  }
}

export default withTranslation()(Product_DataValidationInformation);
