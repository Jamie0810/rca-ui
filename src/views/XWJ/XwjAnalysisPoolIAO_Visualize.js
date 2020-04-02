import React from "react";
import {
  XwjAnalysisPoolIAO_Panel,
  XwjAnalysisPoolIAO_PanelBody,
  XwjAnalysisPoolIAO_PanelHeader
} from "./XwjAnalysisPoolIAO_Panel";
import XwjAnalysisPoolIAO_VisualizePlotCard from "./XwjAnalysisPoolIAO_VisualizePlotCard";
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap";
import {getAnalysisSetFields, getAnalysisSetPlots} from "../../action/analysis-pool-action";
import {List} from "immutable";
import {groupBy, isEmpty, map} from "lodash";
import XwjAnalysisPoolIAO_PlotConfigScatter from "./XwjAnalysisPoolIAO_PlotConfigScatter";
import XwjAnalysisPoolIAO_ChartScatter from "./XwjAnalysisPoolIAO_ChartScatter";
import XwjAnalysisPoolIAO_InformationScatter from "./XwjAnalysisPoolIAO_InformationScatter";
import XwjAnalysisPoolIAO_ChartBox from "./XwjAnalysisPoolIAO_ChartBox";
import XwjAnalysisPoolIAO_PlotConfigBox from "./XwjAnalysisPoolIAO_PlotConfigBox";
import XwjAnalysisPoolIAO_InformationBox from "./XwjAnalysisPoolIAO_InformationBox";
import XwjAnalysisPoolIAO_PlotConfigNormalDistribution from "./XwjAnalysisPoolIAO_PlotConfigNormalDistribution";
import XwjAnalysisPoolIAO_ChartNormalDistribution from "./XwjAnalysisPoolIAO_ChartNormalDistribution";
import XwjAnalysisPoolIAO_InformationNormalDistribution from "./XwjAnalysisPoolIAO_InformationNormalDistribution";
import XwjAnalysisPoolIAO_PlotConfigBar from "./XwjAnalysisPoolIAO_PlotConfigBar";
import XwjAnalysisPoolIAO_ChartBar from "./XwjAnalysisPoolIAO_ChartBar";
import XwjAnalysisPoolIAO_InformationBar from "./XwjAnalysisPoolIAO_InformationBar";
import XwjAnalysisPoolIAO_PlotConfigLine from "./XwjAnalysisPoolIAO_PlotConfigLine";
import XwjAnalysisPoolIAO_ChartLine from "./XwjAnalysisPoolIAO_ChartLine";
import XwjAnalysisPoolIAO_InformationLine from "./XwjAnalysisPoolIAO_InformationLine";
import {withTranslation} from "react-i18next";

const PLOT_SCATTER = 'scatter';
const PLOT_BOX = 'box';
const PLOT_NORMAL_DISTRIBUTION = 'normal_distribution';
const PLOT_BAR = 'bar';
const PLOT_LINE = 'line';

const CHART_TYPE_MAPPER = {
  [PLOT_SCATTER]: {plotType: 1, label: 'analysis_set.plot.plot_scatter'},
  [PLOT_BOX]: {plotType: 2, label: 'analysis_set.plot.plot_box'},
  [PLOT_NORMAL_DISTRIBUTION]: {plotType: 3, label: 'analysis_set.plot.plot_normal_distribution'},
  [PLOT_BAR]: {plotType: 4, label: 'analysis_set.plot.plot_bar'},
  [PLOT_LINE]: {plotType: 5, label: 'analysis_set.plot.plot_line'}
};

class XwjAnalysisPoolIAO_Visualize extends React.PureComponent {
  state = {
    dropdownOpen: false,
    plots: List(),
    fieldsByDatatype: {},
  };

  componentDidMount() {
    let caseId = this.props.analysisPoolInfo.id;
    Promise.all([
      getAnalysisSetPlots(caseId),
      getAnalysisSetFields(caseId)
    ]).then(([plots, fields]) => {
      this.setState({
        plots: List(plots),
        fieldsByDatatype: groupBy(fields, 'dataType'),
      });
    });
  }

  getPlotContainers(plotType) {
    switch (plotType) {
      case CHART_TYPE_MAPPER[PLOT_SCATTER].plotType:
        return {
          graph_name: 'common.plot_scatter',
          config: XwjAnalysisPoolIAO_PlotConfigScatter,
          chart: XwjAnalysisPoolIAO_ChartScatter,
          information: XwjAnalysisPoolIAO_InformationScatter
        };
      case CHART_TYPE_MAPPER[PLOT_BOX].plotType:
        return {
          graph_name: 'common.plot_box',
          config: XwjAnalysisPoolIAO_PlotConfigBox,
          chart: XwjAnalysisPoolIAO_ChartBox,
          information: XwjAnalysisPoolIAO_InformationBox
        };
      case CHART_TYPE_MAPPER[PLOT_NORMAL_DISTRIBUTION].plotType:
        return {
          graph_name: 'common.plot_normal_distribution',
          config: XwjAnalysisPoolIAO_PlotConfigNormalDistribution,
          chart: XwjAnalysisPoolIAO_ChartNormalDistribution,
          information: XwjAnalysisPoolIAO_InformationNormalDistribution
        };
      case CHART_TYPE_MAPPER[PLOT_BAR].plotType:
        return {
          graph_name: 'common.plot_bar',
          config: XwjAnalysisPoolIAO_PlotConfigBar,
          chart: XwjAnalysisPoolIAO_ChartBar,
          information: XwjAnalysisPoolIAO_InformationBar
        };
      case CHART_TYPE_MAPPER[PLOT_LINE].plotType:
        return {
          graph_name: 'common.plot_line',
          config: XwjAnalysisPoolIAO_PlotConfigLine,
          chart: XwjAnalysisPoolIAO_ChartLine,
          information: XwjAnalysisPoolIAO_InformationLine
        };
      default:
        return undefined;
    }
  }

  render() {
    const { t } = this.props;

    return (
      <XwjAnalysisPoolIAO_Panel>
        <XwjAnalysisPoolIAO_PanelHeader caption="分析圖表">
          <Dropdown
            isOpen={this.state.dropdownOpen}
            toggle={() => this.setState(prevState => ({
              dropdownOpen: !prevState.dropdownOpen
            }))}
            size="sm"
          >
            <DropdownToggle caret className="btn-ghost-dark py-1 px-2 mx-1 border-0 shadow-none">
              <i className="fa fa-plus fa-lg" />
            </DropdownToggle>
            <DropdownMenu right>
              {map(CHART_TYPE_MAPPER, (option, key) => (
                <DropdownItem key={key} onClick={e => this.addPlot(option.plotType)}>
                  <img src={`/assets/img/plots/${key}.png`} style={{width: '30px'}} className="mx-1"/>
                  <span>{t(option.label)}</span>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          {/*<Button*/}
          {/*  color="link"*/}
          {/*  className="card-header-action px-3"*/}
          {/*>*/}
          {/*  <i className="fa fa-plus fa-lg" />*/}
          {/*</Button>*/}
        </XwjAnalysisPoolIAO_PanelHeader>
        <XwjAnalysisPoolIAO_PanelBody>
          {this.state.plots.map((plot, index) => {
            plot.plotConfig = isEmpty(plot.plotJson)? null: JSON.parse(plot.plotJson);
            return (
              <XwjAnalysisPoolIAO_VisualizePlotCard
                key={plot.key || plot.id}
                {...this.props}
                plot={plot}
                fieldsByDatatype={this.state.fieldsByDatatype}
                plotContainer={this.getPlotContainers(plot.plotType)}
                deletePlot={this.deletePlot}
                discardPlot={this.discardPlot}
                updatePlot={this.injectPlotHandler(index)}/>
            )
          })}
        </XwjAnalysisPoolIAO_PanelBody>
      </XwjAnalysisPoolIAO_Panel>
    );
  };

  addPlot = plotType => {
    this.setState(prevState => ({
      plots: prevState.plots.insert(0, {
        plotType,
        caseId: this.props.analysisPoolInfo.id,
        plotJson: null,
        key: Date.now(),
      })
    }))
  };

  deletePlot = id => {
    this.setState(prevState => ({
      plots: prevState.plots.filter(plot => (plot.id !== id))
    }));
  };

  discardPlot = key => {
    this.setState(prevState => ({
      plots: prevState.plots.filter(plot => (plot.key !== key))
    }));
  };

  injectPlotHandler = index => {
    return plot => this.setState(prevState => ({
      plots: prevState.plots.set(index, plot)
    }));
  };
}

export default withTranslation()(XwjAnalysisPoolIAO_Visualize);
