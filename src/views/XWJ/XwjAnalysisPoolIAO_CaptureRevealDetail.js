import React from "react";
import {
  Card,
  CardHeader,
  CardBody
} from "reactstrap";
import { DATA_DISTINCT_OPTIONS, FieldRestrictionExpressionNode } from '../../utils/xwj-util';
import {withTranslation} from "react-i18next";
import {FormValueColumn, FormPropertyColumn, FormRow, BlockLabel, BoldLabel} from "../Layout";

class XwjAnalysisPoolIAO_CaptureRevealDetail extends React.PureComponent {
  render() {
    const { t } = this.props;
    let {
      captureInfoForEdit: {id, noteTitle, noteText, createUser, updateTime},
      chartSetting, chartData
    } = this.props;
    let dataCondition = JSON.parse(this.props.captureInfoForEdit.caseSettingJson).condition[0].value;
    let PlotChart = this.props.plotContainer.chart;
    let PlotChartInformation = this.props.plotContainer.information;
    const sizingProps = {
      lg: 2
    };

    return (
      <React.Fragment>
        <Card className="border-0">
          <CardHeader className="bg-white h5 pb-1">{t('analysis_set.capture.analysis')}</CardHeader>
          <CardBody>
            <FormRow>
              <FormPropertyColumn {...sizingProps}>
                <BoldLabel>{t('analysis_set.capture.serial')}</BoldLabel>
              </FormPropertyColumn>
              <FormValueColumn>
                <BlockLabel>{id}</BlockLabel>
              </FormValueColumn>
            </FormRow>

            <FormRow>
              <FormPropertyColumn {...sizingProps}>
                <BoldLabel>{t('common.caption')}</BoldLabel>
              </FormPropertyColumn>
              <FormValueColumn>
                <BlockLabel>{noteTitle}</BlockLabel>
              </FormValueColumn>
            </FormRow>

            <FormRow>
              <FormPropertyColumn {...sizingProps}>
                <BoldLabel>{t('common.content')}</BoldLabel>
              </FormPropertyColumn>
              <FormValueColumn>
                <BlockLabel>{noteText}</BlockLabel>
              </FormValueColumn>
            </FormRow>

            <FormRow>
              <FormPropertyColumn {...sizingProps}>
                <BoldLabel>{t('analysis_set.capture.creator')}</BoldLabel>
              </FormPropertyColumn>
              <FormValueColumn>
                <BlockLabel>{createUser}</BlockLabel>
              </FormValueColumn>
            </FormRow>

            <FormRow>
              <FormPropertyColumn {...sizingProps}>
                <BoldLabel>{t('analysis_set.capture.modify_datetime')}</BoldLabel>
              </FormPropertyColumn>
              <FormValueColumn>
                <BlockLabel>{updateTime}</BlockLabel>
              </FormValueColumn>
            </FormRow>
            <div className="border">
              <PlotChart setting={chartSetting} data={chartData}/>
            </div>
          </CardBody>

          <CardHeader className="bg-white h5 pb-1">{t('analysis_set.chart_information_caption')}</CardHeader>
          <CardBody>
            <PlotChartInformation {...sizingProps} chartSetting={chartSetting} chartData={chartData}/>
          </CardBody>

          <CardHeader className="bg-white h5 pb-1">{t('analysis_set.capture.data_information')}</CardHeader>
          <CardBody>
            <FormRow>
              <FormPropertyColumn {...sizingProps}>
                <BoldLabel>{t('analysis_set.data_source')}</BoldLabel>
              </FormPropertyColumn>
              <FormValueColumn>
                <BlockLabel>
                  {this.props.captureInfoForEdit.dataSetName}
                </BlockLabel>
              </FormValueColumn>
            </FormRow>

            <FormRow>
              <FormPropertyColumn {...sizingProps}>
                <BoldLabel>{t('analysis_set.target.data_election')}</BoldLabel>
              </FormPropertyColumn>
              <FormValueColumn>
                <BlockLabel>
                  {t(DATA_DISTINCT_OPTIONS[dataCondition])}
                </BlockLabel>
              </FormValueColumn>
            </FormRow>

            <FormRow>
              <FormPropertyColumn {...sizingProps}>
                <BoldLabel>{t('analysis_set.target.data_filter')}</BoldLabel>
              </FormPropertyColumn>
              <FormValueColumn>
                {JSON.parse(this.props.captureInfoForEdit.caseSettingJson).filter.map((filter, index) => (
                  <BlockLabel key={index}>
                    <FieldRestrictionExpressionNode {...filter}/>
                  </BlockLabel>
                  )
                )}
              </FormValueColumn>
            </FormRow>
          </CardBody>
        </Card>
      </React.Fragment>
    );
  }
}

export default withTranslation()(XwjAnalysisPoolIAO_CaptureRevealDetail);
