import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
// import { renderRoutes } from 'react-router-config';
import './App.scss';
import {PATHS} from "./utils/site-util";
import withTracking from "./utils/hoc/withTracking";

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

// Containers
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));

// Pages
const Login = React.lazy(() => import('./views/Pages/Login/Login'));
const Register = React.lazy(() => import('./views/Demo/Pages/Register'));
const Page404 = React.lazy(() => import('./views/Demo/Pages/Page404'));
const Page500 = React.lazy(() => import('./views/Demo/Pages/Page500'));
const XwjMatrixDashboard = React.lazy(() => import('./views/XWJ/XwjMatrixDashboard'));
const WyjQuery = React.lazy(() => import('./views/Wyj/WyjQueryForm'));
const WyjDashboard = React.lazy(() => import('./views/Wyj/DashBoard'));
// const RcaLogin = React.lazy(() => import('./views/RCA/_Dev/Login'));

class App extends Component {
  render() {
    return (
      <HashRouter>
        <React.Suspense fallback={loading()}>
          <Switch>
            <Route exact path={PATHS.login.path} name="Login Page" component={Login} />
            <Route exact path={PATHS.wyj.path} name="Query Page" component={withTracking(WyjQuery, 'wyj')} />
            <Route exact path={PATHS.wyj_dashboard.path} name="WYJ DashBoard" component={withTracking(WyjDashboard, 'wyj_dashboard')} />
            <Route exact path={PATHS.wyj_matrix.path} name="XWJ Matrix" component={withTracking(XwjMatrixDashboard, 'wyj_matrix')} />
            <Route exact path={PATHS.register.path} name="Register Page" component={Register} />
            <Route exact path={PATHS.page_404.path} name="Page 404" component={Page404} />
            <Route exact path={PATHS.page_500.path} name="Page 500" component={Page500} />
            <Route path={PATHS.index.path} name="Home" component={DefaultLayout} />
          </Switch>
        </React.Suspense>
      </HashRouter>
    );
  }
}

export default App;
