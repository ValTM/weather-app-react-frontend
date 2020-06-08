import { createBrowserHistory } from 'history';
import React, { Component, lazy, Suspense } from 'react';
import './App.css';
import { Redirect, Route, Router as BrowserRouter, Switch } from 'react-router-dom';
import { GuardedRoute, GuardProvider } from 'react-router-guards';
import { GuardFunctionRouteProps, GuardToRoute, Next } from 'react-router-guards/dist/types';
import Cookies from 'js-cookie';
import { authCookieName, ROUTES, TokenType } from '../../utils/CommonConstants';
import jwtDecode from 'jwt-decode';
import RedirectButton from '../../components/RedirectButton';
import AxiosWrapper from '../../utils/AxiosWrapper';

const Dashboard = lazy(() => import(/* webpackChunkName: "pages/Dashboard" */'../../pages/Dashboard/Dashboard'));
const Login = lazy(() => import(/* webpackChunkName: "pages/Login" */'../../pages/Login/Login'));
const Users = lazy(() => import(/* webpackChunkName: "pages/Users" */'../../pages/Users/Users'));

const history = createBrowserHistory();

export default class App extends Component {
  constructor(params: any) {
    super(params);
    if (App.isAuthenticated()) {
      AxiosWrapper.getInstance().setAuthorization(Cookies.get(authCookieName)!);
    }
  }

  private static isAuthenticated() {
    const token = Cookies.get(authCookieName);
    if (!token) return false;
    return (jwtDecode(token) as TokenType).exp >= Date.now().valueOf() / 1000;
  };

  private static isAdmin() {
    const token = Cookies.get(authCookieName);
    if (!token) return false;
    const decoded: TokenType = jwtDecode(token);
    return decoded.permissions && decoded.permissions.includes('admin');
  };

  private static requireLogin(to: GuardToRoute, from: GuardFunctionRouteProps | null, next: Next) {
    if (App.isAuthenticated()) {
      next();
    } else {
      next.redirect(ROUTES.LOGIN);
    }
  };

  private DashboardButtons() {
    const logout = () => {
      Cookies.remove(authCookieName);
      AxiosWrapper.getInstance().deleteAuthorization();
    };
    return (
      <div className="buttonsWrapper">
        <RedirectButton label="Users" to={ROUTES.USERS} hidden={!App.isAdmin()}/>
        <RedirectButton label="Logout" to={ROUTES.LOGIN} clickHandler={logout}/>
      </div>
    );
  };

  UsersButtons() {
    return (
      <div className="buttonsWrapper">
        <RedirectButton label="Back" to={ROUTES.DASHBOARD}/>
      </div>
    );
  };

  render() {
    return (
      <BrowserRouter history={history}>
        <div className="App">
          <Switch>
            <GuardProvider guards={[App.requireLogin]}>
              <header>
                <div className="logoContainer">
                  <img className="awesomeLogo" src='weather.png' alt="logo"/>Weather Dashboard
                </div>
                <GuardedRoute path={ROUTES.DASHBOARD} component={this.DashboardButtons}/>
                <GuardedRoute path={ROUTES.USERS} component={this.UsersButtons}/>
              </header>
            </GuardProvider>
          </Switch>
          <Switch>
            <Suspense fallback={<div>Loading...</div>}>
              <GuardProvider guards={[App.requireLogin]}>
                <div className="content">
                  <Route exact path="/">
                    <Redirect to={ROUTES.DASHBOARD}/>
                  </Route>
                  <GuardedRoute exact path={ROUTES.LOGIN} component={Login}/>
                  <GuardedRoute path={ROUTES.DASHBOARD} component={Dashboard}/>
                  <GuardedRoute path={ROUTES.USERS} component={Users}/>
                  <Route path="*">
                    <Redirect to={ROUTES.DASHBOARD}/>
                  </Route>
                </div>
              </GuardProvider>
            </Suspense>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}
