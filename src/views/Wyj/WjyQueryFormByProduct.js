import React from "react";
import {isEmpty, reduce} from "lodash";
import {Col, Collapse, FormGroup, Input, Label, Row} from "reactstrap";
import Flatpickr from "react-flatpickr";
import 'flatpickr/dist/themes/material_green.css';
import 'flatpickr/dist/l10n/zh';
import moment from 'moment';
import {withTranslation} from "react-i18next";

class WjyQueryFormByProduct extends React.PureComponent {
  state = {
    products: [],
    productInvalid: false,
    floors: [],
    floorInvalid: false,
    lines: [],
    lineInvalid: false,
    startTime: this.props.criteria.startTimeStr? moment(this.props.criteria.startTimeStr).toDate(): null,
    stopTime: this.props.criteria.stopTimeStr? moment(this.props.criteria.stopTimeStr).toDate(): null,
    collapse: false,
    isCurrentShift: !(this.props.criteria.startTimeStr || this.props.criteria.stopTimeStr),
  };

  componentDidMount() {
    let productFloorLine = this.props.productFloorLine;
    let criteria = this.props.criteria;
    let products = Object.keys(productFloorLine);
    if (isEmpty(criteria)) {
      this.setState({ products });
    } else {
      let {product, floor, line} = criteria;
      let floors = Object.keys(productFloorLine[product] || {});
      let lines = productFloorLine[product][floor] || [];
      this.setState({ products, floors, lines }, () => {
        this.product.value = product || '';
        this.floor.value = floor || '';
        this.line.value = line || '';
      });
    }
  }

  render() {
    const { t } = this.props;
    return (
      <React.Fragment>
        <FormGroup row>
          <Col lg="2" className="h4 offset-sm-2">
            <Label className="float-right">{t('common.product')}</Label>
          </Col>
          <Col lg="5">
            <Input
              type="select" name="product" bsSize="md"
              invalid={this.state.productInvalid}
              innerRef={ref => this.product = ref}
              onChange={this.productChangeHandler}>
              <option value="">{t('common.choose')}</option>
              {this.state.products.map(item => {
                return (<option value={item} key={item}>{item}</option>)
              })}
            </Input>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col lg="2" className="h4 offset-sm-2">
            <Label className="float-right">{t('common.floor')}</Label>
          </Col>
          <Col lg="5">
            <Input
              type="select" name="floor" bsSize="md"
              invalid={this.state.floorInvalid}
              innerRef={ref => this.floor = ref}
              onChange={this.floorChangeHandler}>
              <option value="">請選擇</option>
              {this.state.floors.map(item => (<option value={item} key={item}>{item}</option>))}
            </Input>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col lg="2" className="h4 offset-sm-2">
            <Label className="float-right">{t('common.line')}</Label>
          </Col>
          <Col lg="5">
            <Input
              type="select" name="line" bsSize="md"
              invalid={this.state.lineInvalid}
              innerRef={ref => this.line = ref}
              // onChange={this.lineChangeHandler}
            >
              <option value="">{t('common.choose')}</option>
              {this.state.lines.map(item => (<option value={item} key={item}>{item}</option>))}
            </Input>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col lg="2" className="h4 offset-sm-2">
            <Label className="float-right">{t('wyj.analyze_range')}</Label>
          </Col>
          <Col lg="6">
            <FormGroup check className="">
              <Label check className="h4 mb-1">
                <Input
                  type="radio"
                  name="isCurrentShift"
                  defaultChecked={this.state.isCurrentShift}
                  onChange={this.currentShift}
                />{t('wyj.current_shift')}
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check className="h4">
                <Input
                  type="radio"
                  name="isCurrentShift"
                  defaultChecked={!this.state.isCurrentShift}
                  onChange={this.specificDuration}
                  // aria-controls="example-collapse-text"
                  // aria-expanded={this.state.collapse}
                />{t('wyj.specific_datetime')}
              </Label>
              <Collapse isOpen={!this.state.isCurrentShift} className="mt-3">
                <Row>
                  <Col md="4" className="h4">
                    <Label className="float-right">{t('wyj.datetime_range_start')}</Label>
                  </Col>
                  <Col md="8">
                    <Flatpickr
                      className="form-control bg-white"
                      options={{
                        time_24hr: true,
                        enableTime: true,
                        defaultDate: this.state.startTime,
                        dateFormat: 'Y-m-d H:i',
                        locale: 'zh',
                        minuteIncrement: 30
                      }}
                      value={this.state.startTime}
                      onChange={date => { this.setState({startTime: date[0].getTime()}) }} />
                  </Col>
                </Row>
                <Row>
                  <Col md="4" className="h4">
                    <Label className="float-right">{t('wyj.datetime_range_end')}</Label>
                  </Col>
                  <Col md="8">
                    <Flatpickr
                      className="form-control bg-white"
                      options={{
                        time_24hr: true,
                        enableTime: true,
                        defaultDate: this.state.stopTime,
                        dateFormat: 'Y-m-d H:i',
                        locale: 'zh',
                        minuteIncrement: 30
                      }}
                      value={this.state.stopTime}
                      onChange={date => { this.setState({stopTime: date[0].getTime()}) }} />
                  </Col>
                </Row>
              </Collapse>
            </FormGroup>
          </Col>
        </FormGroup>
      </React.Fragment>
    );
  }

  productChangeHandler = e => {
    let product = e.target.value;
    let state = {};
    if (isEmpty(product)) {
      state = {
        floors: [],
        lines: []
      };
    } else {
      let floors = Object.keys(this.props.productFloorLine[product]);
      state = {floors, lines: []};
    }

    this.setState(state, () => {
      this.floor.value = '';
      this.line.value = '';
    });
    // console.log(this.state.floors)
  };

  floorChangeHandler = e => {
    let product = this.product.value;
    let floor = e.target.value;
    let state = {};
    if (isEmpty(floor)) {
      state = { lines: [] };
    } else {
      let lines = this.props.productFloorLine[product][floor];
      state = { lines };
    }
    this.setState(state, () => {
      this.line.value = '';
    });
  };

  currentShift = e => {
    // let collapse = this.state.collapse;
    this.setState({
      // collapse: !collapse,
      isCurrentShift: true,
      startTime: null,
      stopTime: null,
    });
  };

  specificDuration = e => {
    // let collapse = this.state.collapse;
    this.setState({
      // collapse: !collapse,
      isCurrentShift: false
    });
  };

  getCriteria = e => {
    let state = {
      productInvalid: isEmpty(this.product.value),
      floorInvalid: isEmpty(this.floor.value),
      lineInvalid: isEmpty(this.line.value)
    };
    this.setState(state);

    let timeValid = true;
    if (!this.state.isCurrentShift) {
      let timeDiff = moment(this.state.stopTime || Date.now()).diff(moment(this.state.startTime), 'days', true);
      if (timeDiff <= 0 || parseInt(timeDiff, 10) > 14) {
        timeValid = false;
        this.props.pushNotification(
          this.props.t('message.wyj.date_range', {days: 14})
        );
      } else if (!this.state.startTime && this.state.stopTime) {
        timeValid = false;
        this.props.pushNotification(this.props.t('message.wyj.select_date_start'));
      }
    }

    let valid = reduce(state, (valid, isInvalid) => (valid && !isInvalid), true) && timeValid;
    if (valid) {
      return {
        product: this.product.value,
        floor: this.floor.value,
        line: this.line.value,
        startTimeStr: this.state.startTime? moment(this.state.startTime).format('YYYY-MM-DD HH:mm'): undefined,
        stopTimeStr: this.state.stopTime? moment(this.state.stopTime).format('YYYY-MM-DD HH:mm'): undefined
      };
    }
    return null;
  };
}

export default withTranslation(undefined, { withRef: true })(WjyQueryFormByProduct);
