import { createBrowserHistory } from 'history';
import React, { lazy, Suspense } from 'react';
import './App.css';
import { Redirect, Route, Router as BrowserRouter, Switch } from 'react-router-dom';
import { GuardedRoute, GuardProvider } from 'react-router-guards';
import { GuardFunctionRouteProps, GuardToRoute, Next } from 'react-router-guards/dist/types';
import Cookies from 'js-cookie';
import { authCookieName, ROUTES } from '../../utils/CommonConstants';

const Login = lazy(() => import(/* webpackChunkName: "pages/Login" */'../../pages/Login/Login'));

const history = createBrowserHistory();

const requireLogin = (to: GuardToRoute, from: GuardFunctionRouteProps | null, next: Next) => {
  if (Cookies.get(authCookieName)) {
    next();
  } else {
    next.redirect(ROUTES.LOGIN);
  }
};

const App = () => {
  return (
    <BrowserRouter history={history}>
      <div className="App">
        <header/>
        <Switch>
          <Suspense fallback={<div>Loading...</div>}>
            <GuardProvider guards={[requireLogin]}>
              <Route exact path="/">
                <Redirect to={ROUTES.DASHBOARD}/>
              </Route>
              <GuardedRoute exact path={ROUTES.LOGIN} component={Login}/>
              <GuardedRoute path={ROUTES.DASHBOARD}>
                Weather and stuff
              </GuardedRoute>
              <GuardedRoute path={ROUTES.USERS}>
                USERSSS
              </GuardedRoute>
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
