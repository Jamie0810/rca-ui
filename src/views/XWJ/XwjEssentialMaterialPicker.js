import React, {Component} from "react";
import {
  getMaterialTypeItems,
  getMaterialTypes,
} from "../../action/dataset-action";
import {
  Badge,
  Button,
  Col,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  ListGroup,
  ListGroupItem, Row
} from "reactstrap";
import {debounce, isEmpty, keyBy} from "lodash";
import {Map} from 'immutable';
import withLoading from "../../utils/hoc/withLoading";
import {withTranslation} from "react-i18next";
import {TagOption} from "../Layout";

class XwjEssentialMaterialPicker extends Component{
  state = {
    // loading: false,
    materialTypes: [],
    materialItems: [],
    materialItemsSelectedMap: Map(keyBy(this.props.materialSelected, 'key'))
  };

  componentDidMount() {
    this.fetchMaterialData({
      product: this.props.product
    });
  }

  fetchMaterialData = ({product}) => {
    // this.setState({ loading: true });
    this.props.toggleLoading(true);
    Promise.all([
      getMaterialTypes({product}),
      getMaterialTypeItems({product}),
    ]).then(([materialTypes, materialItems]) => {
      this.materialItems = materialItems;
      this.setState({
        materialTypes,
        materialItems,
        // loading: false
      });
      this.props.toggleLoading(false);
    });
  };

  render() {
    const { t } = this.props;

    return (
      <Row>
        <Col md={5}>
          <Row>
            <Col>
              <div className="controls">
                <InputGroup className="input-prepend" size="sm">
                  <InputGroupAddon addonType="prepend" style={{width: '35%'}}>
                    <Input
                      type="select" bsSize="sm"
                      innerRef={ref => this.materialTypes = ref}
                      onChange={this.materialTypesChangedHandler}
                    >
                      <option value="">{t('common.choose')}</option>
                      {this.state.materialTypes.map(item => {
                        return (<option key={item} value={item}>{item}</option>);
                      })}
                    </Input>
                  </InputGroupAddon>
                  <Input
                    type="text"
                    ref={ref => this.textFilter = ref}
                    onChange={this.filterOnChangeHandler}
                    onCompositionStart={this.filterOnCompositionStart}
                    onCompositionEnd={this.filterOnCompositionEnd}/>
                  <InputGroupAddon addonType="append">
                    <InputGroupText><i className="fa fa-search"/></InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </div>
            </Col>
          </Row>
          <ListGroup className="my-2 pt-1 pl-1 border" style={{height: 'calc(100vh - 300px)', overflow: 'auto'}}>
            {this.state.materialItems
              .filter(item => (!this.state.materialItemsSelectedMap.get(item.key)))
              .map(item => {
                return (
                  <TagOption
                    key={item.key}
                    toSelect={() => {
                      this.setState(prevState => ({
                        materialItemsSelectedMap: prevState.materialItemsSelectedMap.set(item.key, item)
                      }))
                    }}>
                    {item.partType}@{item.component}
                  </TagOption>
                );
              })}
          </ListGroup>
        </Col>
        <Col md={1} className="p-0">
          <div className="h-100 d-flex align-items-center">
            <div className="d-flex flex-column w-100 justify-content-center">
              <Button
                className="my-3" size="sm"
                onClick={e => {
                  this.setState(prevState => ({
                    materialItemsSelectedMap:
                      prevState.materialItemsSelectedMap.merge(keyBy(prevState.materialItems, 'key'))
                  }))
                }}>{'>>'}</Button>
              <Button
                className="my-3" size="sm"
                onClick={e => {
                  this.setState(prevState => ({
                    materialItemsSelectedMap: prevState.materialItemsSelectedMap.clear()
                  }))
                }}>{'<<'}</Button>
            </div>
          </div>
        </Col>
        <Col md={6}>
          <ListGroup className="pl-1 pt-1 border" style={{height: 'calc(100vh - 264px)', overflow: 'auto'}}>
            {this.state.materialItemsSelectedMap.valueSeq().map(item => {
              return (
                <TagOption key={item.key} toDelete={() => this.setState(prevState => ({
                  materialItemsSelectedMap: prevState.materialItemsSelectedMap.delete(item.key)
                }))}>
                  {item.partType}@{item.component}
                </TagOption>
              );
            })}
          </ListGroup>
        </Col>
      </Row>
    );
  };

  materialTypesChangedHandler = e => {
    this.filter({
      cate: e.target.value,
      text: (this.textFilter.value || '').toLowerCase()
    });
  };

  getSelectedList = () => this.state.materialItemsSelectedMap.valueSeq().toJSON();

  filterOnChangeHandler = (e) => {
    if (!this.compositionStart) {
      this.filter({
        cate: this.materialTypes.value,
        text: (e.target.value || '').toLowerCase()
      });
    }
  };

  filterOnCompositionStart = () => { this.compositionStart = true; };

  filterOnCompositionEnd = (e) => {
    this.compositionStart = false;
    this.filter(e.target.value);
  };

  filter = debounce(({cate, text}) => {
    this.setState(prevState => ({
      materialItems: this.materialItems.filter(item => {
        return (isEmpty(cate) || (!isEmpty(cate) && item.partType === cate)) &&
          (isEmpty(text) || (!isEmpty(text) && item.component.toLowerCase().indexOf(text) > -1));
      })
    }));
  }, 500);
}

export default withTranslation(undefined, { withRef: true })(withLoading(XwjEssentialMaterialPicker));
