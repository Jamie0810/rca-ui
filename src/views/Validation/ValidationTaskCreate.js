import React from "react";
import {
  Button, 
  Card, 
  CardBody, 
  CardHeader, 
  Input,
  CardFooter,
} from "reactstrap";
import {reduce, without} from "lodash";
import withNotify from "../../utils/hoc/withNotify";
import {withTranslation} from "react-i18next";
import {BoldLabel, FormPropertyColumn, FormRow, FormValueColumn} from "../Layout";
import {getProductNames} from "../../action/product-action";
import {createValidationTask} from "../../action/validation-action";
import withLoading from "../../utils/hoc/withLoading";

class ValidationTaskCreate extends React.PureComponent{
  state = {
    products: [],
    snListInvalid: false,
  };

  componentDidMount () {
    getProductNames().then(products => {
      this.setState({ products }, this.props.toggleLoading)
    })
  }

  render() {
    const { t } = this.props;
    return (
      <React.Fragment>
        <Card>
          <CardHeader className="px-4">
            <span>{t('validation.create')}</span>
          </CardHeader>
          <CardBody>
            <FormRow>
              <FormPropertyColumn md={4}>
                <BoldLabel>{t('common.product')}</BoldLabel>
              </FormPropertyColumn>
              <FormValueColumn md={4}>
                <Input
                  type="select" name="product" bsSize="sm"
                  innerRef={ref => this.product = ref}
                >
                  {this.state.products.map(item => (
                    <option value={item} key={item}>{item}</option>
                  ))}
                </Input>
              </FormValueColumn>
            </FormRow>

            <FormRow>
              <FormPropertyColumn md={4}>
                <BoldLabel>{t('common.sn')}</BoldLabel>
              </FormPropertyColumn>
              <FormValueColumn md={4}>
                <Input
                  invalid={this.state.snListInvalid}
                  type="textarea"
                  bsSize="sm"
                  rows="6"
                  innerRef={ref => this.snList = ref} />
              </FormValueColumn>
            </FormRow>
          </CardBody>
          <CardFooter className="text-right pr-5">
            <Button 
              type="button"   
              color="primary" 
              size="sm" 
              onClick={()=>this.submitHandler()} >
              <i className="fa fa-dot-circle-o mr-1" />{t('common.create')}
            </Button>
        </CardFooter>
        </Card>
      </React.Fragment>
    );
  }

  submitHandler(){
    let snList = without(this.snList.value.trim().split(/[^0-9a-zA-Z]+/gm), '');
    let state = {
      snListInvalid: (snList.length === 0)
    };
    this.setState(state);
    let valid = reduce(state, (valid, isInvalid) => (valid && !isInvalid), true);

    if (valid) {
      this.props.toggleLoading(true);
      let data = {
        product: this.product.value,
        snList: snList.join(',')
      };
      // console.log(data);
      createValidationTask(data)
        .then(data => this.props.history.push('/fdj/validation'))
        .catch(
          error => this.props.toggleLoading(false,
            () => this.props.pushNotification(this.props.t('message.system.create_failed'))));
    }
  }
}

export default withTranslation()(withNotify(withLoading(ValidationTaskCreate, true)));
