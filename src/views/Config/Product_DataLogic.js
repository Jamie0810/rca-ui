import React from "react";
import {
  FormGroup, 
  Col, 
  Label,
  Input,
  Button
} from "reactstrap";
import moment from 'moment';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import {map, assign, toNumber, reduce, isEmpty} from 'lodash';
import { getDataLogicInformation, updateDataLogic } from "../../action/product-action";
import Row from "reactstrap/es/Row";
import withLoading from "../../utils/hoc/withLoading";
import { List } from "immutable";
import {withTranslation} from "react-i18next";
import {BoldLabel, FormPropertyColumn, FormRow, FormValueColumn, PlainColumn} from "../Layout";

const TRUE_FAIL_OPTIONS = {
  1: 'product.data_capture.adopt_criteria.option_1',
  2: 'product.data_capture.adopt_criteria.option_2'
};

class Product_DataLogic extends React.PureComponent{
  
  state = {
    removeItem: null,
    shift: List(),
    mdTolerateTimeInvalid: false,
    taTolerateTimeInvalid: false,
    shiftInvalid: false,
  };

  id = this.props.match.params.id;
  
  componentDidMount () {
    getDataLogicInformation(this.id).then(({shift, ...rests}) => {
      shift = List(shift);
      this.setState({ ...rests, shift }, () => {
        this.trueFailRule.value = rests.trueFailRule;
        this.props.toggleLoading();
      });
    })
  }

  render() {
    const { t } = this.props;

    return (
      <React.Fragment>
        <div className="pb-3">
          <FormRow>
            <FormPropertyColumn md={3}>
              <BoldLabel>{t('product.data_capture.adopt_criteria.label')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn md={4}>
              <Input
                type="select"
                bsSize="sm"
                innerRef={ref => this.trueFailRule = ref}>
                {map(TRUE_FAIL_OPTIONS, (item, key) => {
                  return (<option key={key} value={key}>{t(item)}</option>);
                })}
              </Input>
            </FormValueColumn>
          </FormRow>

          <FormRow>
            <FormPropertyColumn md={3}>
              <BoldLabel>{t('product.data_capture.permitted_compose_time_diff')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn md={4}>
              <Input
                type="number"
                bsSize="sm"
                invalid={this.state.mdTolerateTimeInvalid}
                defaultValue={this.state.mdTolerateTime}
                innerRef={ref => this.mdTolerateTime = ref}/>
            </FormValueColumn>
          </FormRow>

          <FormRow>
            <FormPropertyColumn md={3}>
              <BoldLabel>{t('product.data_capture.permitted_compose_test_time_diff')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn md={4}>
              <Input
                type="number"
                bsSize="sm"
                invalid={this.state.taTolerateTimeInvalid}
                defaultValue={this.state.taTolerateTime}
                innerRef={ref => this.taTolerateTime = ref}/>
            </FormValueColumn>
          </FormRow>

          <FormRow>
            <FormPropertyColumn md={3}>
              <BoldLabel>{t('product.data_capture.data_upload_frequency')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn md={4}>
              <Input
                type="number"
                bsSize="sm"
                defaultValue={this.state.uploadFreq}
                innerRef={ref => this.uploadFreq = ref}/>
            </FormValueColumn>
          </FormRow>

          <FormRow>
            <FormPropertyColumn md={3}>
              <BoldLabel>{t('product.data_capture.shift')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn md={5}>
              <Row>
                <PlainColumn>
                  <Button
                    color={`${this.state.shiftInvalid ? 'danger' : undefined}`}
                    className="shadow-none"
                    onClick={e => this.addShift()}><i className="fa fa-plus"/></Button>
                </PlainColumn>
              </Row>
              {
                this.state.shift.map((_shift, index) => (
                  <Row key={index} className="my-1">
                    <PlainColumn md={3}>
                      <Input
                        type="select"
                        bsSize="sm"
                        onChange={e => {
                          let description = e.target.value;
                          this.setState(prevState => ({
                            shift: prevState.shift.set(index, assign(_shift, {description}))
                          }))
                        }}
                        innerRef={ref => ref && (ref.value = _shift.description)}>
                        <option value="day">{t('product.data_capture.first_shift')}</option>
                        <option value="noon">{t('product.data_capture.second_shift')}</option>
                        <option value="night">{t('product.data_capture.third_shift')}</option>
                      </Input>
                    </PlainColumn>
                    <PlainColumn md={3}>
                      <TimePicker
                        showSecond={false} allowEmpty={false} minuteStep={15} id={`start_${index}`}
                        value={moment(_shift.startTime, 'HH:mm')}
                        onChange={value => this.setState(prevState => ({
                          shift: prevState.shift.set(index, assign({}, _shift, {startTime: value.format('HH:mm')}))
                        }))}/>
                    </PlainColumn>
                    <PlainColumn md={1}><span className="text-center">~</span></PlainColumn>
                    <PlainColumn md={3}>
                      <TimePicker
                        showSecond={false} allowEmpty={false} minuteStep={15} inputReadOnly id={`stop_${index}`}
                        value={moment(_shift.stopTime, 'HH:mm')}
                        onChange={value => this.setState(prevState => ({
                          shift: prevState.shift.set(index, assign({}, _shift, {stopTime: value.format('HH:mm')}))
                        }))}/>
                    </PlainColumn>
                    <PlainColumn>
                      {/*<Button*/}
                      {/*  size="sm"*/}
                      {/*  className="fa fa-plus-circle mx-1"*/}
                      {/*  onClick={(e) => this.shiftHandler('create')}/>*/}
                      <Button
                        size="sm" color="danger"
                        className="shadow-none"
                        onClick={e => this.setState(prevState => ({shift: prevState.shift.delete(index)}))}>
                        <i className="fa fa-trash-o icons font-sm"/>
                      </Button>
                    </PlainColumn>
                  </Row>
                ))
              }
            </FormValueColumn>
          </FormRow>
        </div>
        <div className="border-top text-right pt-2 pr-5">
          <Button type="button" color="primary" size="sm" onClick={this.saveDataLogic}>
            <i className="fa fa-dot-circle-o mr-1"/>{t('common.save')}
          </Button>
        </div>
      </React.Fragment>
    );
  }

  addShift = () => this.setState(prevState => ({
    shift: prevState.shift.push({
      description: "day",
      startTime: "08:00",
      stopTime: "20:00"
    })
  }));

  saveDataLogic = () => {
    const { t, toggleLoading, pushNotification } = this.props;

    let mdTolerateTime = toNumber(this.mdTolerateTime.value);
    let taTolerateTime = toNumber(this.taTolerateTime.value);
    let uploadFreq = isEmpty(this.uploadFreq.value)? undefined: toNumber(this.uploadFreq.value);
    let state = {
      mdTolerateTimeInvalid: mdTolerateTime < 0 || mdTolerateTime > 300,
      taTolerateTimeInvalid: taTolerateTime < 0 || taTolerateTime > 300,
      shiftInvalid: this.state.shift.size === 0,
    };

    this.setState(state);
    let valid = reduce(state, (valid, isInvalid) => (valid && !isInvalid), true);

    if (valid) {
      let data = {
        product: this.state.product,
        trueFailRule: this.trueFailRule.value,
        mdTolerateTime: mdTolerateTime,
        taTolerateTime: taTolerateTime,
        uploadFreq: uploadFreq,
        shift: this.state.shift.toJSON()
      };

      updateDataLogic(this.id, data)
        .then(() => {
          pushNotification(t('message.system.save_succeed'), {level: 'success'});
        })
        .then(toggleLoading)
        .catch(err => {
          pushNotification(t('message.system.save_failed'));
          toggleLoading(false);
        });
    }
  }
}

export default withTranslation()(withLoading(Product_DataLogic));
