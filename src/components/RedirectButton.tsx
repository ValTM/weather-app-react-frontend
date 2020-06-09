import React, { Component } from 'react';
import BasicButton from './BasicButton';
import H from 'history';
import { match, withRouter } from 'react-router-dom';
import { ROUTES } from '../utils/CommonConstants';

type RedirectButtonProps = {
  label: string;
  to: ROUTES | null;
  history: H.History;
  location: H.Location;
  match: match;
  clickHandler?: (...p: any) => any;
  hidden?: boolean;
}

/**
 * A button used to trigger a redirect through the react router
 */
class RedirectButton extends Component<RedirectButtonProps> {
  constructor(params: any) {
    super(params);
    this.redirectHandler = this.redirectHandler.bind(this);
  }

  redirectHandler(event: React.MouseEvent<HTMLButtonElement>) {
    if (this.props.to) {
      this.props.history!.push(this.props.to);
    }
    if (this.props.clickHandler) {
      this.props.clickHandler();
    }
  }

  render() {
    return (
      <BasicButton hidden={this.props.hidden} clickHandler={this.redirectHandler} label={this.props.label}/>
    );
  }
}

export default withRouter(RedirectButton);
