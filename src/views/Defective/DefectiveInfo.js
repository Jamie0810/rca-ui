import React, {PureComponent} from 'react';
import {Button, CardBody, CardHeader, Col, Collapse, FormGroup, Row, Tooltip} from 'reactstrap';
import {withTranslation} from "react-i18next";
import {BlockLabel, BoldLabel, FormPropertyColumn, FormRow, FormValueColumn} from "../Layout";

class DefectiveInfo extends PureComponent {
 state = {
   tipOpen: false,
 };

 componentDidUpdate (prevProps, prevState) {
   if (prevProps.collapse !== this.props.collapse) {
     this.setState({ collapse: this.props.collapse });
   }
 }

  render () {
    const { t } = this.props;
    const defectiveInfo = this.props.defectiveInfo;
    return (
      <React.Fragment>
        <CardHeader className="px-4">
          {t('defect.search_caption')}
          <div className="card-header-actions">
            <Button
              color="link"
              className="card-header-action"
              onClick={this.props.close}>
              <i className="fa fa-close fa-lg" />
            </Button>
          </div>
        </CardHeader>

        <CardBody>
          <FormRow>
            <FormPropertyColumn md={2}>
              <BoldLabel>{t('common.product')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn>
              <BlockLabel>{defectiveInfo.product}</BlockLabel>
            </FormValueColumn>
            <FormPropertyColumn md={2}>
              <BoldLabel>{t('common.location')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn>
              <BlockLabel>{defectiveInfo.factory}</BlockLabel>
            </FormValueColumn>
          </FormRow>

          <FormRow>
            <FormPropertyColumn md={2}>
              <BoldLabel>{t('defect.datetime_period_of_criteria')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn>
              <BlockLabel>{defectiveInfo.startTime} ~ {defectiveInfo.stopTime}
              <span id="data_date_tip"><i className="fa fa-info-circle" /></span>
              <Tooltip
                placement="right"
                isOpen={this.state.tipOpen}
                autohide={false}
                target="data_date_tip"
                toggle={this.tipToggle}>
                <div className="text-left">
                  <div>{t('defect.datetime_period_of_data')}：</div>
                  <div>{defectiveInfo.dataStartTime} ~ {defectiveInfo.dataEndTime}</div>
                </div>
              </Tooltip>
              </BlockLabel>
            </FormValueColumn>
            <FormPropertyColumn md={2}>
              <BoldLabel>{t('common.floor')}/{t('common.line')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn>
              <BlockLabel>{defectiveInfo.floor} / {defectiveInfo.line || t('common.all')}</BlockLabel>
            </FormValueColumn>
          </FormRow>

          <FormRow>
            <FormPropertyColumn md={2}>
              <BoldLabel>{t('defect.failure_in_total')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn>
              <BlockLabel>{defectiveInfo.totalFailureCount}</BlockLabel>
            </FormValueColumn>
          </FormRow>

        </CardBody>
        <Collapse isOpen={!this.props.collapse}>
          {this.props.children}
        </Collapse>
      </React.Fragment>
    );
  };

  tipToggle = () => {
    this.setState({ tipOpen: !this.state.tipOpen });
  };
}

export default withTranslation()(DefectiveInfo);
