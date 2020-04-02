import React from "react";
import {Button} from "reactstrap";
import XwjAnalysisPoolIAO_TargetDelimit from "./XwjAnalysisPoolIAO_TargetDelimit";
import XwjAnalysisPoolIAO_TargetStatistics from "./XwjAnalysisPoolIAO_TargetStatistics";
import XwjAnalysisPoolIAO_TargetReveal from "./XwjAnalysisPoolIAO_TargetReveal";
import {
  XwjAnalysisPoolIAO_Panel,
  XwjAnalysisPoolIAO_PanelBody,
  XwjAnalysisPoolIAO_PanelHeader
} from "./XwjAnalysisPoolIAO_Panel";
import {withTranslation} from "react-i18next";

const TAB_DELIMIT = 'delimit';
const TAB_REVEAL = 'reveal';
const TAB_STATISTICS = 'statistics';

class XwjAnalysisPoolIAO_Target extends React.PureComponent {
  state = {
    activeTab: TAB_DELIMIT
  };

  CAPTION_MAPPER = {
    [TAB_DELIMIT]: 'analysis_set.target.configuration',
    [TAB_REVEAL]: 'analysis_set.target.data_pool',
    [TAB_STATISTICS]: 'analysis_set.target.statistic',
  };

  PoolTargetContent(props) {
    switch (props.activeTab) {
      case TAB_DELIMIT:
        return (<XwjAnalysisPoolIAO_TargetDelimit {...props}/>);
      case TAB_REVEAL:
        return (<XwjAnalysisPoolIAO_TargetReveal {...props}/>);
      case TAB_STATISTICS:
        return (<XwjAnalysisPoolIAO_TargetStatistics {...props}/>);
      default:
        return null;
    }
  };

  render() {
    const { t } = this.props;
    let PoolTargetContent = this.PoolTargetContent;

    return (
      <XwjAnalysisPoolIAO_Panel>
        <XwjAnalysisPoolIAO_PanelHeader caption={t(this.CAPTION_MAPPER[this.state.activeTab])}>
          <Button
            color="dark"
            size="sm"
            className="btn-ghost-dark py-1 px-2 mx-1 shadow-none"
            disabled={this.state.activeTab === TAB_DELIMIT}
            onClick={e => this.setState({ activeTab: TAB_DELIMIT })}
          >
            <i className="fa fa-gear fa-lg" />
          </Button>
          <Button
            color="dark"
            size="sm"
            className="btn-ghost-dark py-1 px-2 mx-1 shadow-none"
            disabled={this.state.activeTab === TAB_REVEAL}
            onClick={e => this.setState({ activeTab: TAB_REVEAL })}
          >
            <i className="fa fa-list fa-lg" />
          </Button>
          <Button
            color="dark"
            size="sm"
            className="btn-ghost-dark py-1 px-2 mx-1 shadow-none"
            disabled={this.state.activeTab === TAB_STATISTICS}
            onClick={e => this.setState({ activeTab: TAB_STATISTICS })}
          >
            <i className="fa fa-bar-chart fa-lg" />
          </Button>
        </XwjAnalysisPoolIAO_PanelHeader>
        <XwjAnalysisPoolIAO_PanelBody>
          <PoolTargetContent {...this.props} activeTab={this.state.activeTab}/>
        </XwjAnalysisPoolIAO_PanelBody>
      </XwjAnalysisPoolIAO_Panel>
    );
  };
}

export default withTranslation()(XwjAnalysisPoolIAO_Target);
