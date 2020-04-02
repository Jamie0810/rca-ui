import React from "react";
import withLoading from "../../utils/hoc/withLoading";
import Card from "reactstrap/es/Card";
import CardHeader from "reactstrap/es/CardHeader";
import CardBody from "reactstrap/es/CardBody";
import {XwjAnalysisEditForm} from "./XwjAnalysisForm";
import CardFooter from "reactstrap/es/CardFooter";
import {Button} from "reactstrap";
import {updateAnalysisSet} from "../../action/analysis-pool-action";
import withNotify from "../../utils/hoc/withNotify";
import {withTranslation} from "react-i18next";

class XwjAnalysisEdit extends React.PureComponent {
  id = this.props.match.params.id;

  render() {
    const { t } = this.props;

    return (
      <Card>
        <CardHeader className="px-4">
          {t('analysis_set.information')}
          <div className="card-header-actions">
            {/*<HeaderActions/>*/}
          </div>
        </CardHeader>
        <CardBody className="pr-5">
          <XwjAnalysisEditForm
            ref={ref => this.formBody = ref}
            {...this.props}
            id={this.id}/>
        </CardBody>
        <CardFooter className="text-right pr-5">
          <Button
            type="reset" size="sm" color="danger" className="mx-2"
            onClick={e => this.props.history.push(`/xwj/analysis/list/${this.id}`)}>
            <i className="fa fa-ban mr-1"/>{t('common.cancel')}
          </Button>
          <Button type="button" color="primary" size="sm" onClick={this.submitHandler}>
            <i className="fa fa-dot-circle-o mr-1"/>{t('common.save')}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  submitHandler = () => {
    this.props.toggleLoading(true);
    let postData = this.formBody.getSubmitData();
    if (postData) {
      updateAnalysisSet(this.id, postData).then(data => {
        this.props.history.push(`/xwj/analysis/list/${this.id}`);
      }).catch(error => {
        this.props.pushNotification(this.props.t('message.system.error'));
      });
    }
  };
}

export default withTranslation()(withNotify(withLoading(XwjAnalysisEdit, true)));
