import React from "react";
import {FormText, Input} from "reactstrap";
import {getAnalysisSetInfo} from "../../action/analysis-pool-action";
import {isEmpty, reduce} from "lodash";
import {BlockLabel, BoldLabel, FormPropertyColumn, FormRow, FormValueColumn, PlainLabel} from "../Layout";
import {queryProductDatasetMapper} from "../../action/dataset-action";

class XwjAnalysisCreateForm extends React.PureComponent {
  state = {
    products: [],
    dataset: [],
    analysis: {},
    productInvalid: false,
    datasetInvalid: false,
    nameInvalid: false,
    datasetId: null,
  };
  PRODUCT_DATASET_MAPPER = {};

  fetchData() {
    return new Promise((resolve, reject) => {
      queryProductDatasetMapper().then(productDatasetMapper => {
        this.PRODUCT_DATASET_MAPPER = productDatasetMapper;
        this.setState({
          products: Object.keys(productDatasetMapper)
        }, resolve);
      }).catch(reject);
    });
  }

  componentDidMount() {
    this.fetchData().then(this.props.toggleLoading)
  }

  render() {
    const { t } = this.props;
    let isEditMode = !isEmpty(this.state.analysis);

    return (
      <React.Fragment>
        <FormRow>
          <FormPropertyColumn md={2}>
            <BoldLabel>{t('common.product')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn md={3}>
            {isEditMode? (
              <BlockLabel>{this.state.analysis.product}</BlockLabel>
            ): (
              <Input
                type="select" bsSize="sm"
                plaintext={isEditMode}
                innerRef={ref => this.product = ref}
                defaultValue={this.state.analysis.product}
                invalid={this.state.productInvalid}
                onChange={this.productChangeHandler}>
                <option value="">{t('common.choose')}</option>
                {this.state.products.map(item => {
                  return (<option key={item} value={item}>{item}</option>);
                })}
              </Input>)}
          </FormValueColumn>
          <FormPropertyColumn md={2}>
            <BoldLabel>{t('common.dataset')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn md={3}>
            {isEditMode? (
              <BlockLabel>{this.state.analysis.dataSetName}</BlockLabel>
            ): (
              <Input
                type="select" bsSize="sm"
                plaintext={isEditMode}
                defaultValue={this.state.analysis.dataSetName}
                innerRef={ref => this.dataset = ref}
                invalid={this.state.datasetInvalid}
                onChange={e => this.setState({ datasetId: e.target.value })}
              >
                <option value="">{t('common.choose')}</option>
                {this.state.dataset.map(item => {
                  return (
                    <option key={item.dsid} value={item.dsid}>{item.dataset}</option>
                  );
                })}
              </Input>)}
          </FormValueColumn>
        </FormRow>

        <FormRow>
          <FormPropertyColumn md={2}>
            <BoldLabel>{t('common.name')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn md={8}>
            <Input
              type="text" bsSize="sm"
              defaultValue={this.state.analysis.name}
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
              type="textarea" bsSize="sm" rows="6"
              defaultValue={this.state.analysis.remark}
              innerRef={ref => this.remark = ref} />
            <FormText className="help-block">{t('common.limit_1000_letters_tip')}</FormText>
          </FormValueColumn>
        </FormRow>
      </React.Fragment>
    );
  }

  productChangeHandler = e => {
    this.setState({
      dataset: this.PRODUCT_DATASET_MAPPER[e.target.value]
    })
  };

  getSubmitData() {
    let state = {
      productInvalid: isEmpty(this.product.value),
      datasetInvalid: isEmpty(this.state.datasetId),
      nameInvalid: isEmpty(this.name.value),
    };
    this.setState(state);
    let valid = reduce(state, (valid, isInvalid) => (valid && !isInvalid), true);
    if (valid) {
      return {
        dssId: this.state.datasetId,
        name: this.name.value,
        remark: this.remark.value,
      }
    } else {
      this.props.toggleLoading(false);
      return false;
    }
  };
}

class XwjAnalysisEditForm extends XwjAnalysisCreateForm {

  fetchData() {
    return new Promise((resolve, reject) => {
      Promise.all([
        getAnalysisSetInfo(this.props.id),
        super.fetchData()
      ]).then(([analysis, data]) => {
        this.setState({ analysis }, resolve);
      }).catch(reject);
    });
  };

  render() {
    const { t } = this.props;
    let BasicFormBody = super.render.bind(this);

    return (
      <React.Fragment>
        <BasicFormBody/>

        <FormRow>
          <FormPropertyColumn md={2}>
            <BoldLabel>{t('common.creator')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn md={3}>
            <BlockLabel>{this.state.analysis.createUser}</BlockLabel>
          </FormValueColumn>
          <FormPropertyColumn md={2}>
            <BoldLabel>{t('common.create_time')}</BoldLabel>
          </FormPropertyColumn>
          <FormValueColumn md={3}>
            <BlockLabel>{this.state.analysis.createTime}</BlockLabel>
          </FormValueColumn>
        </FormRow>
      </React.Fragment>
    );
  }

  getSubmitData() {
    let state = {
      nameInvalid: isEmpty(this.name.value),
    };
    this.setState(state);
    let valid = reduce(state, (valid, isInvalid) => (valid && !isInvalid), true);
    if (valid) {
      return {
        id: this.props.id,
        name: this.name.value,
        remark: this.remark.value,
      }
    } else {
      this.props.toggleLoading(false);
      return false;
    }
  };
}

export {
  XwjAnalysisCreateForm,
  XwjAnalysisEditForm
};
