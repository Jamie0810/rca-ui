import React from "react";
import { getDataset } from '../../../src/action/dataset-action';
import withLoading from "../../utils/hoc/withLoading";
import XwjDatasetRevealInformation from "./XwjDatasetRevealInformation";

class XwjDataSetSourceInfo extends React.Component{

  state = {
    dataset: {},
  }

  componentDidMount() {
    getDataset(this.props.dataSetId)
      .then(dataset => this.setState({ dataset }))
      .finally(this.props.toggleLoading);
  }

  render() {
    return (
      <XwjDatasetRevealInformation {...this.state.dataset}/>
    );
  }
}
export default withLoading(XwjDataSetSourceInfo, true);
