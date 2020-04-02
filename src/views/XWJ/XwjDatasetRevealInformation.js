import React from 'react';
import { Col, FormGroup } from 'reactstrap';
import {withTranslation} from "react-i18next";
import {BlockLabel, BoldLabel, FormPropertyColumn, FormRow, FormValueColumn} from "../Layout";

class XwjDatasetRevealInformation extends React.Component {

  render () {
    const { t } = this.props;

    return (
      <React.Fragment>
        <FormRow>
          <FormPropertyColumn md={2}>
            <BoldLabel>{t('common.product')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn>
            <BlockLabel>{this.props.product}</BlockLabel>
          </FormValueColumn>
          <FormPropertyColumn md={2}>
            <BoldLabel>{t('common.create_time')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn>
            <BlockLabel>{this.props.createTime}</BlockLabel>
          </FormValueColumn>
        </FormRow>
          <FormRow>
            <FormPropertyColumn md={2}>
              <BoldLabel>{t('common.name')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn>
              <BlockLabel>{`${this.props.name} (#${this.props.id})`}</BlockLabel>
            </FormValueColumn>
            <FormPropertyColumn md={2}>
              <BoldLabel>{t('common.modify_time')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn>
              <BlockLabel>{this.props.modifyTime}</BlockLabel>
            </FormValueColumn>
          </FormRow>
          <FormRow>
            <FormPropertyColumn md={2}>
              <BoldLabel>{t('common.description')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn>
              <BlockLabel>{this.props.remark}</BlockLabel>
            </FormValueColumn>
            <FormPropertyColumn md={2}>
              <BoldLabel>{t('dataset.data_pool.last_update_datetime')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn>
              <BlockLabel>{this.props.btLastTime}</BlockLabel>
            </FormValueColumn>
          </FormRow>
          <FormRow>
            <FormPropertyColumn md={2}>
              <BoldLabel>{t('common.creator')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn>
              <BlockLabel>{this.props.createUser}</BlockLabel>
            </FormValueColumn>
            <FormPropertyColumn md={2}>
              <BoldLabel>{t('dataset.data_pool.next_update_datetime')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn>
              <BlockLabel>{this.props.btNextTime}</BlockLabel>
            </FormValueColumn>
          </FormRow>
      </React.Fragment>
    );
  }
}

export default withTranslation()(XwjDatasetRevealInformation);
