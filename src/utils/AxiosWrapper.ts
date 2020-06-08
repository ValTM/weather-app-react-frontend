import axios, { AxiosError, AxiosResponse, Method } from 'axios';

export default class AxiosWrapper {

  public static getInstance(): AxiosWrapper {
    if (!AxiosWrapper.instance) {
      AxiosWrapper.instance = new AxiosWrapper();
    }

    return AxiosWrapper.instance;
  }

  private static instance: AxiosWrapper;
  private headers: any = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  public setAuthorization(authorizationCreds: string): void {
    Object.assign(this.headers, { Authorization: `Bearer ${authorizationCreds}` });
  }

  public deleteAuthorization(): void {
    delete this.headers.Authorization;
  }

  public request(method: Method = 'GET', url: string, data?: any): Promise<any> {
    const request = axios.request({
      method,
      url,
      headers: this.headers,
      timeout: 10000,
      data
    });
    return request
      .then((response: AxiosResponse) => response.data)
      .catch((e: AxiosError) => {
        throw e;
      });
  }
}
