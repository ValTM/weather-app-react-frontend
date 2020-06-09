import React, { Component } from 'react';
import './BasicInput.css'

type InputProps = {
  placeholder: string;
  valueChangeHandler: (...p: any) => any;
  type: string;
  value?: string;
}

/**
 * A simple stylized input
 */
export default class BasicInput extends Component<InputProps> {
  static defaultProps: InputProps = {
    placeholder: '',
    valueChangeHandler: (...p: any) => {
    },
    type: "text"
  };

  constructor(params: any) {
    super(params);
    this.inputBlur = this.inputBlur.bind(this);
  }

  inputBlur(event: React.FocusEvent<HTMLInputElement>) {
    this.props.valueChangeHandler(event.target.value);
  }

  render() {
    return (
      <input type={this.props.type} aria-label={this.props.placeholder} placeholder={this.props.placeholder} value={this.props.value} onChange={this.inputBlur}/>
    );
  }
}
