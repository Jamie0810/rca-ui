import React from "react";
import {Button, Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Table} from "reactstrap";
import {debounce, filter, isEmpty, map, orderBy, uniq} from "lodash";
import {getProducts, getValidationRecords} from "../../action/product-action";
import withLoading from "../../utils/hoc/withLoading";
import DataModal from "../Coommon/DataModal";
import withNotify from "../../utils/hoc/withNotify";
import moment from "moment";
import {withTranslation} from "react-i18next";
import {BoldLabel, FormPropertyColumn, FormRow, FormValueColumn} from "../Layout";

const ValidateDailyRecords = withTranslation()(withLoading(withNotify(
  class extends React.PureComponent {
    state = {
      records: []
    };

    componentDidMount() {
      getValidationRecords(this.props.item.id)
        .then(records => this.setState({ records }))
        .catch(error => this.props.pushNotification(this.props.t('message.system.load_failed')))
        .finally(this.props.toggleLoading);
    }

    render() {
      const { t } = this.props;
      return (
        <Table className="nowrap" responsive hover>
          <thead>
          <tr className="text-center">
            <th className="border-top-0">{t('product.validation.validate_date')}</th>
            <th className="border-top-0">{t('product.validation.ftp_source_data_format')}</th>
            <th className="border-top-0">{t('product.validation.product_configuration')}</th>
            <th className="border-top-0">{t('product.validation.summary_data_format')}</th>
          </tr>
          </thead>
          <tbody>
          {
            this.state.records.map((record, index) => (
              <tr key={index} className="text-center">
                <td className="align-middle">{moment(record.createTime).format('YYYY-MM-DD')}</td>
                <td className="align-middle">{record.FTP}</td>
                <td className="align-middle">{record.productSetup}</td>
                <td className="align-middle">{record.SummaryFile}</td>
              </tr>
            ))
          }
          </tbody>
        </Table>
      );
    };
  }
), true));

class Products extends React.PureComponent{
  state = {
    products: [],
    customers: [],
    sortByField: 'customer',
    isAscending: true,
  };

  componentDidMount() {
    this.queryItems();
  }

  render() {
    const { t } = this.props;
    let products =
      orderBy(this.state.products, [this.state.sortByField], [this.state.isAscending? 'asc': 'desc']);
    let orderIcon = this.state.isAscending?
      (<i className="fa fa-sort-amount-asc ml-1" />): (<i className="fa fa-sort-amount-desc ml-1" />);

    return (
      <Card>
        <CardHeader className="px-4">
          <span>{t('product.list')}</span>
          <div className="card-header-actions">
            <Button
              color="link"
              className="card-header-action"
              onClick={e => this.props.history.push('/configuration/products/create')}>
              <i className="fa fa-plus fa-lg" />
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <FormRow>
            <FormPropertyColumn md={3}>
              <BoldLabel>{t('common.product')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn md={4}>
              <Input
                bsSize="sm"
                innerRef={ref => this.product = ref}
                onChange={this.filterOnChangeHandler}
                onCompositionStart={this.filterOnCompositionStart}
                onCompositionEnd={this.filterOnCompositionEnd}
              />
            </FormValueColumn>
          </FormRow>
          <FormRow>
            <FormPropertyColumn md={3}>
              <BoldLabel>{t('common.client')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn md={4}>
              <Input
                type="select" name="category" bsSize="sm"
                innerRef={ref => this.customer = ref}
                onChange={this.doFilter}
              >
                <option value="">{t('common.choose')}</option>
                {map(this.state.customers, (value, index) => (<option value={value} key={index}>{value}</option>))}
              </Input>
            </FormValueColumn>
          </FormRow>

          <Table className="nowrap" responsive hover>
            <thead>
            <tr className="text-center">
              <th className="border-top-0">{t('common.serial')}</th>
              <th className="border-top-0">
                <a href="javascript:" className="text-dark" onClick={e => this.setOrder('customer')}>
                  {t('common.client')}{this.tableHeaderLabel('customer', orderIcon)}
                </a>
              </th>
              <th className="border-top-0">
                <a href="javascript:" className="text-dark" onClick={e => this.setOrder('product')}>
                  {t('common.product')}{this.tableHeaderLabel('product', orderIcon)}
                </a>
              </th>
              <th className="border-top-0">
                <a href="javascript:" className="text-dark" onClick={e => this.setOrder('isEnable')}>
                  {t('product.collect')}{this.tableHeaderLabel('isEnable', orderIcon)}
                </a>
              </th>
              <th className="border-top-0">
                <a href="javascript:" className="text-dark" onClick={e => this.setOrder('verifyResult')}>
                  {t('product.validation.validate_result')}{this.tableHeaderLabel('verifyResult', orderIcon)}
                </a>
              </th>
            </tr>
            </thead>
            <tbody className="border-bottom">
            {products.map((item, index) => (
              <tr key={item.product} className="text-center">
                <td className="align-middle">{index + 1}</td>
                <td className="align-middle">{item.customer}</td>
                <td className="align-middle">
                  <Button
                    color="link"
                    onClick={e => this.props.history.push({ pathname: `/configuration/products/${item.id}` })}>
                    {item.product}
                  </Button>
                </td>
                <td className="align-middle">
                  {item.isEnable === '1' ? t('common.activate') : t('common.suspend')}
                </td>
                <td className="align-middle">{(item.verifyResult === 0?
                  (`Fail: ${item.verifyResult}`):
                  (<Button
                    color="link"
                    onClick={e => this.setState({ revealItem: item })}>
                    {`Fail: ${item.verifyResult}`}
                  </Button>))}</td>
              </tr>
            ))}
            </tbody>
          </Table>
          <DataModal
            isOpen={!!this.state.revealItem}
            caption={t('product.validation.history_in_7_days')}
            toggle={() => this.setState({ revealItem: null })}>

            <ValidateDailyRecords item={this.state.revealItem}/>

          </DataModal>
        </CardBody>
      </Card>
    );
  }

  setOrder = sortByField => {
    let isAscending = this.state.isAscending;
    if (this.state.sortByField === sortByField) {
      isAscending = !isAscending;
    } else {
      this.setState({ sortByField });
    }
    let codeGroupList = this.sortList(this.state.codeGroupList, sortByField, isAscending);

    this.setState({ isAscending, sortByField, codeGroupList });
  };

  sortList = (codeGroupList, sortByField, isAscending) => {
    return orderBy(codeGroupList, [sortByField], [isAscending? 'asc': 'desc']);
  };

  tableHeaderLabel = (propertyName, icon) => {
    if (this.state.sortByField === propertyName) {
      return icon;
    }
    return null;
  };

  queryItems = () => {
    getProducts()
      .then(products => {
        this.products = products;
        let customers = uniq(map(products, 'customer'));
        this.setState({ customers, products }, this.props.toggleLoading)
      })
      .catch(this.props.toggleLoading);
  };

  filterOnChangeHandler = e => {
    if (!this.compositionStart) {
      this.doFilter();
    }
  };

  filterOnCompositionStart = () => {
    this.compositionStart = true;
  };

  filterOnCompositionEnd = e => {
    this.compositionStart = false;
    this.doFilter()
  };

  doFilter = debounce(() => {
    this.props.toggleLoading(true);

    let criteria = {};
    // if (!isEmpty(this.product.value)) (criteria.codeProduct = this.product.value);
    if (!isEmpty(this.customer.value)) (criteria.customer = this.customer.value);
    //
    // let products = this.products;
    // if (!isEmpty(criteria)) {
    //   let products = filter(products, criteria);
    // }
    let products = filter(this.products, criteria);

    let keyword = this.product.value;

    if (!isEmpty(keyword)) {
      products = products
        .filter(product => (product.product.indexOf(keyword) >= 0));
    }

    // products = this.sortList(products, this.state.sortByField, this.state.isAscending);

    this.setState({ products }, this.props.toggleLoading);
  }, 400);
}

export default withTranslation()(withLoading(Products, true));
