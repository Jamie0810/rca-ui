import React from "react";
import Card from "reactstrap/es/Card";
import CardHeader from "reactstrap/es/CardHeader";
import CardBody from "reactstrap/es/CardBody";

class XwjAnalysisPoolIAO_Panel extends React.PureComponent {
  render() {
    return (
      <Card className="border-0 m-0">
        {this.props.children}
      </Card>
    );
  }
}

class XwjAnalysisPoolIAO_PanelHeader extends React.PureComponent {
  render() {
    return (
      <CardHeader className="bg-white pb-2">
        <span className="font-weight-bold h5">{this.props.caption}</span>
        <div className="card-header-actions px-3">{this.props.children}</div>
      </CardHeader>
    );
  };
}

class XwjAnalysisPoolIAO_PanelBody extends React.PureComponent {
  render() {
    return (
      <CardBody>
        {this.props.children}
      </CardBody>
    );
  }
}

export {
  XwjAnalysisPoolIAO_Panel,
  XwjAnalysisPoolIAO_PanelHeader,
  XwjAnalysisPoolIAO_PanelBody
}
