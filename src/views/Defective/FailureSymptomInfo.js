import React, {PureComponent} from 'react';
import {Button, CardBody, CardHeader, Col, Collapse, FormGroup, Tooltip} from 'reactstrap';
import {withTranslation} from "react-i18next";
import {BlockLabel, BoldLabel, FormPropertyColumn, FormRow, FormValueColumn} from "../Layout";

class FailureSymptomInfo extends PureComponent {
  state = {
    // collapse: false,
    infoTipOpen: false,
    // isExpanded: true,
  };

  // componentDidUpdate (prevProps, prevState) {
  //   if (prevProps.collapse !== this.props.collapse) {
  //     this.setState({
  //       collapse: this.props.collapse
  //     });
  //   }
  // }

  render () {
    const { t } = this.props;
    const failureItem = this.props.failureSymptomInfo;
    return (
      <Collapse isOpen={!this.props.collapse}>
        <CardHeader className="border-top px-4">
          {t('defect.list_by_risk_factor')}
          <span id="fs_info_tip">
            <i className="fa fa-info-circle" />
          </span>
          <Tooltip
            placement="right"
            isOpen={this.state.infoTipOpen}
            autohide={false}
            target="fs_info_tip"
            toggle={this.infoTipToggle}>
            <div className="text-left">
              <div>{t('defect.tip_by_risk_factor.part1')}</div>
              <div>{t('defect.tip_by_risk_factor.part2')}</div>
              <div>{t('defect.tip_by_risk_factor.part3')}</div>
              <div>{t('defect.tip_by_risk_factor.part4')}</div>
              <div>{t('defect.tip_by_risk_factor.part5')}</div>
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
            <FormValueColumn>
              <BlockLabel>{failureItem.testStation}</BlockLabel>
            </FormValueColumn>
            <FormPropertyColumn md={2}>
              <BoldLabel>{t('defect.hours_of_abnormal')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn>
              <BlockLabel>{failureItem.failureContHour}</BlockLabel>
            </FormValueColumn>
          </FormRow>

          <FormRow>
            <FormPropertyColumn md={2}>
              <BoldLabel>{t('defect.fail_rate')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn>
              <BlockLabel>{failureItem.failRate}%</BlockLabel>
            </FormValueColumn>
            <FormPropertyColumn md={2}>
              <BoldLabel>{t('defect.quantity_of_failure')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn>
              <BlockLabel>{failureItem.defectQty}</BlockLabel>
            </FormValueColumn>
          </FormRow>
          {this.props.children}
        </CardBody>
      </Collapse>
    );
  };

  infoTipToggle = () => {
    this.setState({ infoTipOpen: !this.state.infoTipOpen });
  };

  // toggle = () => {
  //   this.setState({ collapse: !this.state.collapse });
  // };

  // collapseEntered = () => {
  //   this.setState({isExpanded: true});
  // };
  //
  // collapseExited = () => {
  //   this.setState({isExpanded: false});
  // };
}

export default withTranslation()(FailureSymptomInfo);
