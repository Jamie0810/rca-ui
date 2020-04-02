import React from "react";
import {map} from 'lodash';
import {withTranslation} from "react-i18next";
import {FormValueColumn, FormPropertyColumn, FormRow, BlockLabel, BoldLabel} from "../Layout";

class XwjAnalysisPoolIAO_InformationScatter extends React.PureComponent {
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
            <BlockLabel>{t('analysis_set.capture.x_axis_template', {data: chartSetting.xField})}</BlockLabel>
            <BlockLabel>
              {t('analysis_set.capture.x_focus_range_template', {
                lower: statistic.boundary.XtestLower,
                upper: statistic.boundary.XtestUpper
              })}
            </BlockLabel>
            <BlockLabel>
              {t('analysis_set.capture.x_config_range_template', {
                lower: chartSetting.xStart,
                upper: chartSetting.xEnd
              })}
            </BlockLabel>
            <BlockLabel>{t('analysis_set.capture.y_axis_template', {data: chartSetting.yField})}</BlockLabel>
            <BlockLabel>
              {t('analysis_set.capture.y_focus_range_template', {
                lower: statistic.boundary.YtestLower,
                upper: statistic.boundary.YtestUpper
              })}
            </BlockLabel>
            <BlockLabel>
              {t('analysis_set.capture.y_config_range_template', {
                lower: chartSetting.yStart,
                upper: chartSetting.yEnd
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
            <BlockLabel>{t('analysis_set.capture.records_in_category')}</BlockLabel>
            {map(chart_data, (data, group) => {
              return (
                <BlockLabel key={group}>
                  {t('analysis_set.capture.samples_in_records_template', {category: group, count: data.length})}
                </BlockLabel>
              );
            })}
          </FormValueColumn>
        </FormRow>

        <FormRow>
          <FormPropertyColumn {...sizingProps}>
            <BoldLabel>
              {t('analysis_set.capture.statistic')}
            </BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn>
            <BlockLabel>{t('analysis_set.capture.statistic_r_square_template', {value: statistic.Rsquare})}</BlockLabel>
          </FormValueColumn>
        </FormRow>
      </React.Fragment>
    );
  }
}

export default withTranslation()(XwjAnalysisPoolIAO_InformationScatter);
