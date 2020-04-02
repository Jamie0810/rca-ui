import React from 'react';
import LoadingMask from "../../views/Coommon/LoadingMask";

function withLoading(WrappedComponent, initLoading) {
  class WithLoading extends React.PureComponent {
    state = {
      loading: !!initLoading
    };

    render() {
      const {forwardedRef, ...rest} = this.props;

      return (
        <LoadingMask loading={!!this.state.loading}>
          <WrappedComponent ref={forwardedRef} {...rest} toggleLoading={this.toggleLoading} />
        </LoadingMask>
      );
      // return <WrappedComponent {...this.props}/>;
    }

    toggleLoading = (loading = false, callback) => this.setState({ loading }, callback);
  }

  return React.forwardRef((props, ref) => {
    return <WithLoading {...props} forwardedRef={ref} />;
  });
};

export default withLoading;
