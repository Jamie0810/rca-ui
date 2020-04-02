import React from 'react';
import {getCookie} from "../cookie-util";

const withSystemAuth = (WrappedComponent) => {
  return class extends React.Component {
    constructor(props) {
      super(props);

      // const { cookies } = props;
      if (!getCookie('_dev_auth_')) {
        props.history.push({
          pathname: '/404'
        });
      }
    }

    render() {
      return <WrappedComponent {...this.props}/>;
    }
  }
};

export default withSystemAuth;
