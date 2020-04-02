import React from 'react';
import DeleteConfirmModal from "../../views/Coommon/DeleteConfirmModal";

const withDeleteConfirmModal = (WrappedComponent) => {
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
            showDeleteConfirm={this.showDeleteConfirm}/>
          <DeleteConfirmModal
            isOpen={this.state.isOpen}
            size={this.state.size}
            confirm={this.confirm}
            cancel={this.cancel}>
            <span>{this.state.message}</span>
          </DeleteConfirmModal>
        </React.Fragment>
      )
    }

    showDeleteConfirm = ({size = null, message = '', confirm, cancel}) => {
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

export default withDeleteConfirmModal;
