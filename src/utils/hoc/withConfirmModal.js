import React from 'react';
import ConfirmModal from "../../views/Coommon/ConfirmModal";

const withConfirmModal = (WrappedComponent) => {
  return class extends React.Component {
    state = {
      isOpen: false,
      size: null,
      message: ''
    };
    confirm = () => {
      if (this.confirmHandler) {
        this.confirmHandler();
      }
      this.setState({ isOpen: false });
    };

    cancel = () => {
      if (this.cancelHandler) {
        this.cancelHandler();
      }
      this.setState({ isOpen: false });
    };

    render() {
      return (
        <React.Fragment>
          <WrappedComponent
            {...this.props}
            showConfirm={this.showConfirm}/>
          <ConfirmModal
            isOpen={this.state.isOpen}
            size={this.state.size}
            confirm={this.confirm}
            cancel={this.cancel}>
            <span>{this.state.message}</span>
          </ConfirmModal>
        </React.Fragment>
      )
    }

    showConfirm = ({size = null, message = '', confirm, cancel}) => {
      this.confirmHandler = confirm;
      this.cancelHandler = cancel;

      this.setState({
        isOpen: true,
        size: size,
        message: message
      });
    };
  }
};

export default withConfirmModal;
