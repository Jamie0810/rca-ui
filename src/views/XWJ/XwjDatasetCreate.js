import {XwjDatasetCreateForm} from './XwjDatasetForm'
import React, {PureComponent} from "react";
import Card from "reactstrap/es/Card";
import CardHeader from "reactstrap/es/CardHeader";
import CardBody from "reactstrap/es/CardBody";
import CardFooter from "reactstrap/es/CardFooter";
import {Button} from "reactstrap";
import {createDataset} from "../../action/dataset-action";
import withNotify from "../../utils/hoc/withNotify";
import withLoading from "../../utils/hoc/withLoading";
import {withTranslation} from "react-i18next";

class XwjDatasetCreate extends PureComponent {

  render() {
    const { t } = this.props;

    return (
      <Card>
        <CardHeader className="px-4">
          {t('dataset.information')}
          <div className="card-header-actions">
            {/*<HeaderActions/>*/}
          </div>
        </CardHeader>
        <CardBody className="pr-5">
          <XwjDatasetCreateForm ref={ref => this.formBody = ref} {...this.props}/>
        </CardBody>
        <CardFooter className="text-right pr-5">
          <Button type="button" color="primary" size="sm" onClick={this.submitHandler}>
            <i className="fa fa-dot-circle-o mr-1" />{t('common.save')}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  submitHandler = () => {
    this.props.toggleLoading(true);
    let postData = this.formBody.getSubmitData();
    if (postData) {
      createDataset(postData).then(data => {
        this.props.history.push('/xwj/dataset/list');
      }).catch(error => {
        this.props.pushNotification(this.props.t('message.system.error'));
      });
    } else {
      this.props.toggleLoading(false);
    }
  };
}

export default withTranslation()(withNotify(withLoading(XwjDatasetCreate, true)));
