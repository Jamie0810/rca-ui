import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem } from 'reactstrap';
import PropTypes from 'prop-types';
import {find} from 'lodash';

import { AppSidebarToggler } from '@coreui/react';
import {SITE_TITLE} from "../../utils/site-util";
import {withTranslation} from 'react-i18next';
import i18next from "i18next";
import ChangePasswordModal from "../../views/Profile/ChangePasswordModal";
// import logo from '../../assets/img/brand/logo.svg'
// import sygnet from '../../assets/img/brand/sygnet.svg'

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

const languages = [
  {lang: 'zh-TW', label: '正體中文'},
  {lang: 'en-US', label: 'EN'}
];

class DefaultHeader extends Component {

  state = {
    language: find(languages, {lang: i18next.language}) || languages[0],
    changePasswordModal: false
  };

  setLang = language => {
    i18next.changeLanguage(language.lang)
      .then(t => this.setState({ language }));
  };

  onChangePassword = e => {
    this.setState({ changePasswordModal: true })
  };

  render() {
    const { t } = this.props;

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        {/*<AppNavbarBrand*/}
          {/*full={{ src: logo, width: 89, height: 25, alt: 'CoreUI Logo' }}*/}
          {/*minimized={{ src: sygnet, width: 30, height: 30, alt: 'CoreUI Logo' }}*/}
        {/*/>*/}
        <AppSidebarToggler className="d-md-down-none" display="lg" />

        <Nav className="d-md-down-none" navbar>
          <NavItem className="px-3">
            <NavLink to="/" className="nav-link">{t('site')}({SITE_TITLE})</NavLink>
          </NavItem>
          {/*<NavItem className="px-3">*/}
            {/*<Link to="/users">Users</Link>*/}
          {/*</NavItem>*/}
          {/*<NavItem className="px-3">*/}
            {/*<NavLink href="#">Settings</NavLink>*/}
          {/*</NavItem>*/}
        </Nav>
        <Nav className="ml-auto" navbar>
          {/*<NavItem className="d-md-down-none">*/}
            {/*<NavLink href="#"><i className="icon-bell"></i><Badge pill color="danger">5</Badge></NavLink>*/}
          {/*</NavItem>*/}
          {/*<NavItem className="d-md-down-none">*/}
            {/*<NavLink href="#"><i className="icon-list"></i></NavLink>*/}
          {/*</NavItem>*/}
          {/*<NavItem className="d-md-down-none">*/}
            {/*<NavLink href="#"><i className="icon-location-pin"></i></NavLink>*/}
          {/*</NavItem>*/}

          {/* language setting */}
          <UncontrolledDropdown nav direction="left">
            <DropdownToggle nav>
              {this.state.language.label}
            </DropdownToggle>
            <DropdownMenu right>
              {languages.map(language => (
                <DropdownItem key={language.lang} onClick={e => this.setLang(language)}>{language.label}</DropdownItem>
              ))}
            </DropdownMenu>
          </UncontrolledDropdown>

          <UncontrolledDropdown nav direction="down">
            <DropdownToggle nav>
              <img src={'/assets/img/avatars/user.png'} className="img-avatar" alt="admin@bootstrapmaster.com" />
            </DropdownToggle>
            <DropdownMenu right>
              {/*<DropdownItem header tag="div" className="text-center"><strong>Account</strong></DropdownItem>*/}
              {/*<DropdownItem><i className="fa fa-bell-o"></i> Updates<Badge color="info">42</Badge></DropdownItem>*/}
              {/*<DropdownItem><i className="fa fa-envelope-o"></i> Messages<Badge color="success">42</Badge></DropdownItem>*/}
              {/*<DropdownItem><i className="fa fa-tasks"></i> Tasks<Badge color="danger">42</Badge></DropdownItem>*/}
              {/*<DropdownItem><i className="fa fa-comments"></i> Comments<Badge color="warning">42</Badge></DropdownItem>*/}
              {/*<DropdownItem header tag="div" className="text-center"><strong>Settings</strong></DropdownItem>*/}
              {/*<DropdownItem><i className="fa fa-user"></i> Profile</DropdownItem>*/}
              {/*<DropdownItem><i className="fa fa-wrench"></i> Settings</DropdownItem>*/}
              {/*<DropdownItem><i className="fa fa-usd"></i> Payments<Badge color="secondary">42</Badge></DropdownItem>*/}
              {/*<DropdownItem><i className="fa fa-file"></i> Projects<Badge color="primary">42</Badge></DropdownItem>*/}
              {/*<DropdownItem divider />*/}
              {/*<DropdownItem><i className="fa fa-shield"></i> Lock Account</DropdownItem>*/}
              <DropdownItem onClick={e => this.onChangePassword(e)}><i className="fa fa-lock" />{t('common.change_password')}</DropdownItem>
              <DropdownItem onClick={e => this.props.onLogout(e)}><i className="fa fa-sign-out" />{t('common.logout')}</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
        {/*<AppAsideToggler className="d-md-down-none" />*/}
        {/*<AppAsideToggler className="d-lg-none" mobile />*/}
        <ChangePasswordModal isOpen={this.state.changePasswordModal} toggle={e => this.setState({ changePasswordModal: false })} />
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default withTranslation()(DefaultHeader);
