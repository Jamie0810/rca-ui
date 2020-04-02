import React, {Component} from "react";
import {Button, Card, CardBody, CardFooter, CardHeader, Modal, ModalBody} from "reactstrap";

class DeleteConfirmModal extends Component {
  render() {
    return (
      <Modal isOpen={this.props.isOpen} backdrop={'static'} size={this.props.size || 'md'} centered={true}>
        <ModalBody className="p-0">
          <Card className="m-0">
            <CardHeader>
              {/*<i className="fa fa-align-justify"></i> */}
              <strong>提示訊息</strong>
              {/*<div className="card-header-actions">*/}
              {/*  <Button*/}
              {/*    color="link"*/}
              {/*    className="card-header-action"*/}
              {/*    onClick={this.props.toggle}*/}
              {/*  >*/}
              {/*    <i className="fa fa-close fa-lg" />*/}
              {/*  </Button>*/}
              {/*</div>*/}
            </CardHeader>
            <CardBody className="px-5">
              {this.props.children}
            </CardBody>
            <CardFooter className="text-right">
              <Button size="sm" color="danger" className="mx-1" outline
                      onClick={this.props.confirm}>
                <i className="fa fa-dot-circle-o mr-1" />刪除
              </Button>
              <Button size="sm" color="primary" className="mx-1"
                      onClick={this.props.cancel}>
                <i className="fa fa-dot-circle-o mr-1" />取消
              </Button>
            </CardFooter>
          </Card>
        </ModalBody>
      </Modal>
    );
  }
}

export default DeleteConfirmModal;
