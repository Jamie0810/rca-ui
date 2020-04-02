import React from "react";
import {isEmpty, reduce, values, mergeWith, union} from "lodash";
import {Col, FormGroup, Input, Label} from "reactstrap";
import 'flatpickr/dist/themes/material_green.css';
import 'flatpickr/dist/l10n/zh';
import {withTranslation} from "react-i18next";

class WjyQueryFormByLine extends React.PureComponent {
  floorLine = mergeWith(...values(this.props.productFloorLine), union);

  state = {
    // products: [],
    // productInvalid: false,
    floors: [],
    floorInvalid: false,
    lines: [],
    lineInvalid: false,
    // startTime: this.props.criteria.startTimeStr? moment(this.props.criteria.startTimeStr).toDate(): null,
    // stopTime: this.props.criteria.stopTimeStr? moment(this.props.criteria.stopTimeStr).toDate(): null,
    // collapse: false,
    isCurrentShift: true,
  };

  componentDidMount() {
    // console.log('this.floorLine: ', this.floorLine);
    let floorLine = this.floorLine;
    let criteria = this.props.criteria;
    let floors = Object.keys(floorLine);
    if (isEmpty(criteria)) {
      this.setState({ floors });
    } else {
      let {floor, line} = criteria;
      let lines = floorLine[floor] || [];
      this.setState({ floors, lines }, () => {
        // this.product.value = product;
        this.floor.value = floor;
        this.line.value = line;
      });
    }
  }

  render() {
    const { t } = this.props;

    return (
      <React.Fragment>
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
              <option value="">{t('common.choose')}</option>
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
                  // onChange={this.currentShift}
                />{t('wyj.current_shift')}
              </Label>
            </FormGroup>
          </Col>
        </FormGroup>
      </React.Fragment>
    );
  }

  floorChangeHandler = e => {
    // let product = this.product.value;
    let floor = e.target.value;
    let state = {};
    if (isEmpty(floor)) {
      state = { lines: [] };
    } else {
      let lines = this.floorLine[floor];
      state = { lines };
    }
    this.setState(state, () => {
      this.line.value = '';
    });
  };

  getCriteria = e => {
    let state = {
      // productInvalid: isEmpty(this.product.value),
      floorInvalid: isEmpty(this.floor.value),
      lineInvalid: isEmpty(this.line.value)
    };
    this.setState(state);

    let valid = reduce(state, (valid, isInvalid) => (valid && !isInvalid), true);
    if (valid) {
      return {
        // product: this.product.value,
        floor: this.floor.value,
        line: this.line.value,
        // startTimeStr: this.state.startTime? moment(this.state.startTime).format('YYYY-MM-DD HH:mm'): undefined,
        // stopTimeStr: this.state.stopTime? moment(this.state.stopTime).format('YYYY-MM-DD HH:mm'): undefined
      };
    }
    return null;
  };
}

export default withTranslation(undefined, { withRef: true })(WjyQueryFormByLine);
