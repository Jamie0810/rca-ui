import React from "react";
import {
  XwjAnalysisPoolIAO_Panel,
  XwjAnalysisPoolIAO_PanelBody,
  XwjAnalysisPoolIAO_PanelHeader
} from "../XWJ/XwjAnalysisPoolIAO_Panel";
import { Col, FormGroup, Input, Button } from "reactstrap";
import {map, orderBy, sortBy} from "lodash";
import withNotify from "../../../src/utils/hoc/withNotify";
import {withTranslation} from "react-i18next";
import {BlockLabel, BoldLabel, FormPropertyColumn, FormRow, FormValueColumn} from "../Layout";

class Product_DataValidationResult extends React.PureComponent{
  state = {
    verifyResult: null,
    filePath: null,
    validations: []
  };

  componentDidMount() {
    this.props.dataProvider(this.props.product.id)
      .then(validations => {
        if (validations.length === 0) {
          this.props.pushNotification(this.props.t('message.product.no_validation_result'));
          return ;
        }

        validations = orderBy(validations, ['verifyDate'], ['desc']);
        let {verifyResult, filePath} = validations[0] || {};
        this.setState({ validations, verifyResult, filePath });
      });
  }

  render() {
    const { t } = this.props;
    // let validatedDuration = map(this.validation, 'verifyDate');

    return (
      <XwjAnalysisPoolIAO_Panel>
        <XwjAnalysisPoolIAO_PanelHeader caption={this.props.title} />
        <XwjAnalysisPoolIAO_PanelBody>
          <FormRow>
            <FormPropertyColumn md={3}>
              <BoldLabel>{t('product.validation.validate_date')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn md={3}>
              <Input
                type="select"  
                bsSize="sm"
                innerRef={ref => this.duration = ref}
                onChange={this.changeHandler}>
                {this.state.validations.map(({verifyDate}, index) => (
                  <option key={index} value={index}>{verifyDate}</option>
                ))}
                {/*{this.props.durationOptions}*/}
              </Input>
            </FormValueColumn>
          </FormRow>

          <FormRow>
            <FormPropertyColumn md={3}>
              <BoldLabel>{t('product.validation.validate_result')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn md={3}>
              <BlockLabel>{this.state.verifyResult}</BlockLabel>
            </FormValueColumn>
          </FormRow>

          <FormRow>
            <FormPropertyColumn md={3}>
              <BoldLabel>{t('product.validation.download_report')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn md={3}>
              <Button
                color="dark"
                size="sm"
                className="btn-ghost-dark py-1 px-2 mx-1 shadow-none"
                onClick={(e) => window.open(this.state.filePath)}>
                <i className="fa fa-download fa-lg" />
              </Button>
            </FormValueColumn>
          </FormRow>
        </XwjAnalysisPoolIAO_PanelBody>
      </XwjAnalysisPoolIAO_Panel>
    );
  }

  changeHandler = index => {
    let { verifyResult, filePath } = this.state.validations[index];
    this.setState({ verifyResult, filePath });
  }
}

export default withTranslation()(withNotify(Product_DataValidationResult));
