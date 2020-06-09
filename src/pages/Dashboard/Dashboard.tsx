import React, { Component } from 'react';
import BasicInput from '../../components/BasicInput';
import BasicButton from '../../components/BasicButton';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import AxiosWrapper from '../../utils/AxiosWrapper';
import { bckEndpoints } from '../../utils/CommonConstants';
import { CurrentWeather, WeatherData } from './WeatherTypes';
import './Dashboard.css';

interface IDashboardState {
  error: string;
  city: string;
  options?: Highcharts.Options;
  currentWeather?: CurrentWeather;
  currentWeatherString?: string;
  timezone_offset?: number;
}

export default class Dashboard extends Component<{}, IDashboardState> {
  private aw: AxiosWrapper;

  constructor(params: any) {
    super(params);
    this.state = {
      error: '',
      city: 'Sofia',
      timezone_offset: 10800,
      options: {
        title: {
          align: 'left',
          text: 'Weather 7 days from now'
        },
        xAxis: {
          title: {
            text: 'Temperature'
          },
          labels: { align: 'left' },
          categories: [
            '1', '2', '3', '4', '5', '6', '7'
          ]
        },
        yAxis: [{
          title: {
            text: ''
          }
        }, {
          linkedTo: 0,
          opposite: true,
          title: {
            text: ''
          }
        }],
        series: [{
          name: 'Day Low',
          type: 'line',
          data: []
        }, {
          name: 'Day High',
          type: 'line',
          data: [],
          visible: true
        }, {
          name: 'Day AVG',
          type: 'line',
          data: [],
          visible: true
        }, {
          name: 'Night',
          type: 'line',
          data: [],
          visible: false
        }, {
          name: 'Morning',
          type: 'line',
          data: [],
          visible: false
        }, {
          name: 'Evening',
          type: 'line',
          data: [],
          visible: false
        }]
      }
    };
    this.aw = AxiosWrapper.getInstance();
    this.fetchWeatherData = this.fetchWeatherData.bind(this);
    this.inputValueChangedHandler = this.inputValueChangedHandler.bind(this);
    this.getHourFromEpoch = this.getHourFromEpoch.bind(this);
  }

  componentDidMount() {
    this.fetchWeatherData();
  }

  private async fetchWeatherData() {
    try {
      this.updateDataFromResponse(await this.aw.request('GET', `${bckEndpoints.WEATHER}/${this.state.city}`));
    } catch (e) {
      this.setState({ error: 'Something went wrong when updating the weather data' });
      setTimeout(() => this.setState({ error: '' }), 3000);
    }
  }

  /**
   * Gets the data from the response in the right places of Highcharts' options.
   * Ugliest function ever, sorry
   * @param weatherData response from the OpenWeatherMaps API
   */
  private updateDataFromResponse(weatherData: WeatherData) {
    this.setState({
      currentWeather: weatherData.current,
      timezone_offset: weatherData.timezone_offset,
      currentWeatherString: `${weatherData.current.weather[0].main}, ${weatherData.current.temp} degrees Celsius`
    });
    const dailyDTs: string[] = [];
    const dailyDayTmp: number[] = [];
    const dailyMinTmp: number[] = [];
    const dailyMaxTmp: number[] = [];
    const dailyNightTmp: number[] = [];
    const dailyEveTmp: number[] = [];
    const dailyMornTmp: number[] = [];
    weatherData.daily.forEach(dayData => {
      const { temp } = dayData;
      dailyDTs.push(Dashboard.generateColumnName((dayData.dt + weatherData.timezone_offset) * 1000));
      dailyDayTmp.push(temp.day);
      dailyMinTmp.push(temp.min);
      dailyMaxTmp.push(temp.max);
      dailyNightTmp.push(temp.night);
      dailyEveTmp.push(temp.eve);
      dailyMornTmp.push(temp.morn);
    });
    const options = {
      xAxis: {
        categories: dailyDTs
      },
      series: [{
        name: 'Day Low',
        type: 'line',
        data: dailyMinTmp
      }, {
        name: 'Day High',
        type: 'line',
        data: dailyMaxTmp
      }, {
        name: 'Day AVG',
        type: 'line',
        data: dailyDayTmp
      }, {
        name: 'Morning',
        type: 'line',
        data: dailyMornTmp
      }, {
        name: 'Evening',
        type: 'line',
        data: dailyEveTmp
      }, {
        name: 'Night',
        type: 'line',
        data: dailyNightTmp
      }]
    };
    // @ts-ignore
    this.setState({ options });
  }

  private static generateColumnName(epoch: number): string {
    return new Date(epoch).toLocaleString('en-GB', { hour12: false, day: 'numeric', month: 'numeric', year: 'numeric' });
  }

  private getHourFromEpoch(epoch: number): string {
    let a = (epoch + this.state.timezone_offset!) * 1000;
    return new Date(a).toLocaleString('en-GB', { hour: 'numeric', minute: 'numeric', second: 'numeric' });
  }

  private inputValueChangedHandler(value: string) {
    this.setState({ city: value });
  }

  render() {
    const tableData = [['Sunrise', this.getHourFromEpoch(this.state.currentWeather?.sunrise || 0)],
      ['Sunset', this.getHourFromEpoch(this.state.currentWeather?.sunset || 0)],
      ['Temp', `${this.state.currentWeather?.temp}°C`],
      ['Feels Like', `${this.state.currentWeather?.feels_like}°C`],
      ['Pressure', `${this.state.currentWeather?.pressure}hPa`],
      ['Humidity', `${this.state.currentWeather?.humidity}%`],
      ['Cloudiness', `${this.state.currentWeather?.clouds}%`],
      ['UV Index', `${this.state.currentWeather?.uvi}`],
      ['Visibility', `${this.state.currentWeather?.visibility}m`],
      ['Wind Speed', `${this.state.currentWeather?.wind_speed}m/s`]];
    const tableDom = tableData.map((row, index) => {
      return (
        <tr key={index}>
          <td>
            {row[0]}
          </td>
          <td>
            {row[1]}
          </td>
        </tr>
      );
    });
    return (
      <div className="chartWrapper">
        <div>{this.state.error}</div>
        <div className="inputsWrapper">
          <BasicInput placeholder={'City'} value={this.state.city} valueChangeHandler={this.inputValueChangedHandler}/>
          <BasicButton label="Get weather" clickHandler={this.fetchWeatherData}/>
        </div>
        <br/>
        <span>{this.state.currentWeatherString}</span>
        <div className="weatherInfo">
          {this.state.currentWeather ?
            <table className="propsTable">
              <thead>
                <tr>
                  <th colSpan={2}>Current weather</th>
                </tr>
              </thead>
              <tbody>
                {tableDom}
              </tbody>
            </table>
            : null}
          <div className="chart">
            <HighchartsReact
              highcharts={Highcharts}
              options={this.state.options}
            />
          </div>
        </div>
      </div>
    );
  }
}

