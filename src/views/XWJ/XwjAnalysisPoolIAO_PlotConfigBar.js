import React from "react";
import {Input} from "reactstrap";
import {isEmpty, values} from "lodash";
import memoize from "memoize-one";
import {withTranslation} from "react-i18next";
import {BoldLabel, FormPropertyColumn, FormRow, FormValueColumn} from "../Layout";

class XwjAnalysisPoolIAO_PlotConfigBar extends React.PureComponent {
  state = {
    yAxisFieldInvalid: false,
    groupingPrimaryFieldInvalid: false,
    // groupingSecondaryFieldInvalid: false
  };

  componentDidMount() {
    let {yField, groupField, groupField2} = this.props;
    yField && (this.yAxisField.value = yField);
    groupField && (this.groupingPrimaryField.value = groupField);
    groupField2 && (this.groupingSecondaryField.value = groupField2);
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
            <BoldLabel>{t('analysis_set.plot.category_1')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn>
            <Input
              type="select" bsSize="sm"
              invalid={this.state.groupingPrimaryFieldInvalid}
              innerRef={ref => this.groupingPrimaryField = ref}
            >
              {textFields.map(item => {
                return (<option key={item.name} value={item.name}>{item.name}</option>);
              })}
            </Input>
          </FormValueColumn>
        </FormRow>

        <FormRow>
          <FormPropertyColumn md={2}>
            <BoldLabel>{t('analysis_set.plot.category_1_label')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn>
            <Input
              type="text" bsSize="sm"
              defaultValue={this.props.groupFieldTag}
              innerRef={ref => this.groupingPrimaryFieldLabel = ref} />
          </FormValueColumn>
        </FormRow>

        <FormRow>
          <FormPropertyColumn md={2}>
            <BoldLabel>{t('analysis_set.plot.category_2')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn>
            <Input
              type="select" bsSize="sm"
              innerRef={ref => this.groupingSecondaryField = ref}
            >
              <option value="">請選擇</option>
              {textFields.map(item => {
                return (<option key={item.name} value={item.name}>{item.name}</option>);
              })}
            </Input>
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
          <FormValueColumn>
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
              <option value={'failureRate'}>{t('defect.fail_rate')}</option>
            </Input>
          </FormValueColumn>
        </FormRow>
      </React.Fragment>
    );
  }

  getConfig = () => {
    let invalid = {
      groupingPrimaryFieldInvalid: isEmpty(this.groupingPrimaryField.value),
      yAxisFieldInvalid: isEmpty(this.yAxisField.value),
    };
    this.setState(invalid);

    if (values(invalid).reduce((isInvalid, fieldInvalid) => (isInvalid || fieldInvalid), false)) {
      return null;
    }

    return {
      caption: this.caption.value,
      groupField: this.groupingPrimaryField.value,
      groupFieldTag: this.groupingPrimaryFieldLabel.value,
      groupField2: this.groupingSecondaryField.value,
      yField: this.yAxisField.value,
      yTitle: this.yTitle.value,
      yObserved: this.yObserved.value
    };
  };
}

export default withTranslation(undefined, { withRef: true })(XwjAnalysisPoolIAO_PlotConfigBar);
