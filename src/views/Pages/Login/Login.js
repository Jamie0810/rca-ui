import React, {PureComponent} from 'react';
// import { Link } from 'react-router-dom';
import {
  Button, Col, Form, Input, InputGroup, InputGroupAddon,
  InputGroupText, Row
} from 'reactstrap';
import {login} from '../../../action/profile-action'
import {SITE_TITLE} from '../../../utils/site-util'
import {removeAllCookies} from '../../../utils/cookie-util'
import withNotify from '../../../utils/hoc/withNotify'
import {withTranslation} from "react-i18next";
// import { instanceOf } from 'prop-types';
// import { withCookies, Cookies } from 'react-cookie';

class Login extends PureComponent {
  // static propTypes = {
  //   cookies: instanceOf(Cookies).isRequired
  // };

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false
    };
  }

  componentDidMount() {
    removeAllCookies();
  }

  doLogin = (e) => {
    e.preventDefault();
    // const { cookies } = this.props;

    // console.log('doLogin');
    // console.log(process.env.REACT_APP_REMOTE_API_DOMAIN);
    let username = this.username.value;
    let password = this.password.value;
    login(username, password).then(result => {
      // console.log(window.history.state.target);
      // setCookie('menu', menu);

      this.props.history.push({
        // pathname: (this.props.location.state && this.props.location.state.target) || '/',
        pathname: this.props.location.hash || '/'
        // state: menu
      });
      // this.props.history.goBack();
    }).catch(message => {
      this.props.pushNotification(this.props.t('message.profile.login_failed'));
    });
  };

  render() {
    const { t } = this.props;

    return (
      <div className="app bg-white">
        <Row className="mx-0" style={{ height: '100vh', width: '100vw' }}>

          <Col md={8} className="d-md-none pr-0 d-flex align-items-center justify-content-center" style={{
            backgroundImage: 'url("/assets/img/login-bg.jpg")',
            height: '35%'
          }}
          >
            <div className="text-white text-center">
              <h2>{t('login.caption.part1')}</h2>
              <h1>{t('login.caption.part2')}</h1>
              <h3 className="text-muted">{t('login.caption.part3')}</h3>
            </div>
          </Col>

          <Col lg={9} md={8} className="d-sm-down-none pr-0 d-flex align-items-center justify-content-center" style={{
            backgroundImage: 'url("/assets/img/login-bg.jpg")',
            // height: '100%'
          }}
          >
            <div className="text-white text-center">
              <h2>{t('login.caption.part1')}</h2>
              <h1>{t('login.caption.part2')}</h1>
              <h3 className="text-muted">{t('login.caption.part3')}</h3>
            </div>
          </Col>


          <Col className="d-flex align-items-md-center">
            <div className="w-100 d-flex justify-content-center">
              <div className="w-75">
                <p className="text-muted h4">{SITE_TITLE} {t('login.form.title')}</p>
                <Form>
                  <InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="icon-user"/>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input type="text" placeholder={t('login.form.username')} innerRef={ref => this.username = ref} autoComplete="username" />
                  </InputGroup>
                  <InputGroup className="mb-4">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="icon-lock"></i>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input type="password" placeholder={t('login.form.password')} innerRef={ref => this.password = ref} autoComplete="current-password" />
                  </InputGroup>
                  <Button type="submit" color="primary" className="px-4" onClick={this.doLogin}>{t('common.login')}</Button>
                </Form>
              </div>
            </div>
          </Col>
        </Row>
        {/*<div*/}
          {/*className="d-flex align-items-center justify-content-center"*/}
          {/*style={{*/}
            {/*backgroundImage: 'url("/assets/img/bg-login.jpg")',*/}
            {/*height: '100vh',*/}
            {/*width: '65vw'*/}
          {/*}}*/}
        {/*>*/}
          {/*<div className="text-white text-center">*/}
            {/*<h2>新一代</h2>*/}
            {/*<h1>全廠良率溯源智能化方案</h1>*/}
            {/*<h3 className="text-muted">WYJ·FDJ·XWJ</h3>*/}
          {/*</div>*/}
        {/*</div>*/}
        {/*<div className="bg-white flex-fill p-4 d-flex align-items-center justify-content-center">*/}
          {/*<div className="w-75">*/}
            {/*<p className="text-muted h4">{SITE_TITLE} 用户登入</p>*/}
            {/*<Form>*/}
              {/*<InputGroup className="mb-3">*/}
                {/*<InputGroupAddon addonType="prepend">*/}
                  {/*<InputGroupText>*/}
                    {/*<i className="icon-user"/>*/}
                  {/*</InputGroupText>*/}
                {/*</InputGroupAddon>*/}
                {/*<Input type="text" placeholder="Username" innerRef={ref => this.username = ref} autoComplete="username" />*/}
              {/*</InputGroup>*/}
              {/*<InputGroup className="mb-4">*/}
                {/*<InputGroupAddon addonType="prepend">*/}
                  {/*<InputGroupText>*/}
                    {/*<i className="icon-lock"></i>*/}
                  {/*</InputGroupText>*/}
                {/*</InputGroupAddon>*/}
                {/*<Input type="password" placeholder="Password" innerRef={ref => this.password = ref} autoComplete="current-password" />*/}
              {/*</InputGroup>*/}
              {/*<Row>*/}
                {/*<Col xs="6">*/}
                  {/*<Button type="submit" color="primary" className="px-4" onClick={this.doLogin}>Login</Button>*/}
                {/*</Col>*/}
              {/*</Row>*/}
            {/*</Form>*/}
          {/*</div>*/}
        {/*</div>*/}
      </div>
    );
  }
}

// export default withCookies(Login);
export default withTranslation()(withNotify(Login));
