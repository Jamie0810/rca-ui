import React from "react";
import {Button, Card, CardBody} from "reactstrap";

class XwjAnalysisPoolIAO_PlotCard extends React.PureComponent {
  render() {
    return (
      <Card>
        <CardBody className="px-2">
          <div style={{height: '360px'}}>
            {this.props.children}
          </div>
        </CardBody>
      </Card>
    );
  };
}

class XwjAnalysisPoolIAO_PlotCardBody extends React.PureComponent {
  render() {
    return (
      <div className="d-flex justify-content-start h-100 animated fadeIn">
        {this.props.children}
      </div>
    );
  }
}

class XwjAnalysisPoolIAO_PlotFooter extends React.PureComponent {
  render() {
    return (
      <div>{this.props.children}</div>
    );
  }
}

class XwjAnalysisPoolIAO_PlotLeftPad extends React.PureComponent {
  render() {
    return (
      <div className="px-1">{this.props.children}</div>
    );
  }
}

class XwjAnalysisPoolIAO_PlotRightFill extends React.PureComponent {
  render() {
    return (
      <div className="flex-fill overflow-hidden px-1">{this.props.children}</div>
    );
  }
}

class XwjAnalysisPoolIAO_PlotAction extends React.PureComponent {
  render() {
    return (
      <div className="d-flex align-items-end flex-column h-100 pt-3" style={{width: '30px'}}>
        {this.props.children}
      </div>
    );
  };
}

export {
  XwjAnalysisPoolIAO_PlotCard,
  XwjAnalysisPoolIAO_PlotCardBody,
  XwjAnalysisPoolIAO_PlotLeftPad,
  XwjAnalysisPoolIAO_PlotRightFill,
  XwjAnalysisPoolIAO_PlotFooter,
  XwjAnalysisPoolIAO_PlotAction
};
