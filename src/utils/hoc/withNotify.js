import React from 'react';
import { Alert } from 'reactstrap';
import {List} from "immutable";

class MyAlert extends React.PureComponent {

  state = {
    visible: true
  };

  componentDidMount() {
    if (this.props.dismiss) {
      setTimeout(() => {
        this.setState({visible: false})
      }, this.props.dismiss);
    }
  }

  render() {
    return (
      <Alert
        closeClassName="py-2"
        className="text-center py-2 my-2 mx-auto w-75"
        color={this.props.color}
        isOpen={this.state.visible}
        style={this.props.style}
        toggle={() => this.setState({visible: false})}
      >
        {this.props.children}
      </Alert>
    );
  }
};

const withNotify = (WrappedComponent) => {
  class WithNotify extends React.Component {
    state = {
      notifications: List()
      // level: 'danger',
      // message: '',
      // visible: false
    };

    render() {
      const {forwardedRef, ...rest} = this.props;

      return (
        <>
          <div className="fixed-top mt-4">
            {this.state.notifications.map((notification, index) => (
              <MyAlert
                key={notification.key}
                color={notification.level}
                dismiss={notification.dismiss}
                style={notification.style}
                innerRef={ref => {
                  console.log('withNotify: ', ref);
                  if (!ref)
                    this.setState(prevState => ({
                      notifications: prevState.notifications.remove(index)
                    }))
                }}
              >
                <span>{notification.message}</span>
              </MyAlert>
            ))}
          </div>
          {/*<Alert*/}
          {/*  className="fixed-top mt-4 text-center"*/}
          {/*  color={this.state.level}*/}
          {/*  isOpen={this.state.visible}*/}
          {/*  toggle={this.dismissMessage}*/}
          {/*>*/}
          {/*  <span>{this.state.message}</span>*/}
          {/*</Alert>*/}
          <WrappedComponent
            {...rest} ref={forwardedRef}
            pushNotification={this.pushNotification}
            clearNotification={this.clearNotification} />
        </>
      );
      // return <WrappedComponent {...this.props}/>;
    }

    // onDismiss = () => {
    //   this.setState({ visible: false });
    // };

    pushNotification = (message = '', {level = 'danger', dismiss = 7000, style} = {}) => {
      this.setState(prevState => ({
        notifications: prevState.notifications.insert(0, {
          key: Date.now(),
          level,
          message,
          dismiss,
          style
        })
      }));
      // this.setState({ message, level, visible: true }, () => {
      //   if (dismiss) {
      //     setTimeout(this.dismissMessage, dismiss);
      //   }
      // });
    };

    clearNotification = () => {
      this.setState({notifications: List()});
    };
  }

  return React.forwardRef((props, ref) => {
    return <WithNotify {...props} forwardedRef={ref} />;
  });
};

export default withNotify;
