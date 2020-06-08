import React, { Component } from 'react';
import './BasicButton.css';

type ButtonProps = {
  clickHandler: (...p: any) => any;
  label?: string;
  hidden?: boolean
}

export default class BasicButton extends Component<ButtonProps> {
  static defaultProps: ButtonProps = {
    clickHandler: (...p: any) => {
    },
    label: '',
    hidden: false
  };

  constructor(params: any) {
    super(params);
    this.buttonClick = this.buttonClick.bind(this);
  }

  buttonClick(event: React.MouseEvent<HTMLButtonElement>) {
    this.props.clickHandler();
  }

  render() {
    return (
      <button hidden={this.props.hidden} onClick={this.buttonClick}>{this.props.label}</button>
    );
  }
}