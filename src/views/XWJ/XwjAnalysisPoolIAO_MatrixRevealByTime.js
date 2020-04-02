import React from "react";
import {
  Col, Row
} from "reactstrap";
import withLoading from "../../utils/hoc/withLoading";
import {getMatrix} from "../../action/analysis-pool-action";
import {withTranslation} from "react-i18next";
import {MATRIX_DATA_SCALE} from '../../utils/xwj-util'
import {find} from 'lodash';
import {BlockLabel, BoldLabel, FormPropertyColumn, FormRow, FormValueColumn, PlainColumn, PlainLabel} from "../Layout";

class XwjAnalysisPoolIAO_MatrixConfigByTime extends React.PureComponent {
  state = {
    matrix: null
  };

  componentDidMount() {
    this.props.toggleLoading(true);
    getMatrix(this.props.id).then(matrix => {
      this.setState({ matrix }, this.props.toggleLoading);
    });
  };

  render() {
    if (!this.state.matrix) {
      return null;
    }

    const { t } = this.props;
    let {name, description, testTimeStart, testTimeEnd, matrixType, insideND, overallND, settingJson} =
      this.state.matrix;
    let settings = JSON.parse(settingJson);

    return (
      <React.Fragment>

        <FormRow>
          <FormPropertyColumn md={3}>
            <BoldLabel>{t('common.name')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn>
            <BlockLabel>{name}</BlockLabel>
          </FormValueColumn>
        </FormRow>

        <FormRow>
          <FormPropertyColumn md={3}>
            <BoldLabel>{t('common.description')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn md={3}>
            <BlockLabel>{description || t('common.none')}</BlockLabel>
          </FormValueColumn>
        </FormRow>

        <FormRow>
          <FormPropertyColumn md={3}>
            <BoldLabel>{t('analysis_set.matrix.test_datetime')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn>
            <BlockLabel>{testTimeStart} ～ {testTimeEnd}</BlockLabel>
          </FormValueColumn>
        </FormRow>

        <FormRow>
          <FormPropertyColumn md={3}>
            <BoldLabel>{t('defect.test_item')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn md={8}>
            {settings.testItem.map((testItem, index) => (
              <div className="border px-3 py-2 mb-2" key={index}>
                <Row>
                  <PlainColumn>
                    <BlockLabel>{testItem.item}</BlockLabel>
                  </PlainColumn>
                </Row>
                <Row>
                  <FormPropertyColumn md={3}>
                    <BoldLabel>{t('common.range_upper_bound')}</BoldLabel>
                  </FormPropertyColumn>
                  <FormValueColumn md={2}>
                    <BlockLabel>{testItem.testUpper || t('common.undefined')}</BlockLabel>
                  </FormValueColumn>
                  <FormPropertyColumn md={3}>
                    <BoldLabel>{t('common.range_lower_bound')}</BoldLabel>
                  </FormPropertyColumn>
                  <FormValueColumn md={2}>
                    <BlockLabel>{testItem.testLower || t('common.undefined')}</BlockLabel>
                  </FormValueColumn>
                </Row>
              </div>
            ))}
          </FormValueColumn>
        </FormRow>

        <FormRow>
          <FormPropertyColumn md={3}>
            <BoldLabel>{t('analysis_set.plot.data_time_scale')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn>
             <Row>
              <PlainColumn>
                <BlockLabel>{t(find(MATRIX_DATA_SCALE, {key: settings.timeRange}).label)}</BlockLabel>
              </PlainColumn>
             </Row>
            <Row>
              <PlainColumn>
                <input type="checkbox" disabled={true} className="mr-1" defaultChecked={insideND}/>
                <PlainLabel>{t('analysis_set.matrix.render_normal_distribution_by_group')}</PlainLabel>
              </PlainColumn>
            </Row>
            <Row>
              <PlainColumn>
                <input type="checkbox" disabled={true} className="mr-1" defaultChecked={overallND}/>
                <PlainLabel>{t('analysis_set.matrix.render_normal_distribution_by_total')}</PlainLabel>
              </PlainColumn>
            </Row>
          </FormValueColumn>
        </FormRow>

      </React.Fragment>
    );
  };
}

export default withTranslation()(withLoading(XwjAnalysisPoolIAO_MatrixConfigByTime));
