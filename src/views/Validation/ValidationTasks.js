import React from "react";
import {Button, Card, CardBody, CardHeader, Input, Table} from "reactstrap";
import { getValidationTasks, deleteValidationTask} from "../../action/validation-action";
import withLoading from "../../utils/hoc/withLoading";
import DeleteConfirmModal from "../Coommon/DeleteConfirmModal";
import {debounce, orderBy, map, filter, isEmpty } from "lodash";
import DataModal from "../Coommon/DataModal";
import withNotify from "../../utils/hoc/withNotify";
import {withTranslation} from "react-i18next";
import {BoldLabel, FormPropertyColumn, FormRow, FormValueColumn} from "../Layout";
import ValidationReveal from "../RCA/Validation/ValidationReveal";

class ValidationTasks extends React.PureComponent{

  state = {
    products: [],
    tasks: [],
    revealItem: null,
    deleteItem: null,
    sortByField: 'createTime',
    isAscending: true,
    SNDetailModal: false,
    sn: null
  };

  componentDidMount () {
    this.queryValidation()
  };

  tableHeaderLabel = (propertyName, icon) => {
    if (this.state.sortByField === propertyName) {
      return icon;
    }
    return null;
  };

  setOrder = sortByField => {
    if (this.state.sortByField === sortByField) {
      this.setState(prevState => ({ isAscending: !prevState.isAscending }));
    } else {
      this.setState({ sortByField });
    }
  };

  render() {
    // let products = this.state.products.filter(function(element, index, arr){
    //   return arr.indexOf(element) === index;
    // });
    const { t } = this.props;
    let tasks =
      orderBy(this.state.tasks, [this.state.sortByField], [this.state.isAscending? 'asc': 'desc']);
    let orderIcon = this.state.isAscending?
    (<i className="fa fa-sort-amount-asc ml-1" />): (<i className="fa fa-sort-amount-desc ml-1" />);
    return (
      <React.Fragment>
        <Card>
          <CardHeader className="px-4">
            <span>{t('validation.list')}</span>
            <div className="card-header-actions">
              <Button
                color="link"
                className="card-header-action"
                onClick={e => this.props.history.push('/fdj/validation/create')}>
                <i className="fa fa-plus fa-lg" />
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <FormRow>
              <FormPropertyColumn md={4}>
                <BoldLabel>{t('common.product')}</BoldLabel>
              </FormPropertyColumn>
              <FormValueColumn md={4}>
                <Input
                  type="select" 
                  name="product" 
                  bsSize="sm"
                  innerRef={ref => this.product = ref}
                  onChange={this.filter}>
                  <option value="">{t('common.choose')}</option>
                  {this.state.products.map((item, index) =>
                    (<option value={item} key={index}>{item}</option>)
                  )}
                </Input>
              </FormValueColumn>
            </FormRow>

            <FormRow>
              <FormPropertyColumn md={4}>
                <BoldLabel>{t('validation.serial_number')}</BoldLabel>
              </FormPropertyColumn>
              <FormValueColumn md={4}>
                <Input
                  bsSize="sm"
                  innerRef={ref => this.sn = ref}
                  onChange={this.filterOnChangeHandler}
                  onCompositionStart={this.filterOnCompositionStart}
                  onCompositionEnd={this.filterOnCompositionEnd}
                />
              </FormValueColumn>
            </FormRow>

            <Table className="nowrap" responsive hover>
              <thead>
              <tr className="text-center">
                <th className="border-top-0">
                  {t('common.serial')}
                </th>
                <th className="border-top-0">
                  <a href="javascript:" className="text-dark" onClick={e => this.setOrder('product')}>
                    {t('common.product')}
                    {this.tableHeaderLabel('product', orderIcon)}
                  </a>
                </th>
                <th className="border-top-0">
                  <a href="javascript:" className="text-dark" onClick={e => this.setOrder('sn')}>
                    {t('validation.serial_number')}
                    {this.tableHeaderLabel('sn', orderIcon)}
                  </a>
                </th>
                <th className="border-top-0">
                  <a href="javascript:" className="text-dark" onClick={e => this.setOrder('verifyResult')}>
                    {t('validation.result')}
                    {this.tableHeaderLabel('verifyResult', orderIcon)}
                  </a>
                </th>
                <th className="border-top-0">
                  <a href="javascript:" className="text-dark" onClick={e => this.setOrder('createTime')}>
                    {t('common.create_time')}
                    {this.tableHeaderLabel('createTime', orderIcon)}
                  </a>
                </th>
                <th className="border-top-0">
                  <a href="javascript:" className="text-dark" onClick={e => this.setOrder('verifyTime')}>
                    {t('validation.validate_time')}
                    {this.tableHeaderLabel('verifyTime', orderIcon)}
                  </a>
                </th>
                <th className="border-top-0">
                  {t('common.delete')}
                </th>
              </tr>
              </thead>
              <tbody className="border-bottom">
              {tasks.map((product, index) => {
                return (
                  <tr key={index}>
                    <td className="text-center align-middle">{index + 1}</td>
                    <td className="align-middle text-center">{product.product}</td>
                    <td className="align-middle text-center">
                      <Button 
                        color="link" 
                        // onClick={e => this.setState({ revealItem: product })}>
                        onClick={e => this.SNDetailModalToggle(product.sn)}>
                        {product.sn}
                      </Button>
                    </td>
                    <td className="align-middle text-center">{product.verifyResult}</td>
                    <td className="align-middle text-center">{product.createTime}</td>
                    <td className="align-middle text-center">{product.verifyTime}</td>
                    <td className="align-middle text-center">
                      <Button
                        size="sm"
                        className="fa fa-times mx-1"
                        onClick={e => this.setState({ deleteItem: product })}
                      />
                    </td>
                  </tr>
                )
              })}
              </tbody>
            </Table>
          </CardBody>
        </Card>
        <DataModal
          size="xl"
          caption={t('common.reveal')}
          isOpen={this.state.SNDetailModal}
          toggle={this.SNDetailModalToggle}
          confirm={this.SNDetailModalConfirm}>
          <ValidationReveal sn={this.state.sn}/>
        </DataModal>

        <DeleteConfirmModal
          isOpen={!!this.state.deleteItem}
          confirm={this.deleteItem}
          cancel={this.toListView}>
          {t('message.validation.delete')}
        </DeleteConfirmModal>
      </React.Fragment>
    );
  }

  SNDetailModalToggle = (sn) => {
    this.setState(prevState => ({ 
      SNDetailModal: !prevState.SNDetailModal, sn
    }));
  };

  SNDetailModalConfirm = () => {
    this.setState({
      SNDetailModal: false
    });
  };

  deleteItem = () => {
    this.props.toggleLoading(true, () => {
      this.setState({ deleteItem: null });
      deleteValidationTask(this.state.deleteItem.id).then(this.toListViewAndReload);
    });
  };

  toListView = () => {
    this.setState({
      deleteItem: null,
      copyItem: null,
    })
  };

  toListViewAndReload = () => {
    this.toListView();
    this.props.toggleLoading(true, this.queryValidation);
  };

  queryValidation = () => {
    getValidationTasks()
      .then(tasks => {
        this.tasks = tasks;
        let products = map(tasks, 'product');
        this.setState({ products, tasks });
      })
      .catch(error => this.props.pushNotification(this.props.t('message.system.error')))
      .finally(this.props.toggleLoading);
  };

  filterOnChangeHandler = e => {
    if (!this.compositionStart) {
      this.filter();
    }
  };

  filterOnCompositionStart = () => {
    this.compositionStart = true;
  };

  filterOnCompositionEnd = e => {
    this.compositionStart = false;
    this.filter()
  };
  
  filter = debounce(() => {
    let criteria = {};
    if (!isEmpty(this.product.value)) (criteria.product = this.product.value);
    let tasks = filter(this.tasks, criteria);
    let keyword = this.sn.value;
    if (!isEmpty(keyword)) {
      tasks = tasks
        .filter(product => (product.sn.indexOf(keyword) >= 0));
    }
    this.setState({ tasks }, this.props.toggleLoading);
  }, 500);
}

export default withTranslation()(withLoading(withNotify(ValidationTasks), true));
