import React from "react";
import {
  Col, 
  FormGroup, 
} from "reactstrap";
import {withTranslation} from "react-i18next";
import {BlockLabel, BoldLabel, FormPropertyColumn, FormRow, FormValueColumn} from "../Layout";

class ProductInformation extends React.PureComponent{

  render() {
    const { t } = this.props;

    return (
      <React.Fragment>
        <FormRow>
          <FormPropertyColumn md={3}>
            <BoldLabel>{t('common.client')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn md={2}>
            <BlockLabel>{this.props.product.customer}</BlockLabel>
          </FormValueColumn>
          <FormPropertyColumn md={3}>
            <BoldLabel>{t('product.collect')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn>
            <BlockLabel>
              {this.props.product.isEnable === '1'? t('common.activate'): t('common.suspend')}
            </BlockLabel>
          </FormValueColumn>
        </FormRow>

        <FormRow>
          <FormPropertyColumn md={3}>
            <BoldLabel>{t('common.product')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn>
            <BlockLabel>
              {this.props.product.product}
            </BlockLabel>
          </FormValueColumn>
        </FormRow>

        <FormRow>
          <FormPropertyColumn md={3}>
            <BoldLabel>{t('product.data_collect_trigger_datetime')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn md={2}>
            <BlockLabel>
              {this.props.product.jobStartTime}
            </BlockLabel>
          </FormValueColumn>
          <FormPropertyColumn md={3}>
            <BoldLabel>{t('product.data_collect_stop_datetime')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn>
            <BlockLabel>
              {this.props.product.jobEndTime}
            </BlockLabel>
          </FormValueColumn>
        </FormRow>
      </React.Fragment>
    );
  }

}

export default withTranslation()(ProductInformation);
