import React, {PureComponent} from 'react';
import { Card, CardBody, CardHeader, Button } from 'reactstrap';
import XwjDatasetRevealDetailContainer from './XwjDatasetRevealDetailContainer';
import XwjDatasetRevealInformation from './XwjDatasetRevealInformation';
import {getDataset} from "../../action/dataset-action";
import withLoading from "../../utils/hoc/withLoading";
import {withTranslation} from "react-i18next";

class XwjDatasetReveal extends PureComponent {
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
          {t('common.basic_information')}
          <div className="card-header-actions">
            <Button
              color="link"
              className="card-header-action px-3"
              onClick={this.datasetEdit}>
              <i className="fa fa-pencil fa-lg" />
            </Button>
            <Button
              color="link"
              className="card-header-action px-3 border-left"
              onClick={this.backToList}>
              <i className="fa fa-reply fa-rotate-90 fa-lg" />
            </Button>
          </div>
        </CardHeader>
        <CardBody className="border-bottom">
          <XwjDatasetRevealInformation {...this.state.dataset} />
        </CardBody>
        <CardHeader className="px-4">
          {t('dataset.data_pool.data_range')}
        </CardHeader>
        <CardBody>
          <XwjDatasetRevealDetailContainer
            {...this.props}
            dataset={this.state.dataset}/>
        </CardBody>
      </Card>
    );
  };

  datasetEdit = () => {
    this.props.history.push(`/xwj/dataset/list/${this.id}/edit`);
  };

  backToList = () => {
    this.props.history.push('/xwj/dataset/list/');
  };
}

export default withTranslation()(withLoading(XwjDatasetReveal, true));
