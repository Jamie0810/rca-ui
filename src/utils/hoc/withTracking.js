import React from "react";
import {trackLogger} from "../../action/common-action";

export default function (WrappedComponent, code) {
  return class extends React.PureComponent {
    componentDidMount() {
      trackLogger(code);
    }

    render() {
      return (<WrappedComponent {...this.props} />);
    }
  }
}
