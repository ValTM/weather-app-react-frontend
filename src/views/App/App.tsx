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

/**
 * Lazy loading of the components only when they are needed
 */
const Dashboard = lazy(() => import(/* webpackChunkName: "pages/Dashboard" */'../../pages/Dashboard/Dashboard'));
const Login = lazy(() => import(/* webpackChunkName: "pages/Login" */'../../pages/Login/Login'));
const Users = lazy(() => import(/* webpackChunkName: "pages/Users" */'../../pages/Users/Users'));

const history = createBrowserHistory();

/**
 * Main class of the application
 */
export default class App extends Component {
  constructor(params: any) {
    super(params);
    if (App.isAuthenticated()) {
      AxiosWrapper.getInstance().setAuthorization(Cookies.get(authCookieName)!);
    }
  }

  /**
   * A check to see if the current user is authenticated
   */
  private static isAuthenticated() {
    const token = Cookies.get(authCookieName);
    if (!token) return false;
    return (jwtDecode(token) as TokenType).exp >= Date.now().valueOf() / 1000;
  };

  /**
   * A check to see if the current authenticated user is an admin
   */
  private static isAdmin() {
    const token = Cookies.get(authCookieName);
    if (!token) return false;
    const decoded: TokenType = jwtDecode(token);
    return decoded.permissions && decoded.permissions.includes('admin');
  };

  /**
   * A small router guard to redirect the user to the login page if they are unauthenticated
   * @param to
   * @param from
   * @param next
   */
  private static requireLogin(to: GuardToRoute, from: GuardFunctionRouteProps | null, next: Next) {
    if (App.isAuthenticated()) {
      next();
    } else {
      next.redirect(ROUTES.LOGIN);
    }
  };

  /**
   * Buttons to render when the dashboard page is shown
   * @constructor
   */
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

  /**
   * Buttons to show when the user page is shown
   * @constructor
   */
  UsersButtons() {
    return (
      <div className="buttonsWrapper">
        <RedirectButton label="Back" to={ROUTES.DASHBOARD}/>
      </div>
    );
  };

  /**
   * Main DOM structure. It features two switch elements - for the header buttons and for the content
   */
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
