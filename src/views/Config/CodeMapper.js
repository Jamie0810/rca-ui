import React from "react";
import withLoading from "../../utils/hoc/withLoading";
import {
  createCodeGroupItem,
  deleteCodeGroupItem,
  queryCodeGroup,
} from "../../action/code-action";
import {Button, Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Table} from "reactstrap";
import DeleteConfirmModal from "../Coommon/DeleteConfirmModal";
import ConfirmModal from "../Coommon/ConfirmModal";
import {isEmpty, reduce, map, filter, debounce, uniq, orderBy} from "lodash";
import {withTranslation} from "react-i18next";
import {BoldLabel, FormPropertyColumn, FormRow, FormValueColumn} from "../Layout";
import {getProductNames} from "../../action/defective-action";

const getCodeCategory = (t) => ({
  '1': t('label_code.type_options.fail_symptom'),
  '2': t('label_code.type_options.vendor_code'),
  '3': t('label_code.type_options.date_code'),
  '4': t('label_code.type_options.component'),
  '5': t('label_code.type_options.xwj_common')
});

let CreateForm = withTranslation(undefined, { withRef: true })(withLoading(
  class extends React.PureComponent {
    state = {
      codeInvalid: false,
      nameInvalid: false,
      // productInvalid: false,
      products: [],
    };

    componentDidMount() {
      getProductNames().then(products => this.setState({ products }));
    }

    render() {
      const { t } = this.props;
      const CODE_CATEGORY = getCodeCategory(t);

      return (
        <React.Fragment>
          <FormRow>
            <FormPropertyColumn md={3}>
              <BoldLabel>{t('common.product')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn>
              <Input type="select" bsSize="sm" innerRef={ref => this.product = ref}>
                {/*<option value="">請選擇</option>*/}
                {this.state.products.map(item => (<option value={item} key={item}>{item}</option>))}
              </Input>
            </FormValueColumn>
          </FormRow>
          <FormRow>
            <FormPropertyColumn md={3}>
              <BoldLabel>{t('label_code.type')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn>
              <Input type="select" bsSize="sm" innerRef={ref => this.category = ref}>
                {/*<option value="">請選擇</option>*/}
                {map(CODE_CATEGORY, (item, key) => (<option value={key} key={key}>{item}</option>))}
              </Input>
            </FormValueColumn>
          </FormRow>
          <FormRow>
            <FormPropertyColumn md={3}>
              <BoldLabel>{t('label_code.code')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn>
              <Input
                type="text" bsSize="sm"
                invalid={this.state.codeInvalid}
                innerRef={ref => this.code = ref} />
            </FormValueColumn>
          </FormRow>
          <FormRow>
            <FormPropertyColumn md={3}>
              <BoldLabel>{t('common.name')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn>
              <Input
                type="text" bsSize="sm"
                invalid={this.state.nameInvalid}
                innerRef={ref => this.name = ref} />
            </FormValueColumn>
          </FormRow>
        </React.Fragment>
      );
    }

    getFormData = () => {
      let state = {
        codeInvalid: isEmpty(this.code.value),
        nameInvalid: isEmpty(this.name.value),
      };
      this.setState(state);
      let valid = reduce(state, (valid, isInvalid) => (valid && !isInvalid), true);

      if (valid) {
        this.props.toggleLoading(true);
        return {
          code: this.code.value,
          codeName: this.name.value,
          codeProduct: this.product.value,
          codeCategory: this.category.value,
        };
      }
      return false;
    };
  }
));

class CodeMapper extends React.PureComponent {
  state = {
    codeGroupList: [],
    codeGroupProducts: [],
    deleteItem: null,
    createModal: false,
    sortByField: 'codeName',
    isAscending: true,
  };

  componentDidMount() {
    this.queryCodeGroupItem();
  }

  render() {
    const { t } = this.props;
    const CODE_CATEGORY = getCodeCategory(t);
    const orderIcon = this.state.isAscending?
      (<i className="fa fa-sort-amount-asc ml-1" />): (<i className="fa fa-sort-amount-desc ml-1" />);

    return (
      <Card>
        <CardHeader className="px-4">
          <span>{t('label_code.management')}</span>
          <div className="card-header-actions">
            <Button
              color="link"
              className="card-header-action"
              onClick={e => this.setState({ createModal: true })}>
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
                type="select" name="product" bsSize="sm"
                innerRef={ref => this.product = ref}
                onChange={this.doFilter}
              >
                <option value="">{t('common.choose')}</option>
                {this.state.codeGroupProducts.map(item => (<option value={item} key={item}>{item}</option>))}
              </Input>
            </FormValueColumn>
          </FormRow>
          <FormRow>
            <FormPropertyColumn md={3}>
              <BoldLabel>{t('label_code.type')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn md={4}>
              <Input
                type="select" name="category" bsSize="sm"
                innerRef={ref => this.category = ref}
                onChange={this.doFilter}
              >
                <option value="">{t('common.choose')}</option>
                {map(CODE_CATEGORY, (label, key) => (<option value={key} key={key}>{label}</option>))}
              </Input>
            </FormValueColumn>
          </FormRow>
          <FormRow>
            <FormPropertyColumn md={3}>
              <BoldLabel>{t('common.keyword')}</BoldLabel>
            </FormPropertyColumn>
            <FormValueColumn md={4}>
              <Input
                bsSize="sm"
                innerRef={ref => this.keyword = ref}
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
                <a href="javascript:" className="text-dark" onClick={e => this.setOrder('codeProduct')}>
                  {t('common.product')}{this.tableHeaderLabel('codeProduct', orderIcon)}
                </a>
              </th>
              <th className="border-top-0">
                <a href="javascript:" className="text-dark" onClick={e => this.setOrder('codeCategory')}>
                  {t('label_code.type')}{this.tableHeaderLabel('codeCategory', orderIcon)}
                </a>
              </th>
              <th className="border-top-0">
                <a href="javascript:" className="text-dark" onClick={e => this.setOrder('code')}>
                  {t('label_code.code')}{this.tableHeaderLabel('code', orderIcon)}
                </a>
              </th>
              <th className="border-top-0">
                <a href="javascript:" className="text-dark" onClick={e => this.setOrder('codeName')}>
                  {t('label_code.label')}{this.tableHeaderLabel('codeName', orderIcon)}
                </a>
              </th>
              {/*<th className="border-top-0">排序</th>*/}
              <th className="border-top-0">{''}</th>
            </tr>
            </thead>
            <tbody className="border-bottom">
            {this.state.codeGroupList.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="align-middle">{item.codeProduct}</td>
                <td className="align-middle">{CODE_CATEGORY[item.codeCategory]}</td>
                <td className="align-middle">{item.code}</td>
                <td className="align-middle">{item.codeName}</td>
                {/*<td className="align-middle">{item.order}</td>*/}
                <td>
                  {/*<Button*/}
                  {/*  size="sm" className="fa fa-pencil mx-1"*/}
                  {/*  onClick={e => this.setState({ editItem: item })} />*/}
                  <Button
                    size="sm" className="fa fa-times mx-1"
                    onClick={e => this.setState({ deleteItem: item })} />
                </td>
              </tr>
            ))}
            </tbody>
          </Table>

          <DeleteConfirmModal
            isOpen={!!this.state.deleteItem}
            confirm={this.deleteItem}
            cancel={this.toListView}>
            {t('message.label_code.delete')}
          </DeleteConfirmModal>

          <ConfirmModal
            size="md"
            isOpen={this.state.createModal}
            confirm={this.createItem}
            cancel={this.toListView}>
            {this.state.createModal? (
              <CreateForm ref={ref => this.createForm = ref}/>
            ): null}
          </ConfirmModal>

        </CardBody>
      </Card>
    );
  };

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

  queryCodeGroupItem = () => {
    queryCodeGroup()
      .then(codeGroupList => {
        this.codeGroupList = this.sortList(codeGroupList, this.state.sortByField, this.state.isAscending);
        let codeGroupProducts = uniq(map(codeGroupList, 'codeProduct'));
        this.setState({ codeGroupProducts, codeGroupList }, this.props.toggleLoading)
      })
      .catch(this.props.toggleLoading);
  };

  deleteItem = () => {
    this.props.toggleLoading(true, () => {
      this.setState({ deleteItem: null });
      deleteCodeGroupItem(this.state.deleteItem.id).then(this.toListViewAndReload);
    });
  };

  createItem = () => {
      let data = this.createForm.getFormData();
      if (data) {
        createCodeGroupItem(data).then(this.toListViewAndReload)
      }
    };

  toListViewAndReload = () => {
    this.toListView();
    this.props.toggleLoading(true, this.queryCodeGroupItem);
  };

  toListView = () => {
    this.setState({
      deleteItem: null,
      createModal: false,
    });
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
    if (!isEmpty(this.product.value)) (criteria.codeProduct = this.product.value);
    if (!isEmpty(this.category.value)) (criteria.codeCategory = this.category.value);

    let keyword = this.keyword.value;
    let codeGroupList = filter(this.codeGroupList, criteria);
    if (!isEmpty(keyword)) {
      codeGroupList = codeGroupList
        .filter(codeItem => (codeItem.code.indexOf(keyword) >= 0 || codeItem.codeName.indexOf(keyword) >= 0));
    }

    codeGroupList = this.sortList(codeGroupList, this.state.sortByField, this.state.isAscending);

    this.setState({ codeGroupList }, this.props.toggleLoading);
  }, 400);
}

export default withTranslation()(withLoading(CodeMapper, true));
