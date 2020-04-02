import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';

import {
  // AppAside,
  AppBreadcrumb,
  AppFooter,
  AppHeader,
  AppSidebar,
  // AppSidebarFooter,
  // AppSidebarForm,
  // AppSidebarHeader,
  // AppSidebarMinimizer,
  // AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
// import navigation from '../../_nav';
// routes config
import {logout} from '../../action/profile-action';
import {removeAllCookies} from "../../utils/cookie-util";
import withLogin from "../../utils/hoc/withLogin";
import {withTranslation} from "react-i18next";
import {routes} from "../../routes";

const RcaSideBarNav = React.lazy(() => import('./RcaSideBarNav'));
// const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));

class DefaultLayout extends Component {

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  signOut(e) {
    e.preventDefault();
    logout().then(() => {
      removeAllCookies();
      this.props.history.push('/login');
    });
  }

  render() {
    let _routes = routes();
    let lang = this.props.i18n.language;
    return (
      <div className="app">
        <AppHeader fixed>
          <Suspense  fallback={this.loading()}>
            <DefaultHeader onLogout={e=>this.signOut(e)}/>
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            {/*<AppSidebarHeader />*/}
            {/*<AppSidebarForm />*/}
            <Suspense fallback={this.loading()}>
            <RcaSideBarNav lang={lang} {...this.props} />
            {/*<RcaSideBarNav {...this.props}/>*/}
            </Suspense>
            {/*<AppSidebarFooter />*/}
            {/*<AppSidebarMinimizer />*/}
          </AppSidebar>
          <main className="main">
            <AppBreadcrumb key={lang} appRoutes={_routes}/>
            <Container fluid>
              <Suspense fallback={this.loading()}>
                <Switch>
                  {_routes.map((route, idx) => {
                    return route.component ? (
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={props => (
                          <route.component {...props} />
                        )} />
                    ) : (null);
                  })}
                  <Redirect from="/" to="/home" />
                  {/*<Redirect to="/defective/query" />*/}
                </Switch>
              </Suspense>
            </Container>
          </main>
          {/*<AppAside fixed>*/}
            {/*<Suspense fallback={this.loading()}>*/}
              {/*<DefaultAside />*/}
            {/*</Suspense>*/}
          {/*</AppAside>*/}
        </div>
        <AppFooter>
          <Suspense fallback={this.loading()}>
            <DefaultFooter />
          </Suspense>
        </AppFooter>
      </div>
    );
  }
}

export default withTranslation()(withLogin(DefaultLayout));
