import React from "react";
import {Trans, useTranslation} from "react-i18next";

const DATA_DISTINCT_OPTIONS = {
  first: 'analysis_set.target.data_election_rule.first',
  last: 'analysis_set.target.data_election_rule.last'
};

const NUMBER_FIELD_RESTRICTION_OPERATOR_OPTIONS = {
  equals: '=',
  over_equals: '>=',
  over: '>',
  less_equals: '<=',
  less: '<',
  not_equals: '<>'
};

const TEXT_FIELD_RESTRICTION_OPERATOR_OPTIONS = {
  equals: 'analysis_set.target.field_criteria.operator.equals',
  contains: 'analysis_set.target.field_criteria.operator.contains',
  starts_with: 'analysis_set.target.field_criteria.operator.starts_with',
  ends_with: 'analysis_set.target.field_criteria.operator.ends_with',
  missing: 'analysis_set.target.field_criteria.operator.missing',
};

const DATETIME_FIELD_RESTRICTION_OPERATOR_OPTIONS = {
  over_equals: '>=',
  less: '<',
};

const MATRIX_DATA_SCALE = [
  { key: 'Month', label: 'analysis_set.matrix.time_scale_by_month' },
  { key: 'Week', label: 'analysis_set.matrix.time_scale_by_week' },
  { key: 'Day', label: 'analysis_set.matrix.time_scale_by_day' }
];

const CustomFieldRefExpressionNode = ({dataType, newname, name, times, precision, start, length}) => {
  switch (dataType) {
    case 'int':
    case 'float':
      return (
        <Trans i18nKey="analysis_set.target.customize_field_number_expression" {...{name, newname, times, precision}}>
          <span className="pr-1">{{newname}}</span>
          參考<span className="px-1">{{name}}</span>乘上
          倍率<span className="px-1">{{times}}</span>，取小數位
          <span className="px-1">{{precision}}</span>
        </Trans>
      );
    case 'string':
      return (
        <Trans i18nKey="analysis_set.target.customize_field_number_expression" {...{name, newname, times, precision}}>
          <span className="pr-1">{{newname}}</span>
          參考<span className="px-1">{{name}}</span>
          擷取內容從第<span className="px-1">{{start}}</span>字，取
          <span className="px-1">{{length}}</span>個字
        </Trans>
      );
    default:
      return null;
  }
};

const FieldRestrictionExpressionNode = ({dataType, ...props}) => {
  switch (dataType) {
    case 'int':
    case 'float':
      return <NumericFieldRestrictionExpressNode {...props}/>;
    case 'string':
      return <TextFieldRestrictionExpressionNode {...props}/>;
    case 'timestamp':
      return <DateTimeFieldRestrictionExpressionNode {...props}/>;
    default:
      return null;
  }
};

const NumericFieldRestrictionExpressNode = ({name, operator, value}) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <span className="pr-1">{name}</span>
      <span className="px-1">{t(NUMBER_FIELD_RESTRICTION_OPERATOR_OPTIONS[operator])}</span>
      <span className="px-1">{value}</span>
    </React.Fragment>
  );
};

const TextFieldRestrictionExpressionNode = ({name, operator, value}) => {
  const { t } = useTranslation();

  switch (operator) {
    case 'missing':
      return (
        <React.Fragment>
          <span className="pr-1">{name}</span>
          {t(TEXT_FIELD_RESTRICTION_OPERATOR_OPTIONS[operator])}
        </React.Fragment>
      );
    default:
      return (
        <React.Fragment>
          <span className="pr-1">{name}</span>
          <span className="px-1">{t(TEXT_FIELD_RESTRICTION_OPERATOR_OPTIONS[operator])}</span>
          <span className="px-1">{value}</span>
        </React.Fragment>
      );
  }
};

const DateTimeFieldRestrictionExpressionNode = ({name, operator, value}) => {
  return (
    <React.Fragment>
      <span className="pr-1">{name}</span>
      <span className="px-1">{DATETIME_FIELD_RESTRICTION_OPERATOR_OPTIONS[operator]}</span>
      <span className="px-1">{value}</span>
    </React.Fragment>
  );
};

export {
  MATRIX_DATA_SCALE,
  DATA_DISTINCT_OPTIONS,
  NUMBER_FIELD_RESTRICTION_OPERATOR_OPTIONS,
  TEXT_FIELD_RESTRICTION_OPERATOR_OPTIONS,
  DATETIME_FIELD_RESTRICTION_OPERATOR_OPTIONS,
  CustomFieldRefExpressionNode,
  FieldRestrictionExpressionNode
};
