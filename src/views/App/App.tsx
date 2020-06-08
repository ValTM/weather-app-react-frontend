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
  return (jwtDecode(token) as TokenType).permissions.includes('admin');
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
    <div className="buttons">
      <RedirectButton label="Users" to={ROUTES.USERS} hidden={!isAdmin()}/>
      <RedirectButton label="Logout" to={ROUTES.LOGIN} clickHandler={logout}/>
    </div>
  );
};
const UsersButtons = () => {
  return (
    <div className="buttons">
      <RedirectButton label="Back" to={ROUTES.DASHBOARD}/>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter history={history}>
      <div className="App">
        <header/>
        <Switch>
          <GuardProvider guards={[requireLogin]}>
            <div className="tooblar">
              <GuardedRoute path={ROUTES.DASHBOARD} component={DashboardButtons}/>
              <GuardedRoute path={ROUTES.USERS} component={UsersButtons}/>
            </div>
          </GuardProvider>
        </Switch>
        <Switch>
          <Suspense fallback={<div>Loading...</div>}>
            <GuardProvider guards={[requireLogin]}>
              <Route exact path="/">
                <Redirect to={ROUTES.DASHBOARD}/>
              </Route>
              <GuardedRoute exact path={ROUTES.LOGIN} component={Login}/>
              <GuardedRoute path={ROUTES.DASHBOARD} component={Dashboard}/>
              <GuardedRoute path={ROUTES.USERS} component={Users}/>
              <Route path="*">
                <Redirect to={ROUTES.DASHBOARD}/>
              </Route>
            </GuardProvider>
          </Suspense>
        </Switch>
      </div>
    </BrowserRouter>
  );
};
export default App;
