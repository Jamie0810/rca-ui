import React, {Component, PureComponent} from 'react';
import Loader from 'react-loader-advanced'

class LoadingMask extends PureComponent {

  loading = <i className="fa fa-circle-o-notch fa-spin fa-3x fa-fw"/>

  render() {
    return (
      <Loader show={this.props.loading} message={this.loading} className={this.props.className}>
        {this.props.children}
      </Loader>
    );
  }
}

export default LoadingMask;
