import React from "react";
import {Col, FormGroup, Input, Label} from "reactstrap";
import {isEmpty, values} from "lodash";
import memoize from "memoize-one";
import {withTranslation} from "react-i18next";
import {BoldLabel, FormPropertyColumn, FormRow, FormValueColumn} from "../Layout";

class XwjAnalysisPoolIAO_PlotConfigScatter extends React.PureComponent {
  state = {
    // xAxisField: null,
    xAxisFieldInvalid: false,
    // yAxisField: null,
    yAxisFieldInvalid: false,
    // groupingField: null,
    // groupingFieldInvalid: false
  };

  componentDidMount() {
    let {xField, yField, groupField} = this.props;
    xField && (this.xAxisField.value = xField);
    yField && (this.yAxisField.value = yField);
    groupField && (this.groupingField.value = groupField);
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

        {/* x-axis setting */}
        <FormRow>
          <FormPropertyColumn md={2}>
            <BoldLabel>{t('analysis_set.plot.x_axis')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn>
            <Input
              type="select" bsSize="sm"
              invalid={this.state.xAxisFieldInvalid}
              innerRef={ref => this.xAxisField = ref}
            >
              {numericFields.map(item => {
                return (<option key={item.name} value={item.name}>{item.name}</option>);
              })}
            </Input>
          </FormValueColumn>
        </FormRow>

        <FormRow>
          <FormPropertyColumn md={2}>
            <BoldLabel>{t('analysis_set.plot.x_axis_label')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn md={3}>
            <Input
              type="text" bsSize="sm"
              defaultValue={this.props.xTitle}
              innerRef={ref => this.xTitle = ref} />
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
              // onChange={e => this.setState({
              //   yAxisField: find(numericFields, {name: e.target.value}) || null
              // })}
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
            <BoldLabel>{t('common.category')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn>
            <Input
              type="select" bsSize="sm"
              // invalid={this.state.groupingFieldInvalid}
              innerRef={ref => this.groupingField = ref}
            >
              <option value={''}>{t('common.choose')}</option>
              {textFields.map(item => {
                return (<option key={item.name} value={item.name}>{item.name}</option>);
              })}
            </Input>
          </FormValueColumn>
        </FormRow>
      </React.Fragment>
    );
  }

  getConfig = () => {
    let invalid = {
      xAxisFieldInvalid: isEmpty(this.xAxisField.value),
      yAxisFieldInvalid: isEmpty(this.yAxisField.value),
      // groupingFieldInvalid: isEmpty(this.groupingField.value),
    };
    this.setState(invalid);

    if (values(invalid).reduce((isInvalid, fieldInvalid) => (isInvalid || fieldInvalid), false)) {
      return null;
    }

    return {
      caption: this.caption.value,
      xField: this.xAxisField.value,
      yField: this.yAxisField.value,
      xTitle: this.xTitle.value,
      yTitle: this.yTitle.value,
      // xStart: this.xStart.value,
      // xEnd: this.xEnd.value,
      // yStart: this.yStart.value,
      // yEnd: this.yEnd.value,
      groupField: this.groupingField.value
    };
  };
}

export default withTranslation(undefined, { withRef: true })(XwjAnalysisPoolIAO_PlotConfigScatter);
