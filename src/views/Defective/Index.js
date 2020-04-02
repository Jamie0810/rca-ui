import React, {Component, PureComponent} from 'react';
import { Redirect } from 'react-router-dom';

class Index extends PureComponent {
  render () {
    return (<Redirect to="/fdj/defective" from="/fdj" />);
  }
}

export default Index;
