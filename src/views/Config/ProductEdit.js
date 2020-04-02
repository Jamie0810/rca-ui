import React from "react";
import {
  Button, 
  Card, 
  CardBody, 
  CardHeader, 
  CardFooter,
  Col,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from "reactstrap";
import Flatpickr from 'react-flatpickr';
import "flatpickr/dist/l10n";
import 'flatpickr/dist/themes/material_green.css';
import {getProductInformation, updateProduct} from "../../action/product-action";
import moment from 'moment';
import withNotify from "../../../src/utils/hoc/withNotify";
import {isEmpty} from "lodash";
import {withTranslation} from "react-i18next";
import {BlockLabel, BoldLabel, FormPropertyColumn, FormRow, FormValueColumn} from "../Layout";

class ProductEdit extends React.PureComponent{
  id = this.props.match.params.id;

  state = {};

  componentDidMount() {
    getProductInformation(this.id).then(({ jobStartTime, jobEndTime, isEnable = '0', ...product }) => {
      jobStartTime = moment(jobStartTime).toDate();
      jobEndTime = moment(jobEndTime).toDate();
      this[`isEnable_${isEnable}`].checked = true;
      this.setState({ jobStartTime,  jobEndTime, ...product }, this.props.toggleLoading)
    })
  };

  render() {
    const { t, i18n } = this.props;
    const locale = i18n.language.split('-')[0];

    return (
      <Card>
        <CardHeader className="px-4">
          <span>{t('product.edit')}</span>
          <div className="card-header-actions"/>
        </CardHeader>
        <CardBody>
          <FormRow>
            <FormPropertyColumn md={4}>
              <BoldLabel>{t('common.client')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn md={4}>
              <Input
                type="text" 
                bsSize="sm"
                innerRef={ref => this.customer = ref} 
                defaultValue={this.state.customer}/>
            </FormValueColumn>
          </FormRow>

          <FormRow>
            <FormPropertyColumn md={4}>
              <BoldLabel>{t('common.product')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn>
              <BlockLabel>{this.state.product}</BlockLabel>
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
                  value={this.state.jobStartTime}
                  options={{
                    time_24hr: true,
                    // defaultDate: this.state.jobStartTime,
                    dateFormat: 'Y-m-d H:i',
                    locale,
                    minuteIncrement: 30
                  }}
                  onChange={date => this.setState({ jobStartTime: date[0].getTime() })} />
                <InputGroupAddon addonType="append">
                  <InputGroupText><i className="fa fa-chevron-right" /></InputGroupText>
                </InputGroupAddon>
                <Flatpickr
                  className="form-control form-control-sm bg-white"
                  value={this.state.jobEndTime}
                  options={{
                    time_24hr: true,
                    // defaultDate: this.state.jobEndTime,
                    dateFormat: 'Y-m-d H:i',
                    locale,
                    minuteIncrement: 30
                  }}
                  onChange={date => this.setState({ jobEndTime: date[0].getTime() })} />
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
              <BoldLabel>{t('common.create_time')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn>
              <BlockLabel>{this.state.createTime}</BlockLabel>
            </FormValueColumn>
          </FormRow>

          <FormRow>
            <FormPropertyColumn md={4}>
              <BoldLabel>{t('common.modify_time')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn md={4}>
              <BlockLabel>{this.state.modifyTime}</BlockLabel>
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

  // isEnable = (e) => {
  //   this.setState({ isEnableValue: e.target.value });
  // }

  submitHandler = (e) => {
    let data = {
      // id: this.id,
      customer : isEmpty(this.customer.value)? undefined: this.customer.value,
      // product :"產品代碼",
      jobStartTime : moment(this.state.jobStartTime).format('YYYY-MM-DD'),
      jobEndTime : moment(this.state.jobEndTime).format('YYYY-MM-DD'),
      isEnable : this.state.isEnable
    };

    updateProduct(this.id, data)
      .then(() => {
        this.props.pushNotification('儲存成功！', {level: 'success'});
      })
      .catch(err => {
        this.props.pushNotification('儲存失敗');
      })
      .finally(() => this.props.toggleLoading);;
  }
}

export default withTranslation()(withNotify(ProductEdit));
