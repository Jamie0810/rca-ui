import React, {Component} from 'react';
import {debounce, isEmpty, orderBy} from 'lodash';
import DeleteConfirmModal from '../Coommon/DeleteConfirmModal';
import {
  Card, CardBody, CardHeader, Table, Button, Row, Col, Input, Label, FormGroup
} from "reactstrap";
import {copyDataset, deleteDataset, queryDataset} from "../../action/dataset-action";
import withLoading from "../../utils/hoc/withLoading";
import withNotify from "../../utils/hoc/withNotify";
import ConfirmModal from "../Coommon/ConfirmModal";
import {withTranslation} from "react-i18next";
import {BoldLabel, FormPropertyColumn, FormRow, FormValueColumn} from "../Layout";

const DatasetCopyModal = withTranslation()(withNotify(withLoading(
  class extends React.PureComponent {
    state = {
      nameInvalid: false
    };

    render() {
      const { t } = this.props;

      return (
        <ConfirmModal
          isOpen={this.props.isOpen}
          confirm={this.confirm}
          cancel={this.props.cancel}>
          {(this.props.item)? (
            <FormRow>
              <FormPropertyColumn md={2}>
                <BoldLabel>{t('common.name')}</BoldLabel>
              </FormPropertyColumn>
              <FormValueColumn>
                <Input
                  type="text" bsSize="sm" rows="6"
                  invalid={this.state.nameInvalid}
                  defaultValue={t('common.copy_of', {name: this.props.item.name})}
                  innerRef={ref => this.name = ref} />
              </FormValueColumn>
            </FormRow>
          ): null}
        </ConfirmModal>
      );
    };

    confirm = () => {
      let nameInvalid = isEmpty(this.name.value);
      this.setState({ nameInvalid });

      if (!nameInvalid) {
        this.props.toggleLoading(true);
        copyDataset(this.props.item.id, { name: this.name.value }).then(data => {
          this.props.confirm();
        }).catch(error => {
          this.props.toggleLoading(false);
          this.props.pushNotification(this.props.t('message.system.error'));
        });
        // this.props.confirm(this.props.item.id, this.name.value);
      }
    };
  }
)));

class XwjDataset extends Component {
  state = {
    dataset: [],
    sortByField: 'btLastTime',
    isAscending: false,
    deleteItem: null,
    copyItem: null,
  };

  componentDidMount () {
    this.queryDatasetList();
  }

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

  render () {
    const { t } = this.props;
    let orderedDataset =
      orderBy(this.state.dataset, [this.state.sortByField], [this.state.isAscending? 'asc': 'desc']);
    let orderIcon = this.state.isAscending?
      (<i className="fa fa-sort-amount-asc ml-1" />): (<i className="fa fa-sort-amount-desc ml-1" />);

    return (
      <Card>
        <CardHeader className="px-4">
          {t('dataset.list')}
        </CardHeader>
        <CardBody>
          <FormRow>
            <FormPropertyColumn md={3}>
              <BoldLabel>{t('common.keyword')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn md={4}>
              <Input
                bsSize="sm"
                placeholder={t('dataset.keyword_placeholder')}
                onChange={this.filterOnChangeHandler}
                onCompositionStart={this.filterOnCompositionStart}
                onCompositionEnd={this.filterOnCompositionEnd}
              />
            </FormValueColumn>
          </FormRow>
          <Table className="nowrap mt-3" responsive hover>
            <thead>
            <tr className="text-center">
              <th className="border-top-0">{t('common.serial')}</th>
              <th className="border-top-0">
                {/* eslint-disable-next-line no-script-url */}
                <a href="javascript:" className="text-dark" onClick={e => this.setOrder('product')}>
                  {t('common.product')}{this.tableHeaderLabel('product', orderIcon)}
                </a>
              </th>
              <th className="border-top-0">
                {/* eslint-disable-next-line no-script-url */}
                <a href="javascript:" className="text-dark" onClick={e => this.setOrder('name')}>
                  {t('common.dataset')}{this.tableHeaderLabel('name', orderIcon)}
                </a>
              </th>
              <th className="border-top-0">
                {/* eslint-disable-next-line no-script-url */}
                <a href="javascript:" className="text-dark" onClick={e => this.setOrder('remark')}>
                  {t('common.description')}{this.tableHeaderLabel('remark', orderIcon)}
                </a>
              </th>
              <th className="border-top-0">
                {/* eslint-disable-next-line no-script-url */}
                <a href="javascript:" className="text-dark" onClick={e => this.setOrder('createUser')}>
                  {t('common.creator')}{this.tableHeaderLabel('createUser', orderIcon)}
                </a>
              </th>
              <th className="border-top-0">
                {/* eslint-disable-next-line no-script-url */}
                <a href="javascript:" className="text-dark" onClick={e => this.setOrder('btLastTime')}>
                  {t('dataset.data_pool.last_update_datetime')}{this.tableHeaderLabel('btLastTime', orderIcon)}
                </a>
              </th>
              <th className="border-top-0">
                {/* eslint-disable-next-line no-script-url */}
                <a href="javascript:" className="text-dark" onClick={e => this.setOrder('btNextTime')}>
                  {t('dataset.data_pool.next_update_datetime')}{this.tableHeaderLabel('btNextTime', orderIcon)}
                </a>
              </th>
              <th className="border-top-0">{t('common.copy_or_delete')}</th>
            </tr>
            </thead>
            <tbody className="border-bottom">
            {
              orderedDataset.map((data, index) => {
                return (
                  <tr key={data.id}>
                    <td className="align-middle text-center">{index+1}</td>
                    <td className="align-middle text-center">{data.product}</td>
                    <td className="align-middle text-center">
                      <Button color="link" onClick={e =>
                        this.toDatasetPool(data.id)
                      }>
                        {data.name}
                      </Button>
                    </td>
                    <td className="align-middle text-center">
                      <span className="text-truncate d-inline-block" style={{maxWidth: '200px'}}>{data.remark}</span>
                    </td>
                    <td className="align-middle text-center">{data.createUser}</td>
                    <td className="align-middle text-center">{data.btLastTime}</td>
                    <td className="align-middle text-center">{data.btNextTime}</td>
                    <td className="align-middle text-center">
                      <Button
                        size="sm" className="fa fa-copy mx-1"
                        onClick={e => this.setState({ copyItem: data })} />
                      <Button
                        size="sm" className="fa fa-times mx-1"
                        onClick={e => this.setState({ deleteItem: data })} />
                    </td>
                  </tr>
                );
              })
            }
            </tbody>
          </Table>
        </CardBody>

        <DatasetCopyModal
          isOpen={!!this.state.copyItem}
          item={this.state.copyItem}
          confirm={this.toListViewAndReload}
          cancel={this.toListView}/>

        {/* confirm delete dataset */}
        <DeleteConfirmModal
          isOpen={!!this.state.deleteItem}
          confirm={this.deleteItem}
          cancel={this.toListView}>
          {this.state.deleteItem?
            t('dataset.data_pool.confirm_delete_message', {count: this.state.deleteItem.caseCount}):
            null}
        </DeleteConfirmModal>
      </Card>
    );
  }

  toDatasetPool = id => {
    let pathname = `/xwj/dataset/list/${id}`;
    this.props.history.push({ pathname });
  };

  queryDatasetList = () => {
    return queryDataset().then(dataset => {
      this.dataset = dataset;
      this.setState({ dataset }, this.props.toggleLoading)
    });
  };

  deleteItem = () => {
    this.props.toggleLoading(true, () => {
      this.setState({ deleteItem: null });
      deleteDataset(this.state.deleteItem.id).then(this.toListViewAndReload);
    });
  };

  toListView = () => {
    this.setState({
      deleteItem: null,
      copyItem: null,
    });
  };

  toListViewAndReload = () => {
    this.toListView();
    this.props.toggleLoading(true, this.queryDatasetList);
  };

  filterOnChangeHandler = (e) => {
    if (!this.compositionStart) {
      this.filter(e.target.value);
    }
  };

  filterOnCompositionStart = () => { 
    this.compositionStart = true; 
  };

  filterOnCompositionEnd = (e) => {
    this.compositionStart = false;
    this.filter(e.target.value);
  };

  filter = debounce(text => {
    this.setState({
      dataset: this.dataset.filter(item => {
        return item.product.indexOf(text) > -1 || item.name.indexOf(text) > -1 ||
          item.remark.indexOf(text) > -1 || item.createUser.indexOf(text) > -1;
      })
    });
  }, 500);
}

export default withTranslation()(withNotify(withLoading(XwjDataset, true)));
