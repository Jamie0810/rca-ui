import React, {PureComponent} from 'react';
// import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import {devLogin} from '../../action/profile-action'
import {removeAllCookies} from '../../utils/cookie-util'
import {withTranslation} from "react-i18next";
import withNotify from "../../utils/hoc/withNotify";
// import { instanceOf } from 'prop-types';

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

    devLogin(username, password)
      .then(result => {

        this.props.history.push({
          pathname: (this.props.location.state && this.props.location.state.target) || '/',
          // state: menu
        });
      })
      .catch(message => {
        this.props.pushNotification(message);
      });

  };

  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form>
                      <h1>放大鏡 FDJ</h1>
                      <p className="text-muted">後台管理者 用户登入</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"/>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" placeholder="Username" innerRef={ref => this.username = ref} autoComplete="username" />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password" placeholder="Password" innerRef={ref => this.password = ref} autoComplete="current-password" />
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button type="submit" color="primary" className="px-4" onClick={this.doLogin}>Login</Button>
                        </Col>
                        {/*<Col xs="6" className="text-right">*/}
                        {/*<Button color="link" className="px-0">Forgot password?</Button>*/}
                        {/*</Col>*/}
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                {/*<Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>*/}
                {/*<CardBody className="text-center">*/}
                {/*<div>*/}
                {/*<h2>Sign up</h2>*/}
                {/*<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut*/}
                {/*labore et dolore magna aliqua.</p>*/}
                {/*<Link to="/register">*/}
                {/*<Button color="primary" className="mt-3" active tabIndex={-1}>Register Now!</Button>*/}
                {/*</Link>*/}
                {/*</div>*/}
                {/*</CardBody>*/}
                {/*</Card>*/}
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default withTranslation()(withNotify(Login));;
