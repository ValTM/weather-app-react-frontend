import React, { Component } from 'react';

interface IDashboardState {
  error: string;
  city: string;
}

export default class Dashboard extends Component<{}, IDashboardState> {
  constructor(params: any) {
    super(params);
    this.state = {
      error: '',
      city: 'Sofia'
    };
  }

  render() {
    return (
      <div className="chart">
        Charty chart here
      </div>
    );
  }
}

