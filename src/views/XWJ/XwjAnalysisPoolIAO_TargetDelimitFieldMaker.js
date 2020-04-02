import React from "react";
import {Col, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label} from "reactstrap";
import withLoading from "../../utils/hoc/withLoading";
import {assign, isEmpty, values, some, find} from "lodash";
import {withTranslation} from "react-i18next";
import {BoldLabel, FormPropertyColumn, FormRow, FormValueColumn} from "../Layout";

class NumericFieldConfig extends React.PureComponent {
  state = {
    timesInvalid: false,
    precisionInvalid: false
  };

  render() {
    const { t } = this.props;

    return (
      <InputGroup size="sm">
        <InputGroupAddon addonType="prepend">
          <InputGroupText>{t('analysis_set.target.field_maker.numeric.part1')}</InputGroupText>
        </InputGroupAddon>
        <Input
          type="text"
          invalid={this.state.timesInvalid}
          innerRef={ref => this.times = ref} />
        <InputGroupAddon addonType="append">
          <InputGroupText className="border-right-0">
            {t('analysis_set.target.field_maker.numeric.part2')}
          </InputGroupText>
        </InputGroupAddon>
        <Input
          type="text"
          invalid={this.state.precisionInvalid}
          innerRef={ref => this.precision = ref} />
      </InputGroup>
    );
  };

  getConfig = () => {
    let invalid = {
      timesInvalid: isEmpty(this.times.value),
      precisionInvalid: isEmpty(this.precision.value)
    };
    this.setState(invalid);

    if (values(invalid).reduce((isInvalid, fieldInvalid) => (isInvalid || fieldInvalid), false)) {
      return null;
    }

    return {
      times: this.times.value,
      precision: this.precision.value,
    };
  };
}

class TextFieldConfig extends React.PureComponent {
  state = {
    startInvalid: false,
    lengthInvalid: false,
  };

  render() {
    const { t } = this.props;

    return (
      <InputGroup size="sm">
        <InputGroupAddon addonType="prepend">
          <InputGroupText>{t('analysis_set.target.field_maker.text.part1')}</InputGroupText>
        </InputGroupAddon>
        <Input
          type="text"
          invalid={this.state.startInvalid}
          innerRef={ref => this.start = ref} />
        <InputGroupAddon addonType="append">
          <InputGroupText className="border-right-0">
            {t('analysis_set.target.field_maker.text.part2')}
          </InputGroupText>
        </InputGroupAddon>
        <Input
          type="text"
          invalid={this.state.lengthInvalid}
          innerRef={ref => this.length = ref} />
        <InputGroupAddon addonType="append">
          <InputGroupText>{t('analysis_set.target.field_maker.text.part3')}</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    );
  }

  getConfig = () => {
    let invalid = {
      startInvalid: isEmpty(this.start.value),
      lengthInvalid: isEmpty(this.length.value)
    };
    this.setState(invalid);

    if (values(invalid).reduce((isInvalid, fieldInvalid) => (isInvalid || fieldInvalid), false)) {
      return null;
    }

    return {
      start: this.start.value,
      length: this.length.value,
    };
  };
}

const AVAILABLE_DATA_TYPES = ['string', 'int', 'float'];

class XwjAnalysisPoolIAO_TargetDelimitFieldMaker extends React.PureComponent {
  state = {
    datasetFields: this.props.datasetFields.filter(field => (AVAILABLE_DATA_TYPES.indexOf(field.dataType) > -1)),
    fieldSelected: null,
    nameInvalid: false,
    refFieldInvalid: false,
  };

  getFieldConfigComponent = (datatype) => {
    const trans = withTranslation(undefined, { withRef: true });
    switch (datatype) {
      case 'string':
        return trans(TextFieldConfig);
      case 'int':
      case 'float':
        return trans(NumericFieldConfig);
      case 'timestamp':
      default:
        return 'div';
    }
  };

  render() {
    const { t } = this.props;
    let datatype = this.state.fieldSelected? this.state.fieldSelected.dataType: null;
    let FieldConfigComponent = this.getFieldConfigComponent(datatype);

    return (
      <React.Fragment>
        <FormRow>
          <FormPropertyColumn md={3}>
            <BoldLabel>
              {t('analysis_set.target.field_maker.field_name')}
            </BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn md={8}>
            <Input
              type="text" bsSize="sm"
              invalid={this.state.nameInvalid}
              innerRef={ref => this.name = ref} />
          </FormValueColumn>
        </FormRow>

        <FormRow>
          <FormPropertyColumn md={3}>
            <BoldLabel>
              {t('analysis_set.target.field_maker.referenced_field_name')}
            </BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn md={8}>
            <Input
              type="select" bsSize="sm"
              invalid={this.state.refFieldInvalid}
              innerRef={ref => this.refField = ref}
              onChange={e => this.setState({
                fieldSelected: find(this.state.datasetFields, {name: e.target.value}) || null
              })}>
              <option value="">{t('common.choose')}</option>
              {this.state.datasetFields.map(field => (
                <option key={field.name} value={field.name}>{field.name}</option>
              ))}
            </Input>
          </FormValueColumn>
        </FormRow>

        <FormRow>
          <FormPropertyColumn md={3}>
            <BoldLabel>
              {t('analysis_set.target.field_maker.reference_rule')}
            </BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn md={8}>
            <FieldConfigComponent ref={ref => this.refConfig = ref}/>
          </FormValueColumn>
        </FormRow>
      </React.Fragment>
    );
  }

  getFieldConfig = () => {
    let config = this.refConfig.getConfig? this.refConfig.getConfig(): undefined;
    let newname = this.name.value;
    let invalid = {
      nameInvalid:
        isEmpty(newname) ||
        some(this.props.fieldMade, { newname }) ||
        some(this.props.fieldSelected, { name: newname }),
      refFieldInvalid: !this.state.fieldSelected
    };
    this.setState(invalid);

    if (values(invalid).reduce((isInvalid, fieldInvalid) => (isInvalid || fieldInvalid), false) || !config) {
      return null;
    }

    return assign({
      newname: newname,
    }, this.state.fieldSelected, config);
  };
}

export default withTranslation(undefined, { withRef: true })(withLoading(XwjAnalysisPoolIAO_TargetDelimitFieldMaker));
