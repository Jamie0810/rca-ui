import React, {Component} from "react";
import {Redirect} from "react-router-dom";

class XwjDatasetQuery extends Component {
  render () {
    return (<Redirect to="/xwj/dataset/list" from="/xwj/dataset/query" />);
  }
}

export default XwjDatasetQuery;
