import React from "react";
import {map} from 'lodash';
import {withTranslation} from "react-i18next";
import {FormValueColumn, FormPropertyColumn, FormRow, BlockLabel, BoldLabel} from "../Layout";

class XwjAnalysisPoolIAO_InformationBar extends React.PureComponent {
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
            <BlockLabel>{t('analysis_set.capture.y_axis_template', {data: chartSetting.yField})}</BlockLabel>
            <BlockLabel>
              {t('analysis_set.capture.y_config_range_template', {
                lower: chartSetting.yStart,
                upper: chartSetting.yEnd
              })}
            </BlockLabel>
            <BlockLabel>
              {t('analysis_set.capture.category_1_template', {
                tag: chartSetting.groupFieldTag,
                field: chartSetting.groupField
              })}
            </BlockLabel>
            <BlockLabel>
              {t('analysis_set.capture.category_2_template', {
                field: chartSetting.groupField2
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
            {map(statistic.groupSampleCount, (data, group) => {
              return (
                <BlockLabel key={group}>
                  {t('analysis_set.capture.samples_in_records_template', {category: group, count: data})}
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
            <BlockLabel>{t('common.none')}</BlockLabel>
          </FormValueColumn>
        </FormRow>
      </React.Fragment>
    );
  }
}

export default withTranslation()(XwjAnalysisPoolIAO_InformationBar);
