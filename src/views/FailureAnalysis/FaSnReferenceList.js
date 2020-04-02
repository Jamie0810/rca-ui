import React, {PureComponent} from "react";
import {Button, Card, CardBody, Col, Row} from "reactstrap";
import moment from "moment";
import {withTranslation} from "react-i18next";

class FaSnReferenceList extends PureComponent {
  render () {
    const { t } = this.props;

    return (
      <React.Fragment>
        {this.props.faReferences.map(item => {
          return (
            <Card className="mb-3 mx-2" key={item.testing_id}>
              <CardBody className="py-2">
                <div className="position-absolute" style={{ top: '1em', right: '1em', zIndex: 1000 }}>
                  <Button
                    color="danger" className="text-white" size="sm"
                    onClick={() => this.props.itemRemoveHandler(item)}>
                    <i className="fa fa-trash-o icons font-lg" />
                  </Button>
                </div>
                <Row className="px-2">
                  <Col md={2} xl={1}><div className="h7 text-muted">{t('common.sn')}</div></Col>
                  <Col md={3}><div className="h7 font-weight-bold">{item.sn}</div></Col>
                  <Col md={2} xl={1}><div className="h7 text-muted">{t('defect.test_station')}</div></Col>
                  <Col><div className="h7 font-weight-bold">{item.station}</div></Col>
                </Row>
                <Row className="px-2">
                  <Col md={2} xl={1}><div className="h7 text-muted">{t('defect.test_datetime')}</div></Col>
                  <Col md={3}><div className="h7 font-weight-bold">{moment(item.testStartTime).format('YYYY-MM-DD HH:mm')}</div></Col>
                  <Col md={2} xl={1}><div className="h7 text-muted">{t('defect.fail_symptom')}</div></Col>
                  <Col md={3}><div className="h7 font-weight-bold">{item.failureSymptom}</div></Col>
                  {/*<Col className="mr-3 h7 font-weight-bold">*/}
                  {/*  {item.failSymptom.map(symptomItem => (*/}
                  {/*    <span*/}
                  {/*      key={symptomItem}*/}
                  {/*      className="mb-0 mr-2 pr-2 d-inline-block border-right">{symptomItem}</span>*/}
                  {/*  ))}*/}
                  {/*</Col>*/}
                </Row>
                {item.fatalDesc? (
                  <React.Fragment>
                    <div className="border-top mt-1 mb-2" />
                    <Row className="px-2">
                      <Col>
                        <div className="h6 text-muted mb-0 fatal-desc">{item.fatalDesc}</div>
                      </Col>
                    </Row>
                  </React.Fragment>
                ): null}
              </CardBody>
            </Card>
          );
        })}
      </React.Fragment>
    );
  }
}

export default withTranslation()(FaSnReferenceList);

