import React from 'react';
import { Button, Col, Container, FormGroup, Row, NavItem } from 'reactstrap';
import withNotify from "../../utils/hoc/withNotify";
import { SITE_TITLE } from "../../utils/site-util";
import {getCookie, setCookie} from '../../utils/cookie-util';
import withLoading from "../../utils/hoc/withLoading";
import Nav from "reactstrap/es/Nav";
import WjyQueryFormByProduct from "./WjyQueryFormByProduct";
import WjyQueryFormByLine from "./WjyQueryFormByLine";
import {withTranslation} from "react-i18next";
import {getProductFloorLines} from "../../action/defective-action";

class WyjQueryForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.TABS = {
      BY_PRODUCT: 'byProduct',
      BY_LINE: 'byLine'
    };
    this.prevState = getCookie('wyj-state') || {};
    this.criteria = this.prevState.criteria || {};
    // console.log(this.criteria);
    // let {product, floor, line, startTimeStr, stopTimeStr} = this.criteria;
    this.state = {
      activeTab: this.prevState.activeTab || this.TABS.BY_PRODUCT,
      productFloorLine: null,
      // products: [],
    };
  }

  componentDidMount () {
    document.title = `${this.props.t('common.wyj')} (${SITE_TITLE})`;
    getProductFloorLines()
      .then(productFloorLine => this.setState({ productFloorLine }))
      .catch(this.showAlert)
      .finally(this.props.toggleLoading);
  }

  render () {
    const { t } = this.props;
    let FormBody = 'div';
    let criteria = (this.prevState.activeTab === this.state.activeTab)? this.criteria: {};
    if (this.state.activeTab === this.TABS.BY_PRODUCT) {
      FormBody = WjyQueryFormByProduct;
    } else if (this.state.activeTab === this.TABS.BY_LINE) {
      FormBody = WjyQueryFormByLine;
    }

    return (
      <div className="app text-white wyj-background-color">
        <Container>
          <div className="mt-5 text-center border-bottom display-4 font-weight-normal">
            <div className="wyj-text-brown">{t('common.wyj')}</div>
            <div className="wyj-text-brown">(WYJ)</div>
            <div className="h1">{SITE_TITLE}</div>
          </div>
          <div className="h2 mt-4 pb-4 text-center">{t('wyj.criteria_setting')}</div>
          <Row className="justify-content-center mb-3">
            <Col md={5}>
              <Nav fill>
                <NavItem>
                  <Button
                    block outline active={this.state.activeTab === this.TABS.BY_PRODUCT}
                    className="shadow-none" style={{borderRadius: 0}}
                    onClick={e => this.setState({ activeTab: this.TABS.BY_PRODUCT })}>
                    <div className="h5 my-auto">{t('wyj.by_product')}</div>
                  </Button>
                </NavItem>
                <NavItem>
                  <Button
                    block outline active={this.state.activeTab === this.TABS.BY_LINE}
                    className="shadow-none" style={{borderRadius: 0}}
                    onClick={e => this.setState({ activeTab: this.TABS.BY_LINE })}>
                    <div className="h5 my-auto">{t('wyj.by_line')}</div>
                  </Button>
                </NavItem>
              </Nav>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md={10}>
              {this.state.productFloorLine? (
                <FormBody
                  ref={ref => this.criteriaForm = ref}
                  {...this.props}
                  {...this.state}
                  criteria={criteria}/>
              ): null}
              <FormGroup row>
                <Col className="h4 text-center">
                  <Button
                    type="button"
                    size="md"
                    className="btn-secondary wyj-button-textColor font-weight-bold mb-5"
                    onClick={this.submitCriteria}>{t('wyj.open_dashboard')}
                  </Button>
                </Col>
              </FormGroup>
            </Col>
          </Row>
        </Container>
        <span className="fixed-bottom mb-3 text-center font-weight-bold">{t('wyj.recommend_resolution')}</span>
      </div>
    );
  }

  showAlert = () => {
    // this._mounted &&
    this.props.toggleLoading(false, () => {
      this.props.pushNotification(this.props.t('message.system.error'));
    });
  };
 
  // optionChangeHandler = e => {
  //   if(e.target.value === 'option1'){
  //     // console.log(e.target.value);
  //   } else {
  //     // console.log(e.target.value);
  //   }
  // }

  submitCriteria = e => {
    let criteria = this.criteriaForm.getCriteria();

    if (criteria) {
      setCookie('wyj-state', {criteria, activeTab: this.state.activeTab});
      this.props.history.push('/wyjDashBoard');
    }
  };
}

export default withTranslation()(withLoading(withNotify(WyjQueryForm), true));
