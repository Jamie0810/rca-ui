import React, {Component, PureComponent} from 'react';
import {Button, Card, CardBody, CardFooter, CardHeader, Modal, ModalBody} from "reactstrap";

class DataModal extends PureComponent {
  render () {
    let modalBodyClassName = 'modal-card-body-no-footer';
    let ModalFooter = null;
    if (this.props.confirm) {
      modalBodyClassName = 'modal-card-body';
      ModalFooter = (
        <CardFooter className="text-right pr-5">
          <Button type="button" size="sm" color="primary"
                  onClick={this.props.confirm}>
            <i className="fa fa-dot-circle-o mr-1" />確定
          </Button>
        </CardFooter>
      );
    }

    return (
      <Modal isOpen={this.props.isOpen} backdrop={'static'} size={this.props.size || 'lg'} centered={true}>
        {/*<ModalHeader toggle={this.toggle}>不良數量明細</ModalHeader>*/}
        <ModalBody className="p-0">
          <Card className="m-0">
            <CardHeader>
              {/*<i className="fa fa-align-justify"></i> */}
              <strong>{this.props.caption}</strong>
              <div className="card-header-actions">
                <Button
                  color="link"
                  className="card-header-action"
                  onClick={this.props.toggle}
                >
                  <i className="fa fa-close fa-lg" />
                </Button>
              </div>
            </CardHeader>
            <CardBody className={modalBodyClassName}>
              {this.props.children}
            </CardBody>
            {ModalFooter}
          </Card>
        </ModalBody>
      </Modal>
    );
  };
}

export default DataModal;
