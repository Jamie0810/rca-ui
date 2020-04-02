import React from "react";
import {XwjAnalysisPoolIAO_PlotCard} from "./XwjAnalysisPoolIAO_PlotLayout";
import XwjAnalysisPoolIAO_VisualizePlotEdit from "./XwjAnalysisPoolIAO_VisualizePlotEdit";
import XwjAnalysisPoolIAO_VisualizePlotReveal from "./XwjAnalysisPoolIAO_VisualizePlotReveal";
import withLoading from "../../utils/hoc/withLoading";

class XwjAnalysisPoolIAO_VisualizePlotCard extends React.PureComponent {
  state = {
    isEdit: !this.props.plot.id,
  };

  PlotContent(isEdit) {
    return isEdit? XwjAnalysisPoolIAO_VisualizePlotEdit: XwjAnalysisPoolIAO_VisualizePlotReveal;
  };

  render() {
    let PlotContent = this.PlotContent(this.state.isEdit);
    return (
      <XwjAnalysisPoolIAO_PlotCard>
        {/*{this.getPlotContent(this.state.isEdit)}*/}
        <PlotContent
          {...this.props}
          isEdit={this.state.isEdit}
          toggle={this.toggle}
        />
      </XwjAnalysisPoolIAO_PlotCard>
    );
  }

  toggle = () => {
    this.setState(prevState => ({ isEdit: !prevState.isEdit }));
  }
}

export default withLoading(XwjAnalysisPoolIAO_VisualizePlotCard);
