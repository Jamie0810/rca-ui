import React, {PureComponent} from "react";
import {Button, FormFeedback, FormText, Input, InputGroup, InputGroupAddon, InputGroupText} from "reactstrap";
import XwjTestCasePicker from "./XwjTestCasePicker";
import XwjEssentialMaterialPicker from "./XwjEssentialMaterialPicker";
import 'flatpickr/dist/themes/material_green.css';
import Flatpickr from 'react-flatpickr';
import "flatpickr/dist/l10n";
import {isEmpty, reduce} from "lodash";
import DataModal from "../Coommon/DataModal";
import moment from "moment";
import * as classnames from "classnames";
import {BlockLabel, BoldLabel, FormPropertyColumn, FormRow, FormValueColumn, TagBadge} from "../Layout";
import {getProductNames} from "../../action/defective-action";

class XwjDatasetCreateForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // dataset: {},
      products: [],
      // product: null,
      // scheduleTimeStart: null,
      // scheduleTimeEnd: null,
      // testCaseOptions: [],
      // testCaseSelected: [],
      product: this.props.product,
      testCaseSelected: this.props.dataSetStationItem || [],
      materialSelected: this.props.dataSetPart || [],
      scheduleTimeStart: moment(this.props.effectiveStartDate).toDate(),
      scheduleTimeEnd: moment(this.props.effectiveEndDate).add(this.props.effectiveEndDate? 0: 3, 'month').toDate(),
      testCaseModal: false,
      // testStations: [],
      // testStationItems: [],
      // materialSelected: [],
      materialTypes: [],
      materialTypeItems: [],
      materialModal: false,
      productInvalid: false,
      nameInvalid: false,
      timeInvalid: false,
      testCaseInvalid: false,
      materialInvalid: false
    };
  }

  fetchData() {
    return new Promise((resolve, reject) => {
      getProductNames().then(products => {
        this.setState({ products }, resolve);
      }).catch(reject);
    });
  }

  componentDidMount() {
    this.fetchData().then(this.props.toggleLoading)
  }

  render() {
    const { t, i18n } = this.props;
    const locale = i18n.language.split('-')[0];

    return (
      <React.Fragment>
        <FormRow>
          <FormPropertyColumn md={2}>
            <BoldLabel>{t('common.product')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn md={8}>
            {this.props.isEdit?
              (<BlockLabel>{this.state.product}</BlockLabel>):
              (
                <Input
                  type="select" bsSize="sm" name="product"
                  // defaultValue={this.props.product}
                  innerRef={ref => this.product = ref}
                  invalid={this.state.productInvalid}
                  onChange={this.productChangeHandler} >
                  <option value="">請選擇</option>
                  {this.state.products.map(item => {
                    return (<option key={item} value={item}>{item}</option>);
                  })}
                </Input>
              )}
          </FormValueColumn>
        </FormRow>

        <FormRow>
          <FormPropertyColumn md={2}>
            <BoldLabel>{t('common.name')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn md={8}>
            <Input
              type="text" bsSize="sm" name="name" maxLength={50}
              defaultValue={this.props.name}
              invalid={this.state.nameInvalid}
              innerRef={ref => this.name = ref} />
            <FormText className="help-block">{t('common.limit_50_letters_tip')}</FormText>
          </FormValueColumn>
        </FormRow>

        <FormRow>
          <FormPropertyColumn md={2}>
            <BoldLabel>{t('common.description')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn md={8}>
            <Input
              type="textarea" bsSize="sm" name="description" rows="6" maxLength={1000}
              defaultValue={this.props.remark}
              innerRef={ref => this.description = ref} />
            <FormText className="help-block">{t('common.limit_1000_letters_tip')}</FormText>
          </FormValueColumn>
        </FormRow>

        {/*<FormGroup row>*/}
        {/*  <Col xs="2" className="my-auto">*/}
        {/*    <Label size="sm" className="float-right my-auto font-weight-bold">資料集創建人</Label>*/}
        {/*  </Col>*/}
        {/*  <Col className="border-left my-auto">*/}
        {/*    <span className="form-control-static">{this.defaultDataset.username}</span>*/}
        {/*  </Col>*/}
        {/*</FormGroup>*/}

        <FormRow>
          <FormPropertyColumn md={2}>
            <BoldLabel>測試工站和測試項</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn md={8}>
            <Button
              color={`${this.state.testCaseInvalid? 'danger': 'white'}`}
              className={classnames({
                'shadow-none': true,
                'border-danger': this.state.testCaseInvalid
              })}
              onClick={this.testCaseModalToggle}><i className="fa fa-search" />
            </Button>
            <FormFeedback className={classnames({'d-block': this.state.testCaseInvalid})}>
              {t('common.record_limits_range', {at_least: 1, at_most: 50})}
            </FormFeedback>
            <div className="d-block mt-2">
              {this.state.testCaseSelected.map(item => {
                return (
                  <TagBadge key={item.key} toDelete={() => this.setState(prevState => ({
                    testCaseSelected:
                      prevState.testCaseSelected.filter(selected => (selected.key !== item.key)),
                  }))}>{item.station}@{item.item}
                    {/*<div className="h6 align-middle m-1 font-weight-lighter">{item.station}@{item.item}</div>*/}
                  </TagBadge>);
              })}
            </div>
            <DataModal
              caption={t('dataset.test_station_and_test_item')} size="lg"
              isOpen={this.state.testCaseModal}
              toggle={this.testCaseModalToggle}
              confirm={this.testCaseConfirm}>
              <XwjTestCasePicker
                ref={ref => this.testCasePicker = ref}
                product={this.state.product}
                testCaseSelected={this.state.testCaseSelected} />
            </DataModal>
          </FormValueColumn>
        </FormRow>

        <FormRow>
          <FormPropertyColumn md={2}>
            <BoldLabel>{t('common.crucial_component')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn md={8}>
            <Button
              color="white"
              className={classnames({
                'shadow-none': true,
                'border-danger': this.state.materialInvalid
              })}
              onClick={this.materialModalToggle}>
              <i className="fa fa-search"/>
            </Button>
            <FormFeedback className={classnames({'d-block': this.state.materialInvalid})}>
              上限50筆
            </FormFeedback>
            <div className="d-block mt-2">
              {this.state.materialSelected.map(item => {
                return (
                  <TagBadge key={item.key} toDelete={() => this.setState(prevState => ({
                    materialSelected:
                      prevState.materialSelected.filter(selected => (selected.key !== item.key)),
                  }))}>
                    {item.partType}@{item.component}
                  </TagBadge>
                );
              })}
            </div>
            <DataModal
              caption={t('common.crucial_component')} size="lg"
              isOpen={this.state.materialModal}
              toggle={this.materialModalToggle}
              confirm={this.materialConfirm}>
              <XwjEssentialMaterialPicker
                ref={ref => this.materialPicker = ref}
                product={this.state.product}
                materialSelected={this.state.materialSelected} />
            </DataModal>
          </FormValueColumn>
        </FormRow>

        <FormRow>
          <FormPropertyColumn md={2}>
            <BoldLabel>
              {t('dataset.data_pool.processor_activate_datetime_range')}
            </BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn md={8}>
            <InputGroup className={this.state.timeInvalid? 'border border-danger is-invalid': undefined}>
              <Flatpickr
                className="form-control form-control-sm first bg-white"
                options={{
                  time_24hr: true,
                  enableTime: true,
                  defaultDate: this.state.scheduleTimeStart,
                  dateFormat: 'Y-m-d H:i',
                  locale,
                  minuteIncrement: 30
                }}
                value={this.state.scheduleTimeStart}
                onChange={date => this.setState({ scheduleTimeStart: date[0].getTime() })} />
              <InputGroupAddon addonType="append">
                <InputGroupText><i className="fa fa-chevron-right" /></InputGroupText>
              </InputGroupAddon>
              <Flatpickr
                className="form-control form-control-sm bg-white"
                options={{
                  time_24hr: true,
                  enableTime: true,
                  defaultDate: this.state.scheduleTimeEnd,
                  dateFormat: 'Y-m-d H:i',
                  locale,
                  minuteIncrement: 30
                }}
                value={this.state.scheduleTimeEnd}
                onChange={date => this.setState({ scheduleTimeEnd: date[0].getTime() })} />
            </InputGroup>
          </FormValueColumn>
        </FormRow>
      </React.Fragment>
    );
  }

  productChangeHandler = e => {
    let product = e.target.value;
    // this.testStationPicker.fetchStationData({ product });
    this.setState({ product: isEmpty(product)? null: product });
  };

  testCaseConfirm = () => {
    let testCaseSelected = this.testCasePicker.getSelectedList();
    // console.log('testCaseSelected: ', testCaseSelected);
    this.setState({
      testCaseSelected,
      testCaseModal: false
    });
  };

  materialConfirm = () => {
    let materialSelected = this.materialPicker.getSelectedList();
    this.setState({
      materialSelected,
      materialModal: false
    });
  };

  testCaseModalToggle = () => {
    if (isEmpty(this.product.value)) {
      this.setState({ productInvalid: true });
      this.props.pushNotification(this.props.t('message.dataset.select_product'));
    } else {
      this.setState(prevState => ({ testCaseModal: !prevState.testCaseModal }));
    }
  };

  materialModalToggle = () => {
    if (isEmpty(this.product.value)) {
      this.setState({ productInvalid: true });
      this.props.pushNotification(this.props.t('message.dataset.select_product'));
    } else {
      this.setState(prevState => ({ materialModal: !prevState.materialModal }));
    }
  };

  getSubmitData() {
    let state = {
      productInvalid: isEmpty(this.product.value),
      nameInvalid: isEmpty(this.name.value),
      testCaseInvalid: (this.state.testCaseSelected.length === 0 || this.state.testCaseSelected.length > 50),
      materialInvalid: (this.state.materialSelected.length > 30),
      timeInvalid: !this.state.scheduleTimeStart || !this.state.scheduleTimeEnd
    };
    this.setState(state);
    let valid = reduce(state, (valid, isInvalid) => (valid && !isInvalid), true);
    return valid? {
      product: this.product.value,
      name: this.name.value,
      remark: this.description.value,
      dataSetStationItem: this.state.testCaseSelected.map(({station, item}) => ({ item, station })),
      dataSetPart: this.state.materialSelected.map(({partType, component}) => ({ partType, component })),
      effectiveStartDate: moment(this.state.scheduleTimeStart).format('YYYY-MM-DD HH:mm'),
      effectiveEndDate: moment(this.state.scheduleTimeEnd).format('YYYY-MM-DD HH:mm'),
    }: false;
  };
}

class XwjDatasetEditForm extends XwjDatasetCreateForm {
  componentDidMount() {
    this.fetchData().then(() => {
      // this.product.value = this.props.product;
      this.props.remark && (this.description.value = this.props.remark);
      this.name.value = this.props.name;
      this.props.toggleLoading(false);
    });
  }

  testCaseModalToggle = () => {
    this.setState(prevState => ({ testCaseModal: !prevState.testCaseModal }));
  };

  materialModalToggle = () => {
    this.setState(prevState => ({ materialModal: !prevState.materialModal }));
  };

  getSubmitData() {
    let state = {
      // productInvalid: isEmpty(this.product.value),
      nameInvalid: isEmpty(this.name.value),
      testCaseInvalid: (this.state.testCaseSelected.length === 0),
      // materialInvalid: (this.state.materialSelected.length === 0),
      timeInvalid: !this.state.scheduleTimeStart || !this.state.scheduleTimeEnd
    };
    this.setState(state);
    let valid = reduce(state, (valid, isInvalid) => (valid && !isInvalid), true);
    return valid? {
      // product: this.product.value,
      name: this.name.value,
      remark: this.description.value,
      dataSetStationItem: this.state.testCaseSelected.map(({station, item}) => ({ item, station })),
      dataSetPart: this.state.materialSelected.map(({partType, component}) => ({ partType, component })),
      effectiveStartDate: moment(this.state.scheduleTimeStart).format('YYYY-MM-DD HH:mm'),
      effectiveEndDate: moment(this.state.scheduleTimeEnd).format('YYYY-MM-DD HH:mm'),
    }: false;
  };

  // componentDidMount() {
  //   Promise.all([
  //     getProducts(),
  //     getDataset(this.props.item.id)
  //   ]).then(([products, dataset]) => {
  //     this.setState({
  //       products,
  //       dataset,
  //       product: dataset.product,
  //       testCaseSelected: dataset.dataSetStationItem,
  //       materialSelected: dataset.dataSetPart,
  //       scheduleTimeStart: moment(dataset.effectiveStartDate).toDate(),
  //       scheduleTimeEnd: moment(dataset.effectiveEndDate).toDate(),
  //     }, () => {
  //       this.product.value = dataset.product;
  //       dataset.remark && (this.description.value = dataset.remark);
  //       this.name.value = dataset.name;
  //     });
  //     this.props.toggleLoading(false);
  //   }).catch(error => {
  //     this.props.pushNotification('讀取失敗');
  //   });
  // }
}
export {
  XwjDatasetCreateForm,
  XwjDatasetEditForm
};
