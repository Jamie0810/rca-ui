import React from "react";
import {isEmpty, omitBy} from 'lodash';
import {
  XwjAnalysisPoolIAO_PlotAction,
  XwjAnalysisPoolIAO_PlotCardBody,
  XwjAnalysisPoolIAO_PlotLeftPad, XwjAnalysisPoolIAO_PlotRightFill
} from "./XwjAnalysisPoolIAO_PlotLayout";
import {Button, CardBody, CardHeader} from "reactstrap";
import {
  addAnalysisSetPlot,
  updateAnalysisSetPlot
} from "../../action/analysis-pool-action";
import {withTranslation} from "react-i18next";

class XwjAnalysisPoolIAO_VisualizePlotEdit extends React.PureComponent {
  render() {
    if (!this.props.plotContainer) {
      return null;
    }

    const { t } = this.props;
    let PlotConfig = this.props.plotContainer.config;
    let graph_name = t(this.props.plotContainer.graph_name);
    let plotConfig = this.props.plot.plotConfig || {};

    return (
      <React.Fragment>
        <XwjAnalysisPoolIAO_PlotCardBody>
          <XwjAnalysisPoolIAO_PlotLeftPad>
            <XwjAnalysisPoolIAO_PlotAction>
              <Button
                block className="btn-ghost-dark mx-0 px-0 py-1 my-2 shadow-none"
                onClick={e => this.props.toggle()} disabled={!this.props.plot.id}>
                <i className="fa fa-arrow-left fa-lg" />
              </Button>
              <Button block className="btn-ghost-dark mx-0 px-0 py-1 my-2 shadow-none" onClick={this.savePlot}>
                <i className="fa fa-save fa-lg" />
              </Button>
              <Button
                block className="btn-ghost-danger px-0 py-1 mb-4 mt-auto shadow-none"
                disabled={!!this.props.plot.id}
                onClick={this.abort}>
                <i className="fa fa-trash fa-lg" />
              </Button>
            </XwjAnalysisPoolIAO_PlotAction>
          </XwjAnalysisPoolIAO_PlotLeftPad>
          <XwjAnalysisPoolIAO_PlotRightFill>
            <div className="h-100" style={{overflow: 'scroll'}}>
              <CardHeader className="bg-white pb-0">
                <div className="h4">{graph_name}</div>
              </CardHeader>
              <CardBody className="pb-0 pr-5">
                <PlotConfig
                  {...plotConfig}
                  fieldsByDatatype={this.props.fieldsByDatatype}
                  ref={ref => this.plotConf = ref}/>
              </CardBody>
            </div>
          </XwjAnalysisPoolIAO_PlotRightFill>
        </XwjAnalysisPoolIAO_PlotCardBody>
        {/*<XwjAnalysisPoolIAO_PlotFooter>*/}
        {/*  <div className="nowrap small text-muted">2019-07-02 12:23</div>*/}
        {/*</XwjAnalysisPoolIAO_PlotFooter>*/}
      </React.Fragment>
    );
  }

  savePlot = e => {
    const caseId = this.props.plot.caseId;
    let plotJson = this.plotConf.getConfig();
    if (!plotJson) {
      return ;
    }

    let data = {
      plotType: this.props.plot.plotType,
      remark: '',
      plotJson: omitBy(plotJson, isEmpty)
    };

    this.props.showConfirm({
      message: this.props.t('message.plot.confirm_save'),
      confirm: () => {
        this.props.toggleLoading(true);
        let promise = null;

        if (this.props.plot.id) {
          promise = updateAnalysisSetPlot(this.props.plot.id, data).then(plot => {
            this.props.updatePlot(plot);
            this.props.toggle();
          });
        } else {
          promise = addAnalysisSetPlot(caseId, data).then(plot => {
            this.props.updatePlot(plot);
          });
        }

        promise.catch(err => {
          this.props.pushNotification(this.props.t('message.system.save_failed'));
          this.props.toggleLoading(false);
        });

      },
      cancel: null,
    });
  };

  abort = e => {
    this.props.showDeleteConfirm({
      message: this.props.t('message.plot.confirm_delete'),
      confirm: () => {
        this.props.discardPlot(this.props.plot.key)
      },
      cancel: null,
    });
  };
}

export default withTranslation()(XwjAnalysisPoolIAO_VisualizePlotEdit);
