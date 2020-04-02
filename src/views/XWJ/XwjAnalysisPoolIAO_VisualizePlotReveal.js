import React from "react";
import {Alert, Button} from "reactstrap";
import {
  XwjAnalysisPoolIAO_PlotAction, XwjAnalysisPoolIAO_PlotCardBody, XwjAnalysisPoolIAO_PlotRightFill,
  XwjAnalysisPoolIAO_PlotLeftPad, XwjAnalysisPoolIAO_PlotFooter
} from "./XwjAnalysisPoolIAO_PlotLayout";
import {
  captureAnalysisSetPlot,
  deleteAnalysisSetPlot,
  getPlotData
} from "../../action/analysis-pool-action";
import DataModal from "../Coommon/DataModal";
import {isEmpty} from "lodash";
import {withTranslation} from "react-i18next";

class XwjAnalysisPoolIAO_VisualizePlotReveal extends React.PureComponent {
  state = {
    plotData: undefined,
    informationModal: false,
  };

  componentDidMount() {
    this.props.toggleLoading(true);
    getPlotData(this.props.plot.id)
      .then(plotData => this.setState({ plotData }))
      .catch(error => {
        this.props.pushNotification(
          this.props.t('message.plot.save_failed', {
            id: this.props.plot.id,
            name: this.props.plotContainer.graph_name
          })
        );
        this.setState({ plotData: null })
      })
      .finally(this.props.toggleLoading);
  }

  render() {
    if (!this.props.plotContainer) {
      return (<Alert color="danger">Unknown Plot</Alert>);
    }

    if (this.state.plotData === undefined) {
      return null;
    }

    const { t } = this.props;
    // let isDataEmpty = isEmpty(this.state.plotData.chart_data);
    let PlotChart = this.props.plotContainer.chart;
    let PlotInformation = this.props.plotContainer.information;
    let graph_name = t(this.props.plotContainer.graph_name);

    return (
      <React.Fragment>
        <XwjAnalysisPoolIAO_PlotCardBody>
          <XwjAnalysisPoolIAO_PlotLeftPad>
            <XwjAnalysisPoolIAO_PlotAction>
              <Button
                block className="btn-ghost-dark mx-0 px-0 py-1 my-2 shadow-none"
                disabled={!this.props.plot.plotJson}
                onClick={this.toEdit}>
                <i className="fa fa-pencil fa-lg" />
              </Button>
              <Button
                block className="btn-ghost-dark mx-0 px-0 py-1 my-2 shadow-none"
                disabled={!this.state.plotData}
                onClick={this.toCapture}>
                <i className="fa fa-camera fa-lg" />
              </Button>
              <Button
                block className="btn-ghost-dark mx-0 px-0 py-1 my-2 shadow-none"
                disabled={!this.state.plotData}
                onClick={this.toggleInformationModal}>
                <i className="fa fa-info-circle fa-lg" />
              </Button>
              <Button block className="btn-ghost-danger px-0 py-1 mb-4 mt-auto shadow-none" onClick={this.remove}>
                <i className="fa fa-trash fa-lg" />
              </Button>
            </XwjAnalysisPoolIAO_PlotAction>
          </XwjAnalysisPoolIAO_PlotLeftPad>
          <XwjAnalysisPoolIAO_PlotRightFill>
            {!this.state.plotData? (
                <Alert color="danger" className="text-center">
                  {t('analysis_set.visualization.load_failed_notice', {name: graph_name})}
                </Alert>
              ): isEmpty(this.state.plotData.chart_data)? (
              <Alert color="warning" className="text-center">
                {t('analysis_set.visualization.data_leak_notice', {
                  caption: this.props.plot.plotConfig.caption,
                  name: graph_name
                })}
              </Alert>
            ): (<PlotChart setting={this.props.plot.plotConfig} data={this.state.plotData}/>)}
          </XwjAnalysisPoolIAO_PlotRightFill>
        </XwjAnalysisPoolIAO_PlotCardBody>
        <XwjAnalysisPoolIAO_PlotFooter>
          <div className="nowrap small text-muted">
            <span>{`#${this.props.plot.id}`}</span>
            <span className="ml-3">{this.props.plot.updateTime}</span>
          </div>
        </XwjAnalysisPoolIAO_PlotFooter>
        <DataModal
          caption={t('analysis_set.chart_information_caption')}
          toggle={this.toggleInformationModal}
          isOpen={this.state.informationModal}>
          <PlotInformation chartData={this.state.plotData} chartSetting={this.props.plot.plotConfig}/>
        </DataModal>
      </React.Fragment>
    );
  }

  toggleInformationModal = e => this.setState(prevState => ({
    informationModal: !prevState.informationModal
  }));

  toEdit = e => this.props.toggle();

  toCapture = e => {
    this.props.showConfirm({
      message: this.props.t('message.plot.confirm_capture'),
      confirm: () => {
        let data = {
          caseId: this.props.plot.caseId,
          dataJson: this.state.plotData,
          // plotId: this.props.plot.id,
          plotJson: this.props.plot.plotJson
        };
        // console.log('createCapture postData:', data);
        this.props.toggleLoading(true);
        captureAnalysisSetPlot(this.props.plot.id, data)
          .then(() => {
            this.props.pushNotification(this.props.t('message.system.save_succeed'), {level: 'success'});
          })
          .then(this.props.toggleLoading)
          .catch(err => {
            this.props.pushNotification(this.props.t('message.system.save_failed'));
            this.props.toggleLoading(false);
          });
      },
      cancel: null,
    });
  };

  remove = e => {
    let id = this.props.plot.id;
    this.props.showDeleteConfirm({
      message: this.props.t('message.plot.confirm_delete'),
      confirm: () => {
        this.props.toggleLoading(true);
        deleteAnalysisSetPlot(id)
          .then(data => {
            this.props.deletePlot(id);
            this.props.pushNotification(this.props.t('message.system.save_succeed'), {level: 'success'});
          })
          .catch(err => {
            this.props.pushNotification(this.props.t('message.system.save_failed'));
            this.props.toggleLoading(false);
          });
      },
      cancel: null,
    });

    // deleteAnalysisSetPlot(id).then(data => this.props.deletePlot(id));
  };
}

export default withTranslation()(XwjAnalysisPoolIAO_VisualizePlotReveal);
