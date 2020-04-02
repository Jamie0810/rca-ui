import React from 'react';
import { Redirect } from 'react-router-dom';
import {getCookie} from "../cookie-util";

const withLogin = (WrappedComponent) => {
  return class extends React.Component {
    render() {
      const isAuth = getCookie('profile');
      // const isAuth = profile && profile._dev_auth_;

      return isAuth?
        <WrappedComponent {...this.props}/>:
        <Redirect to="/login" />;
    }
  }
};

export default withLogin;
