import React from "react";
import {Redirect} from "react-router-dom";

class XwjAnalysis extends React.PureComponent {
  render() {
    return (<Redirect from="/xwj/analysis/query" to="/xwj/analysis/list" />);
  }
}

export default XwjAnalysis;
