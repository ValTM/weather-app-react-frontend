import React, { Component } from 'react';
import BasicInput from '../../components/BasicInput';
import AxiosWrapper from '../../utils/AxiosWrapper';
import { authCookieName, bckEndpoints, ROUTES } from '../../utils/CommonConstants';
import cryptojs from 'crypto-js';
import { AxiosError } from 'axios';
import { match, withRouter } from 'react-router-dom';
import H from 'history';
import Cookies from 'js-cookie';
import './Login.css'

enum Function {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER'
}

interface ILoginProps {
  history: H.History;
  location: H.Location;
  match: match;
}

interface ILoginComponentState {
  function: Function;
  error: string;
  username: string;
  password: string;
}

function ErrorTextDom(props: { errorText: string }) {
  return props.errorText === '' ? null : (
    <div className="error">
      {props.errorText}
    </div>
  );
}

class Login extends Component<ILoginProps, ILoginComponentState> {
  constructor(params: any) {
    super(params);
    this.state = {
      function: Function.LOGIN,
      error: '',
      username: '',
      password: ''
    };
    this.toggleRegister = this.toggleRegister.bind(this);
    this.loginOrRegister = this.loginOrRegister.bind(this);
    this.updateUserInfoState = this.updateUserInfoState.bind(this);
    this.inputValueChangeHandler = this.inputValueChangeHandler.bind(this);
  }

  private toggleRegister() {
    if (this.state.function === Function.LOGIN) {
      this.setState({ function: Function.REGISTER });
    } else {
      this.setState({ function: Function.LOGIN });
    }
  }

  private static hashPassword(username: string, password: string) {
    return cryptojs.SHA256(username + password);
  }

  private async loginOrRegister() {
    const aw = AxiosWrapper.getInstance();
    const destination = this.state.function === Function.LOGIN ? bckEndpoints.LOGIN : bckEndpoints.REGISTER;
    const { username, password } = this.state;
    if (username === '' || password === '') {
      this.setError('Both fields are required!');
      return;
    }
    try {
      const result = await aw.request('POST', destination, { username, passwordhash: Login.hashPassword(username, password) });
      aw.setAuthorization(result.token)
      Cookies.set(authCookieName, result.token);
      this.props.history.push(ROUTES.DASHBOARD);
    } catch (e) {
      const err: AxiosError = e;
      this.setError(`Error when requesting login info: ${err.response?.data.error}`);
    }
  }

  private setError(error: string) {
    this.setState({ error });
  }

  private updateUserInfoState(field: string, value: string) {
    if (field === 'username') {
      this.setState({ username: value });
    } else {
      this.setState({ password: value });
    }
  }

  inputValueChangeHandler(inputValue: string) {
    this.updateUserInfoState('username', inputValue);
  }

  render() {
    const currentFunction = this.state.function;
    const login = currentFunction === Function.LOGIN;
    return (
      <div className="loginform">
        <div className="form">
          <p>{login ? 'Login' : 'Register'}</p>
          <BasicInput placeholder="Username" value={this.state.username}
                      valueChangeHandler={(inputValue: any) => this.updateUserInfoState('username', inputValue)}/>
          <BasicInput type="password" placeholder="Password" value={this.state.password}
                      valueChangeHandler={(inputValue: any) => this.updateUserInfoState('password', inputValue)}/>
          <button onClick={this.loginOrRegister}>{login ? 'Sign in' : 'Sign up'}</button>
        </div>
        <ErrorTextDom errorText={this.state.error}/>
        <div className="register">
          <span>
          {login ?
            'Need an account?'
            :
            'Already have an account?'
          }
          </span>
          <div className="link" role="link" onClick={this.toggleRegister}>{login ? 'Sign up' : 'Sign in'}</div>
        </div>
      </div>
    );
  }
}

export default withRouter(Login);
