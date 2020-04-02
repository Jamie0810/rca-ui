import React from "react";
import {Col, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label} from "reactstrap";
import {isEmpty, values} from "lodash";
import memoize from "memoize-one";
import {withTranslation} from "react-i18next";
import {BoldLabel, FormPropertyColumn, FormRow, FormValueColumn} from "../Layout";

class XwjAnalysisPoolIAO_PlotConfigBox extends React.PureComponent {
  state = {
    // xAxisField: null,
    // xAxisFieldInvalid: false,
    // yAxisField: null,
    yAxisFieldInvalid: false,
    // groupingField: null,
    groupingFieldInvalid: false
  };

  componentDidMount() {
    let {yField, groupField} = this.props;
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

        <FormRow>
          <FormPropertyColumn md={2}>
            <BoldLabel>{t('analysis_set.plot.clustering')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn>
            <Input
              type="select" bsSize="sm"
              invalid={this.state.groupingFieldInvalid}
              innerRef={ref => this.groupingField = ref}
            >
              {textFields.map(item => {
                return (<option key={item.name} value={item.name}>{item.name}</option>);
              })}
            </Input>
          </FormValueColumn>
        </FormRow>

        <FormRow>
          <FormPropertyColumn md={2}>
            <BoldLabel>{t('analysis_set.plot.clustering_label')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn>
            <Input
              type="text" bsSize="sm"
              defaultValue={this.props.groupFieldTag}
              innerRef={ref => this.groupingFieldLabel = ref} />
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
            <BoldLabel>{t('analysis_set.plot.y_config_range')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn md={4}>
            <InputGroup>
              <Input
                type="text" bsSize="sm"
                defaultValue={this.props.yStart}
                innerRef={ref => this.yStart = ref} />
              <InputGroupAddon addonType="append">
                <InputGroupText className="border-0"><i className="fa fa-chevron-right" /></InputGroupText>
              </InputGroupAddon>
              <Input
                type="text" bsSize="sm"
                defaultValue={this.props.yEnd}
                innerRef={ref => this.yEnd = ref} />
            </InputGroup>
          </FormValueColumn>
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
      </React.Fragment>
    );
  }

  getConfig = () => {
    let invalid = {
      yAxisFieldInvalid: isEmpty(this.yAxisField.value),
      groupingFieldInvalid: isEmpty(this.groupingField.value),
    };
    this.setState(invalid);

    if (values(invalid).reduce((isInvalid, fieldInvalid) => (isInvalid || fieldInvalid), false)) {
      return null;
    }

    return {
      caption: this.caption.value,
      yField: this.yAxisField.value,
      yTitle: this.yTitle.value,
      yStart: this.yStart.value,
      yEnd: this.yEnd.value,
      groupField: this.groupingField.value,
      groupFieldTag: this.groupingFieldLabel.value
    };
  };
}

export default withTranslation(undefined, { withRef: true })(XwjAnalysisPoolIAO_PlotConfigBox);
