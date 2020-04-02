import React from "react";
import {
  Button, 
  Card, 
  CardBody, 
  CardHeader, 
  CardFooter,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from "reactstrap";
import Flatpickr from 'react-flatpickr';
import "flatpickr/dist/l10n";
import 'flatpickr/dist/themes/material_green.css';
import moment from 'moment';
import { createNewProduct, getProductNames } from "../../action/product-action";
import {isEmpty, map, reduce, keys} from 'lodash';
import withNotify from "../../utils/hoc/withNotify";
import withLoading from "../../utils/hoc/withLoading";
import {withTranslation} from "react-i18next";
import {BoldLabel, FormPropertyColumn, FormRow, FormValueColumn} from "../Layout";

const REF_CODE_MAPPER_OPTIONS = {
  1: 'product.ref_config_options.component_code',
  2: 'product.ref_config_options.shift',
  3: 'product.ref_config_options.station',
  4: 'product.ref_config_options.component',
  5: 'product.ref_config_options.label_code'
};

class ProductCreate extends React.PureComponent{
  state = {
    // prodId: '1',
    timeStart: moment().startOf('day').valueOf(),
    timeEnd: moment().add('year', 1).startOf('day').valueOf(),
    referProduct: [],
    isEnable: "1",
    productInvalid: false,
    // customerInvalid: false,
    referProductInvalid: false
  };

  componentDidMount () {
    getProductNames().then(referProduct => {
      this[`isEnable_${this.state.isEnable}`].checked = true;
      this.setState({ referProduct }, this.props.toggleLoading)
    })
  }

  render() {
    const { t, i18n } = this.props;
    const locale = i18n.language.split('-')[0];

    return (
      <Card>
        <CardHeader className="px-4">
          <span>{t('product.create')}</span>
          <div className="card-header-actions"/>
        </CardHeader>
        <CardBody>
          <FormRow>
            <FormPropertyColumn md={4}>
              <BoldLabel>{t('common.client')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn md={4}>
              <Input
                type="text" bsSize="sm"
                // invalid={this.state.customerInvalid}
                innerRef={ref => this.customer = ref} />
            </FormValueColumn>
          </FormRow>

          <FormRow>
            <FormPropertyColumn md={4}>
              <BoldLabel>{t('common.product')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn md={4}>
              <Input
                bsSize="sm"
                invalid={this.state.productInvalid}
                innerRef={ref => this.product = ref} />
            </FormValueColumn>
          </FormRow>

          <FormRow>
            <FormPropertyColumn md={4}>
              <BoldLabel>{t('product.data_collect_work_datetime')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn md={4}>
              <InputGroup>
                <Flatpickr
                  className="form-control form-control-sm first bg-white"
                  options={{
                    time_24hr: true,
                    defaultDate: this.state.timeStart,
                    dateFormat: 'Y-m-d',
                    locale
                  }}
                  onChange={date => this.setState({ timeStart: date[0].getTime() })} />
                <InputGroupAddon addonType="append">
                  <InputGroupText><i className="fa fa-chevron-right" /></InputGroupText>
                </InputGroupAddon>
                <Flatpickr
                  className="form-control form-control-sm bg-white"
                  options={{
                    time_24hr: true,
                    defaultDate: this.state.timeEnd,
                    dateFormat: 'Y-m-d',
                    locale
                  }}
                  onChange={date => this.setState({ timeEnd: date[0].getTime() })} />
              </InputGroup>
            </FormValueColumn>
          </FormRow>

          <FormRow>
            <FormPropertyColumn md={4}>
              <BoldLabel>{t('product.collect')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn>
              <Label className="form-check">
                <Input
                  type="radio"
                  name="isEnable"
                  className="form-check-input"
                  innerRef={ref => this.isEnable_1 = ref}
                  onClick={e => this.setState({ isEnable: '1' })}/>{t('common.activate')}</Label>
              <Label className="form-check">
                <Input
                  type="radio"
                  name="isEnable"
                  className="form-check-input"
                  innerRef={ref => this.isEnable_0 = ref}
                  onClick={e => this.setState({ isEnable: '0' })}/>{t('common.suspend')}</Label>
            </FormValueColumn>
          </FormRow>

          <FormRow>
            <FormPropertyColumn md={4}>
              <BoldLabel>{t('product.ref_product')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn md={4}>
              <Input
                type="select"  
                bsSize="sm"
                invalid={this.state.referProductInvalid}
                innerRef={ref => this.referProduct = ref}>
                <option value="">{t('common.choose')}</option>
                {
                  map(this.state.referProduct, (item) => {
                    return (<option key={item} value={item}>{item}</option>)
                  })
                }
              </Input>
            </FormValueColumn>
          </FormRow>

          <FormRow>
            <FormPropertyColumn md={4}>
              <BoldLabel>{t('product.ref_config')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn md={6}>
              {
                map(REF_CODE_MAPPER_OPTIONS, (label, key) => (
                  <Label className="form-check" key={key}>
                    <Input
                      type="checkbox" className="form-check-input" value={key} defaultChecked={true}
                      innerRef={ref => this[`referCode${key}`] = ref}/>{t(label)}
                  </Label>
                ))
              }
            </FormValueColumn>
          </FormRow>
        </CardBody>
        <CardFooter className="text-right pr-5">
          <Button 
            type="button"   
            color="primary"
            size="sm"
            onClick={this.submitHandler} >
            <i className="fa fa-dot-circle-o mr-1" />{t('common.save')}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  submitHandler = () => {
    let state = {
      productInvalid: isEmpty(this.product.value.trim()),
      // customerInvalid: isEmpty(this.customer.value.trim()),
      referProductInvalid: isEmpty(this.referProduct.value),
    };

    this.setState(state);
    let valid = reduce(state, (valid, isInvalid) => (valid && !isInvalid), true);

    if (valid) {
      let data = {
        customer: isEmpty(this.customer.value)? undefined: this.customer.value,
        product: this.product.value,
        jobStartTime: moment(this.state.timeStart).format('YYYY-MM-DD'),
        jobEndTime: moment(this.state.timeEnd).format('YYYY-MM-DD'),
        isEnable: this.state.isEnable,
        referProduct: this.referProduct.value,
        referType: keys(REF_CODE_MAPPER_OPTIONS).filter(key => (this[`referCode${key}`].checked))
      };

      // console.log(data);
      createNewProduct(data).then(data => {
        this.props.history.push(`/configuration/products/${data.id}`);
      }).catch(error => {
        this.props.toggleLoading(false, () => {
          this.props.pushNotification(this.props.t('message.system.create_failed'))
        });
      });
    }
  };
}

export default withTranslation()(withLoading(withNotify(ProductCreate), true));
