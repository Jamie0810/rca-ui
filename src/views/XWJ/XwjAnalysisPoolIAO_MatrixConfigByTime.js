import React from "react";
import {
  Button,
  FormFeedback,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText, Label, Row
} from "reactstrap";
import 'flatpickr/dist/themes/material_green.css';
import Flatpickr from 'react-flatpickr';
import "flatpickr/dist/l10n";
import {List} from "immutable";
import withLoading from "../../utils/hoc/withLoading";
import {createMatrix, getAnalysisSetNumericItemFields} from "../../action/analysis-pool-action";
import {map, isEmpty, keyBy, reduce} from 'lodash';
import moment from "moment";
import classNames from "classnames";
import {withTranslation} from "react-i18next";
import {FormValueColumn, FormPropertyColumn, FormRow, BoldLabel, BlockLabel, PlainLabel, PlainColumn} from "../Layout";
import {MATRIX_DATA_SCALE} from '../../utils/xwj-util';
import FormGroup from "reactstrap/es/FormGroup";

class XwjAnalysisPoolIAO_MatrixConfigByTime extends React.PureComponent {
  state = {
    nameInvalid: false,
    // timeInvalid: false,
    testItemInvalid: false,
    testItemList: List(),
    testItemOptions: {},
    timeStart: Date.now(),
    timeEnd: Date.now()
  };

  componentDidMount() {
    this.props.toggleLoading(true);
    getAnalysisSetNumericItemFields(this.props.id).then(testItems => {
      let testItemOptions = keyBy(testItems, 'name');
      this.setState({ testItemOptions }, this.props.toggleLoading);
    });
  };

  render() {
    const { t, i18n } = this.props;
    const locale = i18n.language.split('-')[0];

    return (
      <React.Fragment>

        <FormRow>
          <FormPropertyColumn md={2}>
            <BoldLabel>{t('common.name')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn>
            <Input type="text" bsSize="sm" innerRef={ref => this.name = ref} invalid={this.state.nameInvalid} />
          </FormValueColumn>
        </FormRow>

        <FormRow>
          <FormPropertyColumn md={2}>
            <BoldLabel>{t('common.description')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn>
            <Input type="text" bsSize="sm" innerRef={ref => this.description = ref} />
          </FormValueColumn>
        </FormRow>

        <FormRow>
          <FormPropertyColumn md={2}>
            <BoldLabel>{t('analysis_set.matrix.test_datetime')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn>
            <InputGroup className={this.state.timeInvalid? 'border border-danger is-invalid': undefined}>
              <Flatpickr
                className="form-control form-control-sm first bg-white"
                options={{
                  time_24hr: true,
                  enableTime: true,
                  defaultDate: this.state.timeStart,
                  dateFormat: 'Y-m-d H:i',
                  locale,
                  minuteIncrement: 30
                }}
                onChange={date => this.setState({ timeStart: date[0].getTime() })} />
              <InputGroupAddon addonType="append">
                <InputGroupText><i className="fa fa-chevron-right" /></InputGroupText>
              </InputGroupAddon>
              <Flatpickr
                className="form-control form-control-sm bg-white"
                options={{
                  time_24hr: true,
                  enableTime: true,
                  defaultDate: this.state.timeEnd,
                  dateFormat: 'Y-m-d H:i',
                  locale,
                  minuteIncrement: 30
                }}
                onChange={date => this.setState({ timeEnd: date[0].getTime() })} />
            </InputGroup>
          </FormValueColumn>
        </FormRow>

        <FormRow>
          <FormPropertyColumn md={2}>
            <BoldLabel>{t('defect.test_item')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn md={9}>
            <Button
              disabled={this.state.testItemList.size >= 5}
              color="white"
              className="shadow-none"
              onClick={this.addTestItem}><i className="fa fa-plus"/>
            </Button>
            <FormFeedback className={classNames({'d-block': this.state.testItemList.size === 0})}>
              {t('common.record_limits_range', {at_least: 1, at_most: 5})}
            </FormFeedback>
            {this.state.testItemList.map((testItem, index) => (
              <div className="border px-3 py-2 mb-2" key={testItem.key}>
                <FormRow>
                  <PlainColumn>
                    <Input
                      type="select" bsSize="sm"
                      innerRef={ref => this[`item_${index}`] = ref}
                      invalid={this.state[`itemInvalid_${index}`]}
                      onChange={e => {
                        let item = this.state.testItemOptions[e.target.value];
                        if (!isEmpty(item)) {
                          this[`testUpper_${index}`].value = item.testUpper;
                          this[`testLower_${index}`].value = item.testLower;
                        }
                      }}
                    >
                      <option value="">{t('common.choose')}</option>
                      {map(this.state.testItemOptions, ({name, testUpper, testLower}, key) => (
                        <option value={key} key={key}>{name}</option>
                      ))}
                    </Input>
                  </PlainColumn>
                </FormRow>
                <Row>
                  <FormPropertyColumn md={2}>
                    <BlockLabel>{t('common.range_upper_bound')}</BlockLabel>
                  </FormPropertyColumn>
                  <FormValueColumn md={3}>
                    <Input
                      type="number" bsSize="sm"
                      defaultValue={testItem.testUpper}
                      invalid={this.state[`testScaleInvalid_${index}`]}
                      innerRef={ref => this[`testUpper_${index}`] = ref} />
                  </FormValueColumn>
                  <FormPropertyColumn md={2}>
                    <BlockLabel>{t('common.range_lower_bound')}</BlockLabel>
                  </FormPropertyColumn>
                  <FormValueColumn md={3}>
                    <Input
                      type="number" bsSize="sm"
                      defaultValue={testItem.testLower}
                      invalid={this.state[`testScaleInvalid_${index}`]}
                      innerRef={ref => this[`testLower_${index}`] = ref} />
                  </FormValueColumn>
                  <PlainColumn md={1}>
                    <Button
                      size="sm"
                      color="danger"
                      className="fa fa-times"
                      onClick={e => this.setState(prevState => ({
                        testItemList: prevState.testItemList.delete(index)
                      }))}
                    />
                  </PlainColumn>
                </Row>
              </div>
            ))}
          </FormValueColumn>
        </FormRow>

        <FormRow>
          <FormPropertyColumn md={2}>
            <BoldLabel>{t('analysis_set.plot.data_time_scale')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn>
            <FormGroup>
              <Input type="select" bsSize="sm" innerRef={ref => this.timeRange = ref}>
                {
                  MATRIX_DATA_SCALE.map(({key, label}) => (
                    <option value={key} key={key}>{t(label)}</option>
                  ))
                }
              </Input>
            </FormGroup>
            {/*<Label className="form-check">*/}
            {/*  <Input*/}
            {/*    type="checkbox" className="form-check-input" defaultChecked={false}*/}
            {/*    innerRef={ref => this.insideND = ref}/>*/}
            {/*  {t('analysis_set.matrix.render_normal_distribution_by_group')}*/}
            {/*</Label>*/}
            {/*<Label className="form-check">*/}
            {/*  <Input*/}
            {/*    type="checkbox" className="form-check-input" defaultChecked={false}*/}
            {/*    innerRef={ref => this.overallND = ref}/>*/}
            {/*  {t('analysis_set.matrix.render_normal_distribution_by_total')}*/}
            {/*</Label>*/}
          </FormValueColumn>
        </FormRow>
      </React.Fragment>
    );
  };

  addTestItem = () => {
    this.setState(prevState => ({
      testItemList: prevState.testItemList.push({
        key: Date.now(),
        item: undefined,
        testUpper: undefined,
        testLower: undefined
      })
    }))
  };

  submit = () => {
    this.props.toggleLoading(true);

    let state = {
      nameInvalid: isEmpty(this.name.value),
      testItemInvalid: (this.state.testItemList.size === 0)
    };
    this.state.testItemList.forEach((testItem, index) => {
      state[`testScaleInvalid_${index}`] =
        (isEmpty(this[`testUpper_${index}`].value) && isEmpty(this[`testLower_${index}`].value));
      state[`itemInvalid_${index}`] = isEmpty(this[`item_${index}`].value);
    });

    // console.log('state: ', state);
    this.setState(state);

    let valid = reduce(state, (valid, isInvalid) => (valid && !isInvalid), true);

    // console.log('valid: ', valid);
    if (valid) {
      let settingJson = {
        testItem: this.state.testItemList.map((testItem, index) => ({
          item: this[`item_${index}`].value,
          testUpper: isEmpty(this[`testUpper_${index}`].value)? undefined: this[`testUpper_${index}`].value,
          testLower: isEmpty(this[`testLower_${index}`].value)? undefined: this[`testLower_${index}`].value
        })).toJSON(),
        timeRange: this.timeRange.value
      };
      let data = {
        caseId: this.props.id,
        description: isEmpty(this.description.value)? undefined: this.description.value,
        testTimeStart: moment(this.state.timeStart).format('YYYY-MM-DD HH:mm:ss'),
        testTimeEnd: moment(this.state.timeEnd).format('YYYY-MM-DD HH:mm:ss'),
        matrixType: 1,
        name: this.name.value,
        // insideND: this.insideND.checked? 1: 0,
        // overallND: this.overallND.checked? 1: 0,
        settingJson: JSON.stringify(settingJson)
      };

      // console.log('settingJson: ', settingJson);
      // console.log('data: ', data);

      return createMatrix(data)
        .finally(this.props.toggleLoading)
    } else {
      this.props.toggleLoading(false);
      return Promise.reject(null);
    }
  };
}

export default withTranslation(undefined, { withRef: true })(withLoading(XwjAnalysisPoolIAO_MatrixConfigByTime));
