import React from "react";
import {Map} from "immutable";
import {debounce, isEmpty, keyBy} from "lodash";
import {
  Badge, Button, Col, Input, InputGroup, InputGroupAddon, InputGroupText, ListGroup, ListGroupItem, Row
} from "reactstrap";
import withLoading from "../../utils/hoc/withLoading";

class XwjAnalysisPoolIAO_TargetDelimitFieldPicker extends React.PureComponent {
  state = {
    fields: this.props.datasetFields,
    fieldSelectedMap: Map(keyBy(this.props.fieldSelected, 'name'))
  };

  render() {
    return (
      <Row>
        <Col md={5}>
          <Row>
            <Col>
              <div className="controls">
                <InputGroup className="input-prepend" size="sm">
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
          <ListGroup className="my-2 pt-1 px-1 border" style={{height: 'calc(100vh - 300px)', overflow: 'auto'}}>
            {this.state.fields
              .filter(item => (!this.state.fieldSelectedMap.get(item.name)))
              .map(item => {
                return (
                  <ListGroupItem
                    key={item.name} className="border-0 p-0 mb-1"
                    onClick={() => {
                      this.setState(prevState => ({
                        fieldSelectedMap: prevState.fieldSelectedMap.set(item.name, item)
                      }))
                    }}>
                    <Badge
                      color="secondary"
                      className="py-1">
                      <span className="h6 align-middle mx-1">{item.name}</span>
                    </Badge>
                  </ListGroupItem>
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
                    fieldSelectedMap:
                      prevState.fieldSelectedMap.merge(keyBy(this.state.fields, 'name'))
                  }))
                }}>{'>>'}</Button>
              <Button
                className="my-3" size="sm"
                onClick={e => {
                  this.setState(prevState => ({
                    fieldSelectedMap: prevState.fieldSelectedMap.clear()
                  }))
                }}>{'<<'}</Button>
            </div>
          </div>
        </Col>
        <Col md={6}>
          <ListGroup className="px-1 pt-1 border" style={{height: 'calc(100vh - 264px)', overflow: 'auto'}}>
            {this.state.fieldSelectedMap.valueSeq().map(item => {
              return (
                <ListGroupItem key={item.name} className="border-0 p-0 mb-1">
                  <Badge className="py-0" color="warning">
                    <Button
                      color="danger" className="py-0 px-1 my-1" size="sm"
                      onClick={() => this.setState(prevState => ({
                        fieldSelectedMap: prevState.fieldSelectedMap.delete(item.name)
                      }))}>
                      <i className="fa fa-remove font-sm" />
                    </Button>
                    <span className="h6 align-middle mx-1">{item.name}</span>
                  </Badge>
                </ListGroupItem>
              );
            })}
          </ListGroup>
        </Col>
      </Row>
    );
  };

  getSelectedList = () => this.state.fieldSelectedMap.valueSeq().toJSON();

  filterOnChangeHandler = (e) => {
    if (!this.compositionStart) {
      this.filter(e.target.value);
    }
  };

  filterOnCompositionStart = () => { this.compositionStart = true; };

  filterOnCompositionEnd = (e) => {
    this.compositionStart = false;
    this.filter(e.target.value);
  };

  filter = debounce(text => {
    if (!isEmpty(text)) {
      this.setState(prevState => ({
        fields: this.props.datasetFields.filter(item => {
          return (item.name.indexOf(text) > -1);
        })
      }));
    } else {
      this.setState({ fields: this.props.datasetFields });
    }
  }, 500);
}


export default withLoading(XwjAnalysisPoolIAO_TargetDelimitFieldPicker);
