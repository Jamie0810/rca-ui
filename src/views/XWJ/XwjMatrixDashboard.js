import React from "react";
import withLoading from "../../utils/hoc/withLoading";
import {getMatrix} from "../../action/analysis-pool-action";
import {Card, Col, FormGroup, Input, Label, Row} from "reactstrap";
import CardBody from "reactstrap/es/CardBody";
import CardHeader from "reactstrap/es/CardHeader";
import {withTranslation} from "react-i18next";
import {MATRIX_DATA_SCALE} from "../../utils/xwj-util";
import {find} from 'lodash';
import {BlockLabel, BoldLabel, FormPropertyColumn, FormRow, FormValueColumn, PlainColumn, PlainLabel} from "../Layout";

class XwjMatrixDashboard extends React.PureComponent {
  state = {
    matrix: null
  };

  id = this.props.match.params.id;

  componentDidMount() {
    this.props.toggleLoading(true);
    getMatrix(this.id).then(matrix => {
      this.setState({ matrix }, this.props.toggleLoading);
    });
  };

  render() {
    if (!this.state.matrix) {
      return null;
    }

    const { t } = this.props;
    let {name, description, testTimeStart, testTimeEnd, matrixType,
      insideND, overallND, reportTime, filePath, settingJson} =
      this.state.matrix;
    let settings = JSON.parse(settingJson);
    let scale = t(find(MATRIX_DATA_SCALE, {key: settings.timeRange}).label);

    return (
      <div className="container-fluid bg-white">
        <Card className="border-0">
          <CardHeader className="bg-white text-center border-0">
            <div className="h1">{name}</div>
          </CardHeader>
          <CardBody>
            <FormRow>
              <FormPropertyColumn md={2}>
                <BoldLabel>{t('analysis_set.matrix.report_datetime')}</BoldLabel>
              </FormPropertyColumn>
              <FormValueColumn md={9}>
                <BlockLabel>{reportTime}</BlockLabel>
              </FormValueColumn>
            </FormRow>

            {/*<FormGroup row>*/}
            {/*  <Col md={2} className="text-right my-auto">*/}
            {/*    <span><strong>矩陣名稱</strong></span>*/}
            {/*  </Col>*/}
            {/*  <Col md={9} className="my-auto border-left">*/}
            {/*    <span>{name}</span>*/}
            {/*  </Col>*/}
            {/*</FormGroup>*/}

            <FormRow>
              <FormPropertyColumn md={2}>
                <BoldLabel>{t('common.description')}</BoldLabel>
              </FormPropertyColumn>
              <FormValueColumn md={9}>
                <BlockLabel>{description || t('common.none')}</BlockLabel>
              </FormValueColumn>
            </FormRow>

            <FormRow>
              <FormPropertyColumn md={2}>
                <BoldLabel>{t('analysis_set.matrix.test_datetime')}</BoldLabel>
              </FormPropertyColumn>
              <FormValueColumn md={9}>
                <BlockLabel>{testTimeStart} ～ {testTimeEnd}</BlockLabel>
              </FormValueColumn>
            </FormRow>

            <FormRow>
              <FormPropertyColumn md={2}>
                <BoldLabel>{t('defect.test_item')}</BoldLabel>
              </FormPropertyColumn>
              <FormValueColumn md={5}>
                {settings.testItem.map((testItem, index) => (
                  <div className="border p-2 mb-2" key={index}>
                    <Row>
                      <PlainColumn>
                        <PlainLabel>{testItem.item}</PlainLabel>
                      </PlainColumn>
                    </Row>
                    <Row>
                      <FormPropertyColumn md={2}>{t('common.range_upper_bound')}</FormPropertyColumn>
                      <FormValueColumn md={2}>
                        <span>{testItem.testUpper || t('common.undefined')}</span>
                      </FormValueColumn>
                      <FormPropertyColumn md={2}>{t('common.range_lower_bound')}</FormPropertyColumn>
                      <FormValueColumn md={2}>
                        <span>{testItem.testLower || t('common.undefined')}</span>
                      </FormValueColumn>
                    </Row>
                  </div>
                ))}
              </FormValueColumn>
            </FormRow>

            <FormRow>
              <FormPropertyColumn md={2}>
                <BoldLabel>{t('analysis_set.plot.data_time_scale')}</BoldLabel>
              </FormPropertyColumn>
              <FormValueColumn md={9}>
                <FormGroup>
                  <PlainLabel>{t('analysis_set.matrix.render_by', { scale })}</PlainLabel>
                </FormGroup>

                {/*<Label className="form-check">*/}
                {/*  <Input type="checkbox" className="form-check-input" disabled={true} defaultChecked={insideND}/>*/}
                {/*  {t('analysis_set.matrix.render_normal_distribution_by_group')}*/}
                {/*</Label>*/}

                {/*<Label className="form-check">*/}
                {/*  <Input type="checkbox" className="form-check-input" disabled={true} defaultChecked={overallND}/>*/}
                {/*  {t('analysis_set.matrix.render_normal_distribution_by_total')}*/}
                {/*</Label>*/}
              </FormValueColumn>
            </FormRow>
          </CardBody>
        </Card>
        <div className="pb-5">
          {filePath.map((path, index) => (<img key={index} className="mx-auto d-block" src={path}/>))}
        </div>
      </div>
    );
  };
}

export default withTranslation()(withLoading(XwjMatrixDashboard));
