import React from 'react'
import {Card, CardBody, CardHeader, Table, Button, Row, Col, Input, Label, FormText, FormGroup} from 'reactstrap'
import { queryAnalysisSet, copyAnalysisSet, deleteAnalysisSet } from '../../action/analysis-pool-action'
import DeleteConfirmModal from '../Coommon/DeleteConfirmModal'
import ConfirmModal from '../Coommon/ConfirmModal'
import {debounce, isEmpty, orderBy} from 'lodash'
import withLoading from '../../utils/hoc/withLoading'
import withNotify from "../../utils/hoc/withNotify";
import {withTranslation} from "react-i18next";
import {BoldLabel, FormPropertyColumn, FormRow, FormValueColumn} from "../Layout";

const XwjAnalysisCopy = withTranslation()(withNotify(withLoading(
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
        copyAnalysisSet(this.props.item.id, {name: this.name.value}).then(data => {
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

class XwjAnalysisList extends React.PureComponent {
  state = {
    analysisSet: [],
    copyItem: null,
    deleteItem: null,
    sortByField: 'name',
    isAscending: true,
  };

  componentDidMount() {
    this.queryAnalysisSetList()
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
    const { t } = this.props;
    let orderedAnalysisSet =
      orderBy(this.state.analysisSet, [this.state.sortByField], [this.state.isAscending? 'asc': 'desc']);
    let orderIcon = this.state.isAscending?
      (<i className="fa fa-sort-amount-asc ml-1" />): (<i className="fa fa-sort-amount-desc ml-1" />);

    return (
      <Card>
        <CardHeader className="px-4">{t('analysis_set.list')}</CardHeader>
        <CardBody>
          <FormRow>
            <FormPropertyColumn md={3}>
              <BoldLabel>
              {t('common.keyword')}
              </BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn md={4}>
              <Input
                bsSize="sm"
                placeholder={t('analysis_set.keyword_placeholder')}
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
                    {t('common.analysis_set')}{this.tableHeaderLabel('name', orderIcon)}
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
                  <a href="javascript:" className="text-dark" onClick={e => this.setOrder('dataSetName')}>
                    {t('common.dataset')}{this.tableHeaderLabel('dataSetName', orderIcon)}
                  </a>
                </th>
                <th className="border-top-0">{t('common.copy_or_delete')}</th>
              </tr>
            </thead>
            <tbody className="border-bottom">
              {orderedAnalysisSet.map((analysisSetData, index) => {
                return (
                  <tr key={index}>
                    <td className="align-middle text-center">{index + 1}</td>
                    <td className="align-middle text-center">{analysisSetData.product}</td>
                    <td className="align-middle text-center">
                      <Button color="link" onClick={e => 
                        this.toAnalysisPool(analysisSetData)
                        }>
                        {analysisSetData.name}
                      </Button>
                    </td>
                    <td className="align-middle text-center">
                      <span className="text-truncate d-inline-block" style={{maxWidth: '200px'}}>{analysisSetData.remark}</span>
                    </td>
                    <td className="align-middle text-center">{analysisSetData.dataSetName}</td>
                    <td className="align-middle text-center">
                      <Button 
                        size="sm" 
                        className="fa fa-copy mx-1" 
                        onClick={e => this.setState({ copyItem: analysisSetData })} />
                      <Button
                        size="sm"
                        className="fa fa-times mx-1"
                        onClick={e => this.setState({ deleteItem: analysisSetData })}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </CardBody>

        <XwjAnalysisCopy
          isOpen={!!this.state.copyItem}
          item={this.state.copyItem}
          confirm={this.toListViewAndReload}
          cancel={this.toListView}/>

        <DeleteConfirmModal 
          isOpen={!!this.state.deleteItem} 
          confirm={this.deleteItem} 
          cancel={this.toListView}>
          {t('analysis_set.delete_notice')}
        </DeleteConfirmModal>
      </Card>
    )
  };

  queryAnalysisSetList = () => {
    return queryAnalysisSet().then(analysisSet => {
      this.analysisSet = analysisSet;
      this.setState({ analysisSet }, this.props.toggleLoading)
    })
  };

  deleteItem = () => {
    this.props.toggleLoading(true, () => {
      this.setState({ deleteItem: null });
      deleteAnalysisSet(this.state.deleteItem.id).then(this.toListViewAndReload);
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
    this.props.toggleLoading(true, this.queryAnalysisSetList);
  };

  toAnalysisPool(analysisSetData) {
    let pathname = `/xwj/analysis/list/${analysisSetData.id}`;
    this.props.history.push({ pathname });
  };

  filterOnChangeHandler = e => {
    if (!this.compositionStart) {
      this.filter(e.target.value);
    }
  };

  filterOnCompositionStart = () => {
    this.compositionStart = true;
  };

  filterOnCompositionEnd = e => {
    this.compositionStart = false;
    this.filter(e.target.value)
  };

  filter = debounce(text => {
    this.setState({
      analysisSet: this.analysisSet.filter(item => {
        return (
          item.product.indexOf(text) > -1 ||
          item.name.indexOf(text) > -1 ||
          item.remark.indexOf(text) > -1 ||
          item.dataSetName.indexOf(text) > -1
        )
      }),
    })
  }, 500);
}

export default withTranslation()(withLoading(XwjAnalysisList, true));
