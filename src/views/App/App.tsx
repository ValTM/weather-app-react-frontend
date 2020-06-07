import { createBrowserHistory } from 'history';
import React from 'react';
import './App.css';
import { Redirect, Route, Router as BrowserRouter, Switch } from 'react-router-dom';
import { GuardedRoute, GuardProvider } from 'react-router-guards';
import { GuardFunctionRouteProps, GuardToRoute, Next } from 'react-router-guards/dist/types';
import cookies from 'js-cookie';

enum ROUTES {
  DASHBOARD = '/dashboard',
  LOGIN = '/login',
  REGISTER = '/register',
  USERS = '/users'
}

const history = createBrowserHistory();

const requireLogin = (to: GuardToRoute, from: GuardFunctionRouteProps | null, next: Next) => {
  if (cookies.get('login')) {
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
          <GuardProvider guards={[requireLogin]}>
            <Route exact path="/">
              <Redirect to={ROUTES.DASHBOARD}/>
            </Route>
            <GuardedRoute exact path={ROUTES.LOGIN}>
              Two input boxes here
            </GuardedRoute>
            <GuardedRoute path={ROUTES.DASHBOARD}>
              Weather and stuff
            </GuardedRoute>
            <GuardedRoute path={ROUTES.REGISTER}>
              Register != login
            </GuardedRoute>
            <GuardedRoute path={ROUTES.USERS}>
              USERSSS
            </GuardedRoute>
          </GuardProvider>
        </Switch>
      </div>
    </BrowserRouter>
  );
};
export default App;
