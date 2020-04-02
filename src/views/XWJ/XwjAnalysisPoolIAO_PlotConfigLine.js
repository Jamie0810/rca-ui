import React from "react";
import {Col, FormGroup, Input, Label} from "reactstrap";
import {isEmpty, values} from "lodash";
import memoize from "memoize-one";
import {withTranslation} from "react-i18next";
import {BoldLabel, FormPropertyColumn, FormRow, FormValueColumn} from "../Layout";

class XwjAnalysisPoolIAO_PlotConfigLine extends React.PureComponent {
  state = {
    yAxisFieldInvalid: false,
  };

  componentDidMount() {
    let {yField, groupField, yObserve} = this.props;
    yField && (this.yAxisField.value = yField);
    yObserve && (this.yObserved.value = yObserve);
    groupField && (this.timeGroupBy.value = groupField);
  }

  groupingFields = memoize(fieldsByDatatype => {
    return {
      numeric: (fieldsByDatatype['int'] || []).concat(fieldsByDatatype['float'] || []),
      text: fieldsByDatatype['string'] || []
    };
  });

  render() {
    const { t } = this.props;
    let fieldGroups = this.groupingFields(this.props.fieldsByDatatype);
    let numericFields = fieldGroups.numeric;
    let textFields = fieldGroups.text;

    return (
      <React.Fragment>
        <FormRow>
          <FormPropertyColumn md={2}>
            <BoldLabel>{t('common.caption')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn>
            <Input
              type="text" bsSize="sm"
              defaultValue={this.props.caption}
              innerRef={ref => this.caption = ref} />
          </FormValueColumn>
        </FormRow>

        {/* y-axis setting */}
        <FormRow>
          <FormPropertyColumn md={2}>
            <BoldLabel>{t('analysis_set.plot.y_axis')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn>
            <Input
              type="select" bsSize="sm"
              invalid={this.state.yAxisFieldInvalid}
              innerRef={ref => this.yAxisField = ref}
            >
              {/*<option value="">請選擇</option>*/}
              {numericFields.map(item => {
                return (<option key={item.name} value={item.name}>{item.name}</option>);
              })}
            </Input>
          </FormValueColumn>
        </FormRow>

        <FormRow>
          <FormPropertyColumn md={2}>
            <BoldLabel>{t('analysis_set.plot.y_axis_label')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn md={3}>
            <Input
              type="text" bsSize="sm"
              defaultValue={this.props.yTitle}
              innerRef={ref => this.yTitle = ref} />
          </FormValueColumn>
        </FormRow>

        <FormRow>
          <FormPropertyColumn md={2}>
            <BoldLabel>{t('analysis_set.plot.y_observe')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn>
            <Input
              type="select" bsSize="sm"
              innerRef={ref => this.yObserved = ref}
            >
              <option value={'failureRate'}>不良率</option>
            </Input>
          </FormValueColumn>
        </FormRow>

        {/* x-axis setting */}
        <FormRow>
          <FormPropertyColumn md={2}>
            <BoldLabel>{t('analysis_set.plot.data_time_scale')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn>
            <Input
              type="select" bsSize="sm"
              innerRef={ref => this.timeGroupBy = ref}
            >
              <option value="byDay">{t('analysis_set.plot.by_assemble_date')}</option>
              <option value="byMonth">{t('analysis_set.plot.by_assemble_month')}</option>
            </Input>
          </FormValueColumn>
        </FormRow>

        {/*<FormGroup row>*/}
        {/*  <Col xs="2" className="my-auto">*/}
        {/*    <Label size="sm" className="float-right my-auto font-weight-bold">分群標籤</Label>*/}
        {/*  </Col>*/}
        {/*  <Col xs="3" className="border-left my-auto">*/}
        {/*    <Input*/}
        {/*      type="text" bsSize="sm"*/}
        {/*      defaultValue={this.props.groupFieldTag}*/}
        {/*      innerRef={ref => this.groupingFieldLabel = ref} />*/}
        {/*  </Col>*/}
        {/*</FormGroup>*/}
      </React.Fragment>
    );
  }

  getConfig = () => {
    let invalid = {
      yAxisFieldInvalid: isEmpty(this.yAxisField.value),
    };
    this.setState(invalid);

    if (values(invalid).reduce((isInvalid, fieldInvalid) => (isInvalid || fieldInvalid), false)) {
      return null;
    }

    return {
      caption: this.caption.value,
      yField: this.yAxisField.value,
      yTitle: this.yTitle.value,
      yObserve: this.yObserved.value,
      groupField: this.timeGroupBy.value,
      // groupFieldTag: this.groupingFieldLabel.value
    };
  };
}

export default withTranslation(undefined, { withRef: true })(XwjAnalysisPoolIAO_PlotConfigLine);
