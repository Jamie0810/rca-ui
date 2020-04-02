import React, {PureComponent} from 'react';
import {
  Button,
  CardBody,
  CardHeader,
  Col,
  Collapse,
  Form,
  FormGroup,
  FormText,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label
} from 'reactstrap';
import 'flatpickr/dist/themes/material_green.css';
import Flatpickr from 'react-flatpickr';
import "flatpickr/dist/l10n";
import moment from 'moment';
import {filter, getOperatingProductFloorLines} from '../../action/defective-action';
import withLoading from "../../utils/hoc/withLoading";
import {inRange, isEmpty, reduce, toNumber} from "lodash";
import {withTranslation} from "react-i18next";
import {BoldLabel, FormPropertyColumn, FormRow, FormValueColumn, PlainColumn} from "../Layout";

// const defaultTimestamp = moment().startOf('minutes').valueOf();

class QueryForm extends PureComponent {
  state = {
    productFloorLine: {},
    products: [],
    // product: null,
    productInvalid: false,
    floors: [],
    // floor: null,
    floorInvalid: false,
    lines: [],
    timeStart: moment().add('day', -1).startOf('minutes').valueOf(),
    timeEnd: moment().startOf('minutes').valueOf(),
    timeInvalid: false,
    // defective: 5,
    defectiveInvalid: false,
    // collapse: false
  };

  componentDidMount () {
    this.fetchOptionMenu();
  }

  render () {
    const { t, i18n } = this.props;
    const locale = i18n.language.split('-')[0];

    // const products = Object.keys(this.state.productFloorLine);
    // const floors = this.state.productFloorLine[this.state.product] || [];
    return (
      <Collapse isOpen={!this.props.collapse}>
        <CardHeader className="px-4">{t('common.search')}</CardHeader>
        <CardBody>
          <FormRow>
            <FormPropertyColumn md={4}>
              <BoldLabel>{t('common.datetime_period')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn md={4}>
              <InputGroup className={this.state.timeInvalid? 'border border-danger is-invalid': undefined}>
                <Flatpickr
                  key={i18n.language}
                  className="form-control form-control-sm first bg-white"
                  options={{
                    time_24hr: true,
                    enableTime: true,
                    defaultDate: this.state.timeStart,
                    dateFormat: 'Y-m-d H:i',
                    locale,
                    minuteIncrement: 30
                  }}
                  onChange={date => this.setState({ timeStart: date[0].getTime() }, this.fetchOptionMenu)} />
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
                  onChange={date => this.setState({ timeEnd: date[0].getTime() }, this.fetchOptionMenu)} />
              </InputGroup>
              <FormText className="help-block">{t('defect.date_period_note')}</FormText>
              {/*<FormFeedback className={this.state.timeInvalid? 'd-block': undefined}>查詢日期不得超過14天</FormFeedback>*/}
            </FormValueColumn>
          </FormRow>

          <FormRow>
            <FormPropertyColumn md={4}>
              <BoldLabel>{t('common.product')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn md={4}>
              <Input
                type="select" name="product" bsSize="sm"
                invalid={this.state.productInvalid}
                innerRef={ref => this.product = ref}
                onChange={this.productChangeHandler}
              >
                {/*<option value="">請選擇</option>*/}
                {this.state.products.map(item => (<option value={item} key={item}>{item}</option>))}
              </Input>
              {/*<FormText className="help-block">Please enter your password</FormText>*/}
            </FormValueColumn>
          </FormRow>
          <FormRow>
            <FormPropertyColumn md={4}>
              <BoldLabel>{t('common.floor')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn md={4}>
              <Input
                type="select" name="floor" bsSize="sm"
                invalid={this.state.floorInvalid}
                innerRef={ref => this.floor = ref}
                onChange={this.floorChangeHandler}
              >
                {/*<option value="">請選擇</option>*/}
                {this.state.floors.map(item => {
                  return <option value={item} key={item}>{item}</option>
                })}
              </Input>
              {/*<FormText className="help-block">Please enter your password</FormText>*/}
            </FormValueColumn>
          </FormRow>

          <FormRow>
            <FormPropertyColumn md={4}>
              <BoldLabel>{t('common.line')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn md={4}>
              <Input
                type="select" name="line" bsSize="sm"
                invalid={this.state.lineInvalid}
                innerRef={ref => this.line = ref}
              >
                <option value="">{t('common.all')}</option>
                {this.state.lines.map(item => {
                  return <option value={item} key={item}>{item}</option>
                })}
              </Input>
              {/*<FormText className="help-block">Please enter your password</FormText>*/}
            </FormValueColumn>
          </FormRow>

          <FormRow>
            <FormPropertyColumn md={4}>
              <BoldLabel>{t('defect.quantity_of_fail_symptom')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn md={4}>
              <Input
                type="number" defaultValue={5} min={1} max={20}
                innerRef={ref => this.defective = ref}
                invalid={this.state.defectiveInvalid}
                // onChange={this.defectiveChangeHandler}
                placeholder="5" bsSize="sm" />
              <FormText className="help-block">{t('defect.fail_symptom_note')}</FormText>
            </FormValueColumn>
            <PlainColumn>
              <Button type="button" size="sm" color="primary" onClick={this.queryHandler}>
                <i className="fa fa-dot-circle-o" /> {t('common.search')}
              </Button>
            </PlainColumn>
          </FormRow>
        </CardBody>
      </Collapse>
    );
  };

  productChangeHandler = e => {
    let product = e.target.value;
    let floors = Object.keys(this.state.productFloorLine[product]);
    let floor = floors[0];
    let lines = this.state.productFloorLine[product][floor] || [];
    this.setState({ floors, lines }, () => {
      this.floor.value = floor;
      this.line.value = '';
    });
  };

  floorChangeHandler = e => {
    let product = this.product.value;
    let floor = e.target.value;
    let {productFloorLine} = this.state;
    let lines = productFloorLine[product][floor];
    this.setState({ lines, productInvalid: false, floorInvalid: false }, () => {
      this.line.value = '';
    });
  };

  // defectiveChangeHandler = e => {
  //   let defective = parseInt(e.target.value);
  //   this.setState({ defective });
  // };

  fetchOptionMenu = () => {
    if (this.timeRangeValidator()) {
      this.props.toggleLoading(true);
      getOperatingProductFloorLines(this.state.timeStart, this.state.timeEnd)
        .then(productFloorLine => {
          let products = Object.keys(productFloorLine);
          let product = products[0];
          let floors = product? Object.keys(productFloorLine[product]): [];
          let floor = floors[0] || undefined;
          let lines = floor? productFloorLine[product][floor]: [];
          this.setState({
            productFloorLine,
            products,
            floors,
            lines,
            productInvalid: false,
            floorInvalid: false
          }, () => {
            this.product.value = product;
            this.floor.value = floor;
          })
        })
        .catch(err => this.props.pushNotification(this.props.t('message.system.error')))
        .finally(this.props.toggleLoading);
    }
  };

  timeRangeValidator = () => {
    let timeDiff = moment(this.state.timeEnd).diff(moment(this.state.timeStart), 'days', true);
    let timeInvalid = timeDiff <= 0 || parseInt(timeDiff, 10) > 14;
    this.setState({ timeInvalid });

    return !timeInvalid;
  };

  queryHandler = e => {
    // mask this form
    let state = {
      // loading: true,
      productInvalid: isEmpty(this.product.value),
      floorInvalid: isEmpty(this.floor.value),
      defectiveInvalid: !inRange(toNumber(this.defective.value), 1, 21),
      timeInvalid: !this.timeRangeValidator()
    };

    this.setState(state);
    let valid = reduce(state, (valid, isInvalid) => (valid && !isInvalid), true);

    if (valid) {
      this.props.toggleLoading(true);

      //create query parameters
      const criteria = {
        product: this.product.value,
        floor: this.floor.value,
        line: isEmpty(this.line.value)? undefined: this.line.value,
        startTime: moment(this.state.timeStart).format('YYYY-MM-DD HH:mm:ss'),
        stopTime: moment(this.state.timeEnd).format('YYYY-MM-DD HH:mm:ss'),
        resultSize: toNumber(this.defective.value) || 5,
      };

      //do query
      filter(criteria)
        .then(data => {
          //check result data
          if (data.recordList.length === 0) {
            this.props.pushNotification('查無資料', {level: 'warning'});
          } else {
            //data exist, disable mask and collapse block
            this.props.commit({
              defectiveInfo: data.infoData,
              failureSymptomList: data.recordList
            });
          }
      })
        .catch(error => this.props.pushNotification('系統錯誤，請稍後再試！'))
        .finally(this.props.toggleLoading);
    }

  };
}

export default withTranslation()(withLoading(QueryForm));
