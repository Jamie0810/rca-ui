import React from "react";
import {
  XwjAnalysisPoolIAO_Panel,
  XwjAnalysisPoolIAO_PanelBody,
  XwjAnalysisPoolIAO_PanelHeader
} from "./XwjAnalysisPoolIAO_Panel";
import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Table} from "reactstrap";
import {isEmpty, map} from 'lodash';
import XwjAnalysisPoolIAO_MatrixConfigByTime from "./XwjAnalysisPoolIAO_MatrixConfigByTime";
import XwjAnalysisPoolIAO_MatrixConfigByMaterial from "./XwjAnalysisPoolIAO_MatrixConfigByMaterial";
import DataModal from "../Coommon/DataModal";
import {deleteMatrix, queryMatrix} from "../../action/analysis-pool-action";
import DeleteConfirmModal from "../Coommon/DeleteConfirmModal";
import XwjAnalysisPoolIAO_MatrixRevealByTime from "./XwjAnalysisPoolIAO_MatrixRevealByTime";
import XwjAnalysisPoolIAO_MatrixRevealByMaterial from "./XwjAnalysisPoolIAO_MatrixRevealByMaterial";
import {Link} from "react-router-dom";
import {withTranslation} from "react-i18next";

class XwjAnalysisPoolIAO_Matrix extends React.PureComponent {
  state = {
    matrixList: [],
    dropdownOpen: false,
    modal: null,
    revealItem: null,
    deleteItem: null
  };

  MATRIX_ITEMS = {
    NORMAL_DISTRIBUTION_BY_TIME: 1,
    NORMAL_DISTRIBUTION_BY_MATERIAL: 2,
  };

  MATRIX_OPTIONS = {
    [this.MATRIX_ITEMS.NORMAL_DISTRIBUTION_BY_TIME]: 'analysis_set.matrix.trend_of_test_item',
    // [this.MATRIX_ITEMS.NORMAL_DISTRIBUTION_BY_MATERIAL]: 'analysis_set.matrix.component_pairing',
  };

  MATRIX_CONFIG_COMPONENT = {
    [this.MATRIX_ITEMS.NORMAL_DISTRIBUTION_BY_TIME]: XwjAnalysisPoolIAO_MatrixConfigByTime,
    [this.MATRIX_ITEMS.NORMAL_DISTRIBUTION_BY_MATERIAL]: XwjAnalysisPoolIAO_MatrixConfigByMaterial,
  };

  MATRIX_REVEAL_COMPONENT = {
    [this.MATRIX_ITEMS.NORMAL_DISTRIBUTION_BY_TIME]: XwjAnalysisPoolIAO_MatrixRevealByTime,
    [this.MATRIX_ITEMS.NORMAL_DISTRIBUTION_BY_MATERIAL]: XwjAnalysisPoolIAO_MatrixRevealByMaterial,
  };

  componentDidMount() {
    this.queryMatrix();
  };

  queryMatrix = () => {
    queryMatrix(this.props.analysisPoolInfo.id)
      .then(matrixList => {
        this.setState({ matrixList });
        this.props.toggleLoading(false);
      })
      .catch(error => this.props.pushNotification(this.props.t('message.system.load_failed')));
  };

  render() {
    const { t } = this.props;
    let MatrixConfiguration = this.MATRIX_CONFIG_COMPONENT[this.state.modal];
    let MatrixReveal = this.state.revealItem? this.MATRIX_REVEAL_COMPONENT[this.state.revealItem.matrixType]: null;

    return (
      <XwjAnalysisPoolIAO_Panel>
        <XwjAnalysisPoolIAO_PanelHeader caption={t('analysis_set.matrix.list')}>
          <Dropdown
            isOpen={this.state.dropdownOpen}
            toggle={() => this.setState(prevState => ({
              dropdownOpen: !prevState.dropdownOpen
            }))}
            size="sm">
            <DropdownToggle caret className="btn-ghost-dark py-1 px-2 mx-1 border-0 shadow-none">
              <i className="fa fa-plus fa-lg" />
            </DropdownToggle>
            <DropdownMenu right>
              {map(this.MATRIX_OPTIONS, (label, key) => (
                <DropdownItem key={key} onClick={() => this.setState({ modal: key })}>
                  <span>{t('analysis_set.matrix.type', {value: t(label)})}</span>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </XwjAnalysisPoolIAO_PanelHeader>
        <XwjAnalysisPoolIAO_PanelBody>
          <Table className="nowrap" responsive hover>
            <thead>
            <tr className="text-center">
              <th className="border-top-0">{t('common.name')}</th>
              <th className="border-top-0">{t('common.type')}</th>
              <th className="border-top-0">{t('common.description')}</th>
              <th className="border-top-0">{t('analysis_set.matrix.report_datetime')}</th>
              <th className="border-top-0">{t('analysis_set.matrix.report')}</th>
              <th className="border-top-0">{t('common.delete')}</th>
            </tr>
            </thead>
            <tbody>
            {this.state.matrixList.map(matrix => (
              <tr key={matrix.id}>
                <td><Button
                  color="link" onClick={e => this.setState({ revealItem: matrix })}>{matrix.name}</Button></td>
                <td>{this.MATRIX_OPTIONS[matrix.matrixType]}</td>
                <td>{matrix.description}</td>
                <td>{matrix.reportTime}</td>
                <td>
                  {isEmpty(matrix.reportTime)? t('analysis_set.matrix.not_yet'): (
                    <Link to={`/xwj/matrix/${matrix.id}`} target="_blank">{t('common.reveal')}</Link>
                  )}
                </td>
                <td>
                  <Button
                    size="sm"
                    className="fa fa-times mx-1"
                    onClick={e => this.setState({ deleteItem: matrix })}
                  />
                </td>
              </tr>
            ))}
            </tbody>
          </Table>
          <DataModal
            caption={t('analysis_set.matrix.create', {
              value: t('analysis_set.matrix.type', {
                value: t(this.MATRIX_OPTIONS[this.state.modal])
              })
            })}
            size="lg"
            toggle={() => this.setState({ modal: null })}
            confirm={() => {this.createModal.submit().then(this.toListViewAndReload).catch()}}
            isOpen={!!this.state.modal}>
            {MatrixConfiguration? (
              <MatrixConfiguration ref={ref => this.createModal = ref} {...this.props.analysisPoolInfo} />)
              : <div/>}
          </DataModal>
          {this.state.revealItem? (
            <DataModal
              caption={t('analysis_set.matrix.reveal',  {
                value: t('analysis_set.matrix.type', {
                  value: t(this.MATRIX_OPTIONS[this.state.revealItem.matrixType])
                })
              })}
              size="lg"
              toggle={() => this.setState({ revealItem: null })}
              isOpen={!!this.state.revealItem}>
              {MatrixReveal? (
                  <MatrixReveal {...this.state.revealItem} />)
                : <div/>}
            </DataModal>
          ): null}
          <DeleteConfirmModal
            isOpen={!!this.state.deleteItem}
            confirm={this.deleteItem}
            cancel={this.toListView}>
            {t('message.matrix.delete')}
          </DeleteConfirmModal>
        </XwjAnalysisPoolIAO_PanelBody>
      </XwjAnalysisPoolIAO_Panel>
    );
  };

  deleteItem = () => {
    this.props.toggleLoading(true, () => {
      this.setState({ deleteItem: null });
      deleteMatrix(this.state.deleteItem.id).then(this.toListViewAndReload);
    });
  };

  toListView = () => {
    this.setState({
      deleteItem: null,
      revealItem: null,
      modal: null,
    })
  };

  toListViewAndReload = () => {
    this.toListView();
    this.props.toggleLoading(true, this.queryMatrix);
  };
}

export default withTranslation()(XwjAnalysisPoolIAO_Matrix);
