import { createBrowserHistory } from 'history';
import React, { lazy, Suspense } from 'react';
import './App.css';
import { Redirect, Route, Router as BrowserRouter, Switch } from 'react-router-dom';
import { GuardedRoute, GuardProvider } from 'react-router-guards';
import { GuardFunctionRouteProps, GuardToRoute, Next } from 'react-router-guards/dist/types';
import Cookies from 'js-cookie';
import { authCookieName, ROUTES, TokenType } from '../../utils/CommonConstants';
import jwtDecode from 'jwt-decode';
import RedirectButton from '../../components/RedirectButton';

const Dashboard = lazy(() => import(/* webpackChunkName: "pages/Dashboard" */'../../pages/Dashboard/Dashboard'));
const Login = lazy(() => import(/* webpackChunkName: "pages/Login" */'../../pages/Login/Login'));
const Users = lazy(() => import(/* webpackChunkName: "pages/Users" */'../../pages/Users/Users'));

const history = createBrowserHistory();

const isAuthenticated = () => {
  const token = Cookies.get(authCookieName);
  if (!token) return false;
  return (jwtDecode(token) as TokenType).exp >= Date.now().valueOf() / 1000;
};

const isAdmin = () => {
  const token = Cookies.get(authCookieName);
  if (!token) return false;
  const decoded: TokenType = jwtDecode(token);
  return decoded.permissions && decoded.permissions.includes('admin');
};

const requireLogin = (to: GuardToRoute, from: GuardFunctionRouteProps | null, next: Next) => {
  if (isAuthenticated()) {
    next();
  } else {
    next.redirect(ROUTES.LOGIN);
  }
};

const DashboardButtons = () => {
  const logout = () => {
    Cookies.remove(authCookieName);
  };
  return (
    <div className="buttonsWrapper">
      <RedirectButton label="Users" to={ROUTES.USERS} hidden={!isAdmin()}/>
      <RedirectButton label="Logout" to={ROUTES.LOGIN} clickHandler={logout}/>
    </div>
  );
};
const UsersButtons = () => {
  return (
    <div className="buttonsWrapper">
      <RedirectButton label="Back" to={ROUTES.DASHBOARD}/>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter history={history}>
      <div className="App">
        <Switch>
          <GuardProvider guards={[requireLogin]}>
            <header>
              <div className="logoContainer">
                <img className="awesomeLogo" src='weather.png' alt="logo"/>Weather Dashboard
              </div>
              <GuardedRoute path={ROUTES.DASHBOARD} component={DashboardButtons}/>
              <GuardedRoute path={ROUTES.USERS} component={UsersButtons}/>
            </header>
          </GuardProvider>
        </Switch>
        <Switch>
          <Suspense fallback={<div>Loading...</div>}>
            <GuardProvider guards={[requireLogin]}>
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
};
export default App;
