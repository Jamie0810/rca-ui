import React from "react";
import {Col, FormGroup, Input, Label} from "reactstrap";
import {isEmpty, values} from "lodash";
import memoize from "memoize-one";
import {withTranslation} from "react-i18next";
import {BoldLabel, FormPropertyColumn, FormRow, FormValueColumn} from "../Layout";

class XwjAnalysisPoolIAO_PlotConfigNormalDistribution extends React.PureComponent {
  state = {
    xAxisFieldInvalid: false,
  };

  componentDidMount() {
    let {xField} = this.props;
    xField && (this.xAxisField.value = xField);
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

        <FormRow>
          <FormPropertyColumn md={2}>
            <BoldLabel>{t('analysis_set.plot.observe_target')}</BoldLabel>
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
            <BoldLabel>{t('analysis_set.plot.observe_label')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn md={3}>
            <Input
              type="text" bsSize="sm"
              defaultValue={this.props.xTitle}
              innerRef={ref => this.xTitle = ref} />
          </FormValueColumn>
        </FormRow>
      </React.Fragment>
    );
  }

  getConfig = () => {
    let invalid = {
      xAxisFieldInvalid: isEmpty(this.xAxisField.value)
    };
    this.setState(invalid);

    if (values(invalid).reduce((isInvalid, fieldInvalid) => (isInvalid || fieldInvalid), false)) {
      return null;
    }

    return {
      caption: this.caption.value,
      xField: this.xAxisField.value,
      xTitle: this.xTitle.value,
      // xStart: this.xStart.value,
      // xEnd: this.xEnd.value,
    };
  };
}

export default withTranslation(undefined, { withRef: true })(XwjAnalysisPoolIAO_PlotConfigNormalDistribution);
