import {XwjDatasetEditForm} from './XwjDatasetForm'
import React, {PureComponent} from "react";
import CardHeader from "reactstrap/es/CardHeader";
import CardBody from "reactstrap/es/CardBody";
import CardFooter from "reactstrap/es/CardFooter";
import {Button, Card} from "reactstrap";
import {getDataset, updateDataset} from "../../action/dataset-action";
import withLoading from "../../utils/hoc/withLoading";
import {withTranslation} from "react-i18next";


class XwjDatasetEdit extends PureComponent {
  state = {
    dataset: null,
  };

  id = this.props.match.params.id;

  componentDidMount() {
    getDataset(this.id).then(dataset => this.setState({ dataset }, this.props.toggleLoading))
  }

  render() {
    if (!this.state.dataset) {
      return null;
    }

    const { t } = this.props;

    return (
      <Card>
        <CardHeader className="px-4">
          {t('dataset.information')}
          <div className="card-header-actions">
          </div>
        </CardHeader>
        <CardBody className="pr-5">
          <XwjDatasetEditForm
            ref={ref => this.formBody = ref}
            {...this.props}
            {...this.state.dataset} isEdit={true}/>
        </CardBody>
        <CardFooter className="text-right pr-5">
          <Button
            type="reset" size="sm" color="danger" className="mx-2"
            onClick={e => this.props.history.push(`/xwj/dataset/list/${this.id}`)}>
            <i className="fa fa-ban mr-1"/>{t('common.cancel')}
          </Button>
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
      updateDataset(this.id, postData).then(data => {
        this.props.history.push(`/xwj/dataset/list/${this.id}`);
      }).catch(error => {
        this.props.pushNotification(this.props.t('message.system.error'));
      });
    } else {
      this.props.toggleLoading(false);
    }
  };
}

export default withTranslation()(withLoading(XwjDatasetEdit, true));
