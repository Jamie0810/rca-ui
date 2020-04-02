import React from "react";
import {withTranslation} from "react-i18next";
import {FormValueColumn, FormPropertyColumn, FormRow, BlockLabel, BoldLabel} from "../Layout";

class XwjAnalysisPoolIAO_InformationLine extends React.PureComponent {
  geyObserve = (value) => {
    switch (value) {
      case 'failureRate':
        return this.props.t('defect.fail_rate');
      default:
        return value;
    }
  };

  render() {
    const {t, xs, sm, md = 3, lg, xl, chartSetting, chartData: {chart_data, statistic, updateTime}} = this.props;
    const sizingProps = {
      xs, sm, md, lg, xl
    };

    return (
      <React.Fragment>
        <FormRow>
          <FormPropertyColumn {...sizingProps}>
            <BoldLabel>
              {t('common.basic_information')}
            </BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn>
            <BlockLabel>{t('analysis_set.capture.modify_datetime_template', {time: updateTime})}</BlockLabel>
            <BlockLabel>
              {t('analysis_set.capture.data_datetime_template', {
                start_time: statistic.dataTimeStart,
                end_time: statistic.dataTimeEnd
              })}
            </BlockLabel>
          </FormValueColumn>
        </FormRow>

        <FormRow>
          <FormPropertyColumn {...sizingProps}>
            <BoldLabel>
              {t('analysis_set.capture.chart_configuration')}
            </BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn>
            <BlockLabel>
              {t('analysis_set.capture.observe_value_template', {
                value: this.geyObserve(chartSetting.yObserve)
              })}
            </BlockLabel>
          </FormValueColumn>
        </FormRow>

        <FormRow>
          <FormPropertyColumn {...sizingProps}>
            <BoldLabel>
              {t('analysis_set.capture.sample_information')}
            </BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn>
            <BlockLabel>
              {t('analysis_set.capture.total_sample_template', {
                count: statistic.sampleCount
              })}
            </BlockLabel>
          </FormValueColumn>
        </FormRow>

        <FormRow>
          <FormPropertyColumn {...sizingProps}>
            <BoldLabel>
              {t('analysis_set.capture.statistic')}
            </BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn>
            <BlockLabel>{t('common.none')}</BlockLabel>
          </FormValueColumn>
        </FormRow>
      </React.Fragment>
    );
  }
}

export default withTranslation()(XwjAnalysisPoolIAO_InformationLine);
