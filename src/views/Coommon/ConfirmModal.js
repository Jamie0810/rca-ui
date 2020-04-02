import React, {Component} from "react";
import {Button, Card, CardBody, CardFooter, CardHeader, Modal, ModalBody} from "reactstrap";
import {withTranslation} from "react-i18next";

class ConfirmModal extends Component {
  render() {
    const { t } = this.props;

    return (
      <Modal isOpen={this.props.isOpen} backdrop={'static'} size={this.props.size || 'md'} centered={true}>
        <ModalBody className="p-0">
          <Card className="m-0">
            <CardHeader>
              {/*<i className="fa fa-align-justify"></i> */}
              <strong>{this.props.caption || t('common.default_modal_caption')}</strong>
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
                      onClick={this.props.cancel}>
                <i className="fa fa-dot-circle-o mr-1" />取消
              </Button>
              <Button size="sm" color="primary" className="mx-1"
                      onClick={this.props.confirm}>
                <i className="fa fa-dot-circle-o mr-1" />確定
              </Button>
            </CardFooter>
          </Card>
        </ModalBody>
      </Modal>
    );
  }
}

export default withTranslation()(ConfirmModal);
