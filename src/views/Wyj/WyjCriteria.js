import React, {PureComponent} from 'react';
import {Row, Col, Tooltip} from 'reactstrap';
import {withTranslation} from "react-i18next";

const TipContent = withTranslation()(
  class extends PureComponent {
    render() {
      if (!this.props.validationData)
        return (<i className="fa fa-spinner fa-lg"/>);

      const { t } = this.props;

      return (
        <div className="text-left">
          <div>{t('wyj.criteria_tip.part1', {start: this.props.dataStartTime, end: this.props.dataEndTime})}</div>
          <div>{' '}</div>
          <div>{t('wyj.criteria_tip.part2')}</div>
          <div>{t('wyj.criteria_tip.part3', {data: this.props.validationData.minio})}</div>
          <div>{t('wyj.criteria_tip.part4', {data: this.props.validationData.mysql})}</div>
          <div>{t('wyj.criteria_tip.part5', {data: this.props.validationData.cockroach})}</div>
        </div>
      );
    }
  }
);

class WyjCriteria extends PureComponent {

  state = {
    tipOpen: false,
  };

	render () {
	  const { t } = this.props;
		return (
			<Row>
				<Col lg={3}>
          <div className="h2 font-weight-bold text-white">
            {this.props.line}
          </div>
					<div className="h3 font-weight-bold text-muted">{t('common.line')}</div>
				</Col>
				<Col lg={3}>
          <div className="h2 font-weight-bold text-white">
            {this.props.prod}
          </div>
					<div className="h3 font-weight-bold text-muted">{t('common.product')}</div>
				</Col>
				<Col lg={6}>
          <div className="h2 font-weight-bold text-white">
            {this.props.startTime}~{this.props.stopTime}
          </div>
					<div className="h3 font-weight-bold text-muted">
            <span>{t('wyj.analyze_range')}</span>
            <span id="validation_date_tip"><i className="fa fa-info-circle" /></span>
            <Tooltip
              placement="right"
              isOpen={this.state.tipOpen}
              autohide={false}
              target="validation_date_tip"
              toggle={this.tipToggle}>
              <TipContent
                dataStartTime={this.props.dataStartTime}
                dataEndTime={this.props.dataEndTime}
                validationData={this.props.validationData}/>
            </Tooltip>
					</div>
				</Col>
			</Row>
		);
	}

  tipToggle = () => {
    this.setState({ tipOpen: !this.state.tipOpen });
  };
}

export default withTranslation()(WyjCriteria);
