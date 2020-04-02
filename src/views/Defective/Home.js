import React from "react";
import {getLatestValidationTime} from "../../action/validation-action";
import {Card, CardBody, CardHeader, Col, FormGroup, Input, Label} from "reactstrap";
import withLoading from "../../utils/hoc/withLoading";
import withNotify from "../../utils/hoc/withNotify";
import {withTranslation} from "react-i18next";

class Home extends React.PureComponent {
  state = {};

  componentDidMount() {
    getLatestValidationTime()
      .then(data => this.setState({...data}))
      .catch(error => this.props.pushNotification('平台運行資訊獲取失敗'))
      .finally(this.props.toggleLoading);
  }

  render() {
    const { t } = this.props;

    return (
      <Card>
        <CardHeader>{t('dashboard.platform_information')}</CardHeader>
        <CardBody>
          <CardHeader className="bg-white pb-2">
            <span className="font-weight-bold h5">{t('dashboard.platform_data_analysis')}</span>
          </CardHeader>
          <CardBody>
            <FormGroup row>
              <Col md="3" className="my-auto">
                <Label size="sm" className="float-right my-auto font-weight-bold">
                  {t('dashboard.latest_adopted_test_data')}
                </Label>
              </Col>
              <Col className="border-left my-auto">
                <Label size="sm" className="my-auto">{this.state.minio}</Label>
              </Col>
            </FormGroup>
            
            <FormGroup row>
              <Col md="3" className="my-auto">
                <Label size="sm" className="float-right my-auto font-weight-bold">
                  {t('dashboard.latest_integrated_test_data')}
                </Label>
              </Col>
              <Col className="border-left my-auto">
                <Label size="sm" className="my-auto">{this.state.cockroach}</Label>
              </Col>
            </FormGroup>
            
            <FormGroup row>
              <Col md="3" className="my-auto">
                <Label size="sm" className="float-right my-auto font-weight-bold">
                  {t('dashboard.latest_calculated_test_data')}
                </Label>
              </Col>
              <Col className="border-left my-auto">
                <Label size="sm" className="my-auto">{this.state.mysql}</Label>
              </Col>
            </FormGroup>

            <FormGroup row>
              <Col className="my-auto px-5">
                <Label
                  size="sm"
                  className="font-weight-bold border px-4 py-2 w-100">
                  {t('dashboard.data_processing_tips.data_processing_steps')}<br/>
                  {t('dashboard.data_processing_tips.data_processing_step_1')}<br/>
                  {t('dashboard.data_processing_tips.data_processing_step_2')}<br/>
                  {t('dashboard.data_processing_tips.data_processing_step_3')}
                </Label>
              </Col>
            </FormGroup>
          </CardBody>
        </CardBody>
      </Card>
    );
  }
}

export default withTranslation()(withNotify(withLoading(Home, true)));
