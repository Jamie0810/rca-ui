import React from 'react';
import { CardHeader, CardBody, Card, Button } from 'reactstrap';
import XwjAnalysisPoolInformation from './XwjAnalysisPoolInformation';
import XwjAnalysisPoolIAO from './XwjAnalysisPoolIAO';
import { getAnalysisSetInfo } from '../../action/analysis-pool-action';
import withLoading from '../../utils/hoc/withLoading';
import withNotify from '../../utils/hoc/withNotify';
import withDeleteConfirmModal from '../../utils/hoc/withDeleteConfirmModal';
import {withTranslation} from 'react-i18next';
import withConfirmModal from '../../utils/hoc/withConfirmModal';

class XwjAnalysisPool extends React.PureComponent {

  state = {
    analysisPoolInfo: null,
  };

  analysisSetId = this.props.match.params.id;

  componentDidMount () {
    getAnalysisSetInfo(this.analysisSetId).then(analysisPoolInfo => {
      this.setState({ analysisPoolInfo }, this.props.toggleLoading);
    })
  };

  render() {
    const { t } = this.props;
    let caption = this.state.analysisPoolInfo? this.state.analysisPoolInfo.name: undefined;

    return (
      <Card>
        <CardHeader className="px-4">
          <span>{t('analysis_set.reveal_caption', {name: caption})}</span>
          <div className="card-header-actions">
            <Button
              color="link"
              className="card-header-action"
              onClick={this.analysisEdit}>
              <i className="fa fa-pencil fa-lg" />
            </Button>
          </div>
        </CardHeader>
        <CardBody className="border-bottom">
          {this.state.analysisPoolInfo? (
            <React.Fragment>
              <XwjAnalysisPoolInformation
                analysisPoolInfo={this.state.analysisPoolInfo}/>
              <div className="pt-4">
                <XwjAnalysisPoolIAO
                  {...this.props}
                  analysisPoolInfo={this.state.analysisPoolInfo}
                  updateAnalysisPoolInfo={this.updateAnalysisPoolInfo}/>
              </div>
            </React.Fragment>
          ): null}
        </CardBody>
      </Card>
    )
  };

  updateAnalysisPoolInfo = analysisPoolInfo => this.setState({ analysisPoolInfo });

  analysisEdit = () => {
    this.props.history.push(`/xwj/analysis/list/${this.analysisSetId}/edit`);
  };
}

export default withTranslation()(withConfirmModal(withDeleteConfirmModal(withNotify(withLoading(XwjAnalysisPool, true)))));
