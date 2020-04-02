import React, {Component, PureComponent} from 'react';
import {Button, Card, CardBody, CardHeader, Col, FormGroup, Tooltip} from 'reactstrap';
import {withTranslation} from "react-i18next";
import {BlockLabel, BoldLabel, FormPropertyColumn, FormRow, FormValueColumn} from "../Layout";

class RiskFactorInfo extends PureComponent {
  state = { infoTipOpen: false };

  render () {
    const { t } = this.props;
    const failureItem = this.props.failureSymptomInfo;
    const riskFactorInfo = this.props.riskFactorInfo;
    return (
      <React.Fragment>
        <CardHeader className="border-top px-4">
          {t('defect.list_by_risk_source')}
          <span id="rf_info_tip"><i className="fa fa-info-circle" /></span>
          <Tooltip
            placement="right"
            isOpen={this.state.infoTipOpen}
            autohide={false}
            target="rf_info_tip"
            toggle={this.infoTipToggle}>
            <div className="text-left">
              <div>{t('defect.tip_by_risk_source.part1')}</div>
              <div>{t('defect.tip_by_risk_source.part2')}</div>
              <div>{t('defect.tip_by_risk_source.part3')}</div>
              <div>{t('defect.tip_by_risk_source.part4')}</div>
              <div>{t('defect.tip_by_risk_source.part5')}</div>
            </div>
          </Tooltip>
          <div className="card-header-actions">
            <Button
              color="link"
              className="card-header-action"
              onClick={this.props.close}>
              <i className="fa fa-reply fa-rotate-90 fa-lg" />
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <FormRow>
            <FormPropertyColumn md={2}>
              <BoldLabel>{t('defect.fail_symptom')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn>
              <BlockLabel>{failureItem.failureSymptom_display}</BlockLabel>
            </FormValueColumn>
          </FormRow>

          <FormRow>
            <FormPropertyColumn md={2}>
              <BoldLabel>{t('defect.test_station')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn md={4}>
              <BlockLabel>{failureItem.testStation}</BlockLabel>
            </FormValueColumn>
            <FormPropertyColumn md={2}>
              <BoldLabel>{t('defect.hours_of_abnormal')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn md={4}>
              <BlockLabel>{failureItem.failureContHour}</BlockLabel>
            </FormValueColumn>
          </FormRow>

          <FormRow>
            <FormPropertyColumn md={2}>
              <BoldLabel>{t('defect.fail_rate')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn md={4}>
              <BlockLabel>{failureItem.failRate}%</BlockLabel>
            </FormValueColumn>
            <FormPropertyColumn md={2}>
              <BoldLabel>{t('defect.quantity_of_failure')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn md={4}>
              <BlockLabel>{failureItem.defectQty}</BlockLabel>
            </FormValueColumn>
          </FormRow>

          <FormRow>
            <FormPropertyColumn md={2}>
              <BoldLabel>{t('defect.risk')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn md={4}>
              <BlockLabel>{riskFactorInfo.riskName_display}</BlockLabel>
            </FormValueColumn>
            <FormPropertyColumn md={2}>
              <BoldLabel>{t('common.category')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn md={4}>
              <BlockLabel>{t(riskFactorInfo.riskCategory)}</BlockLabel>
            </FormValueColumn>
          </FormRow>
          {this.props.children}
        </CardBody>
      </React.Fragment>
    );
  };

  infoTipToggle = () => {
    this.setState({ infoTipOpen: !this.state.infoTipOpen });
  };
}

export default withTranslation()(RiskFactorInfo);
