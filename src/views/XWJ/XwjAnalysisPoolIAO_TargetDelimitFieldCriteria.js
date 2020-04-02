import React from "react";
import {Input} from "reactstrap";
import {find, isEmpty, assign, values, map, orderBy} from "lodash";
import {
  DATETIME_FIELD_RESTRICTION_OPERATOR_OPTIONS,
  NUMBER_FIELD_RESTRICTION_OPERATOR_OPTIONS,
  TEXT_FIELD_RESTRICTION_OPERATOR_OPTIONS
} from "../../utils/xwj-util";
import 'flatpickr/dist/themes/material_green.css';
import Flatpickr from 'react-flatpickr';
import "flatpickr/dist/l10n";
import moment from 'moment';
import {withTranslation} from "react-i18next";
import {BoldLabel, FormPropertyColumn, FormRow, FormValueColumn} from "../Layout";

class NumericFieldConfig extends React.PureComponent {
  state = {
    operator: null,
    operatorInvalid: false,
    restrictionInvalid: false
  };

  render() {
    const { t } = this.props;

    return (
      <React.Fragment>
        <FormRow>
          <FormPropertyColumn md={3}>
            <BoldLabel>
              {t('analysis_set.target.field_criteria.rule')}
            </BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn md={8}>
            <Input
              type="select" bsSize="sm"
              invalid={this.state.operatorInvalid}
              innerRef={ref => this.operator = ref}
              onChange={e => this.setState({ operator: e.target.value })}
            >
              <option value="">{t('common.choose')}</option>
              {map(NUMBER_FIELD_RESTRICTION_OPERATOR_OPTIONS, (value, key) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </Input>
          </FormValueColumn>
        </FormRow>

        <FormRow>
          <FormPropertyColumn md={3}>
            <BoldLabel>
              {t('analysis_set.target.field_criteria.restriction')}
            </BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn md={8}>
            <Input
              type="text" bsSize="sm"
              invalid={this.state.restrictionInvalid}
              innerRef={ref => this.restriction = ref} />
          </FormValueColumn>
        </FormRow>
      </React.Fragment>
    );
  };

  getConfig = () => {
    let invalid = {
      operatorInvalid: isEmpty(this.state.operator),
      restrictionInvalid: isEmpty(this.restriction.value)
    };
    this.setState(invalid);

    if (values(invalid).reduce((isInvalid, fieldInvalid) => (isInvalid || fieldInvalid), false)) {
      return null;
    }

    return {
      operator: this.operator.value,
      value: this.restriction.value,
    };
  };
}

class TextFieldConfig extends React.PureComponent {
  state = {
    operator: null,
    operatorInvalid: false,
    restrictionInvalid: false
  };

  render() {
    const { t } = this.props;

    return (
      <React.Fragment>
        <FormRow>
          <FormPropertyColumn md={3}>
            <BoldLabel>
              {t('analysis_set.target.field_criteria.rule')}
            </BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn md={8}>
            <Input
              type="select" bsSize="sm"
              invalid={this.state.operatorInvalid}
              innerRef={ref => this.operator = ref}
              onChange={e => this.setState({ operator: e.target.value })}
            >
              <option value="">{t('common.choose')}</option>
              {map(TEXT_FIELD_RESTRICTION_OPERATOR_OPTIONS, (value, key) => (
                <option key={key} value={key}>{t(value)}</option>
              ))}
            </Input>
          </FormValueColumn>
        </FormRow>

        {(isEmpty(this.state.operator) || this.state.operator === 'missing')? null: (
          <FormRow>
            <FormPropertyColumn md={3}>
              <BoldLabel>
                {t('analysis_set.target.field_criteria.restriction')}
              </BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn md={8}>
              <Input
                type="text" bsSize="sm"
                invalid={this.state.restrictionInvalid}
                innerRef={ref => this.restriction = ref} />
            </FormValueColumn>
          </FormRow>
        )}
      </React.Fragment>
    );
  };

  getConfig = () => {
    let invalid = {
      operatorInvalid: isEmpty(this.state.operator),
      restrictionInvalid: this.restriction && isEmpty(this.restriction.value)
    };
    this.setState(invalid);

    if (values(invalid).reduce((isInvalid, fieldInvalid) => (isInvalid || fieldInvalid), false)) {
      return null;
    }

    return {
      operator: this.operator.value,
      value: this.restriction? this.restriction.value: undefined,
    };
  };
}

class DateTimeFieldConfig extends React.PureComponent {
  state = {
    operator: null,
    operatorInvalid: false,
    // restrictionInvalid: false,
    restriction: new Date()
  };

  render() {
    const { t, i18n } = this.props;
    const locale = i18n.language.split('-')[0];

    return (
      <React.Fragment>
        <FormRow>
          <FormPropertyColumn md={3}>
            <BoldLabel>
              {t('analysis_set.target.field_criteria.rule')}
            </BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn md={8}>
            <Input
              type="select" bsSize="sm"
              invalid={this.state.operatorInvalid}
              innerRef={ref => this.operator = ref}
              onChange={e => this.setState({ operator: e.target.value })}
            >
              <option value="">{t('common.choose')}</option>
              {map(DATETIME_FIELD_RESTRICTION_OPERATOR_OPTIONS, (value, key) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </Input>
          </FormValueColumn>
        </FormRow>

        <FormRow>
          <FormPropertyColumn md={3}>
            <BoldLabel>
              {t('analysis_set.target.field_criteria.restriction')}
            </BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn md={8}>
            <Flatpickr
              className="form-control form-control-sm first bg-white"
              options={{
                time_24hr: true,
                enableTime: true,
                defaultDate: this.state.restriction,
                dateFormat: 'Y-m-d H:i',
                locale,
                minuteIncrement: 30
              }}
              onChange={date => this.setState({ restriction: date[0].getTime() })} />
            {/*<Input*/}
            {/*  type="text" bsSize="sm"*/}
            {/*  invalid={this.state.restrictionInvalid}*/}
            {/*  innerRef={ref => this.restriction = ref} />*/}
          </FormValueColumn>
        </FormRow>
      </React.Fragment>
    );
  };

  getConfig = () => {
    let invalid = {
      operatorInvalid: isEmpty(this.state.operator),
      // restrictionInvalid: this.restriction && isEmpty(this.restriction.value)
    };
    this.setState(invalid);

    if (values(invalid).reduce((isInvalid, fieldInvalid) => (isInvalid || fieldInvalid), false)) {
      return null;
    }

    return {
      operator: this.operator.value,
      value: moment(this.state.restriction).format('YYYY-MM-DD HH:mm')
    };
  };
}

class XwjAnalysisPoolIAO_TargetDelimitFieldCriteria extends React.PureComponent {
  state = {
    fieldSelected: null,
    fieldInvalid: false,
  };

  fields = orderBy(this.props.fieldSelected.concat(
    this.props.fieldMade.map(({newname, type, dataType}) => ({
      name: newname,
      type,
      dataType
    }))), ['name']);

  getFieldConfigComponent = (datatype) => {
    const trans = withTranslation(undefined, { withRef: true });
    switch (datatype) {
      case 'string':
        return trans(TextFieldConfig);
      case 'int':
      case 'float':
        return trans(NumericFieldConfig);
      case 'timestamp':
        return trans(DateTimeFieldConfig);
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
          <FormPropertyColumn md={2}>
            <BoldLabel>
              {t('analysis_set.target.field_criteria.field_name')}
            </BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn md={8}>
            <Input
              type="select" bsSize="sm"
              invalid={this.state.fieldInvalid}
              innerRef={ref => this.field = ref}
              onChange={e => this.setState({
                fieldSelected: find(this.fields, {name: e.target.value}) || null
              })}
            >
              <option value="">{t('common.choose')}</option>
              {this.fields.map(item => {
                let name = item.newname || item.name;
                return (<option key={name} value={name}>{name}</option>)
              })}
            </Input>
          </FormValueColumn>
        </FormRow>

        <FieldConfigComponent ref={ref => this.refConfig = ref} />
      </React.Fragment>
    );
  }

  getRestriction = () => {
    let config = this.refConfig.getConfig? this.refConfig.getConfig(): undefined;
    let invalid = {
      fieldInvalid: !this.state.fieldSelected
    };
    this.setState(invalid);

    if (values(invalid).reduce((isInvalid, fieldInvalid) => (isInvalid || fieldInvalid), false) || !config) {
      return null;
    }

    return assign({
      key: Date.now(),
      name: this.field.value,
      type: this.state.fieldSelected.type,
      dataType: this.state.fieldSelected.dataType
    }, config);
  }
}

export default withTranslation(undefined, { withRef: true })(XwjAnalysisPoolIAO_TargetDelimitFieldCriteria);
