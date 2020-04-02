import React, {Component} from "react";
import {
  Badge, Button,
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
import {getTestStationItems, getTestStations} from "../../action/dataset-action";
import withLoading from "../../utils/hoc/withLoading";
import {withTranslation} from "react-i18next";
import {TagBadge, TagOption} from "../Layout";

class XwjTestCasePicker extends Component {
  state = {
    // loading: false,
    testStations: [],
    testStationItems: [],
    testStationItemsSelectedMap: Map(keyBy(this.props.testCaseSelected, 'key'))
  };

  componentDidMount() {
    // console.log('XwjTestCasePicker did mount');
    this.fetchStationData({
      product: this.props.product
    });
  }

  fetchStationData = ({product}) => {
    // this.setState({ loading: true });
    this.props.toggleLoading(true);
    Promise.all([
      getTestStations({product}),
      getTestStationItems({product}),
    ]).then(([testStations, testStationItems]) => {
      this.testStationItems = testStationItems;
      this.setState({
        testStations,
        testStationItems,
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
                      innerRef={ref => this.testStations = ref}
                      onChange={this.testStationChangedHandler}
                    >
                      <option value="">請選擇</option>
                      {this.state.testStations.map(item => {
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
            {this.state.testStationItems
              .filter(item => (!this.state.testStationItemsSelectedMap.get(item.key)))
              .map(item => {
                return (
                  <TagOption key={item.key} toSelect={() => {
                    this.setState(prevState => ({
                      testStationItemsSelectedMap: prevState.testStationItemsSelectedMap.set(item.key, item)
                    }))
                  }}>
                    {item.station}@{item.item}
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
                    testStationItemsSelectedMap:
                      prevState.testStationItemsSelectedMap.merge(keyBy(prevState.testStationItems, 'key'))
                  }))
                }}>{'>>'}</Button>
              <Button
                className="my-3" size="sm"
                onClick={e => {
                  this.setState(prevState => ({
                    testStationItemsSelectedMap: prevState.testStationItemsSelectedMap.clear()
                  }))
                }}>{'<<'}</Button>
            </div>
          </div>
        </Col>
        <Col md={6}>
          <ListGroup className="pl-1 pt-1 border" style={{height: 'calc(100vh - 264px)', overflow: 'auto'}}>
            {this.state.testStationItemsSelectedMap.valueSeq().map(item => {
              return (
                <TagOption key={item.key} toDelete={() => this.setState(prevState => ({
                  testStationItemsSelectedMap: prevState.testStationItemsSelectedMap.delete(item.key)
                }))}>
                  {item.station}@{item.item}
                </TagOption>
              );
            })}
          </ListGroup>
        </Col>
      </Row>
    );
  };

  testStationChangedHandler = e => {
    this.filter({
      cate: e.target.value,
      text: (this.textFilter.value || '').toLowerCase()
    });
  };

  getSelectedList = () => this.state.testStationItemsSelectedMap.valueSeq().toJSON();

  filterOnChangeHandler = (e) => {
    if (!this.compositionStart) {
      this.filter({
        cate: this.testStations.value,
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
      testStationItems: this.testStationItems.filter(item => {
        return (isEmpty(cate) || (!isEmpty(cate) && item.station === cate)) &&
          (isEmpty(text) || (!isEmpty(text) && item.item.toLowerCase().indexOf(text) > -1));
      })
    }));
  }, 500);
}

export default withTranslation(undefined, { withRef: true })(withLoading(XwjTestCasePicker));
