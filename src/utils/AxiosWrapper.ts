import axios, { AxiosError, AxiosResponse, Method } from 'axios';

/**
 * A helper utility to make your life requesting with axios even easier.
 * It follows a singleton pattern, since you don't need more than one.
 */
export default class AxiosWrapper {

  /**
   * Instance management for the singleton
   */
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

  /**
   * Sets the authorization header for all future requests
   * @param authorizationCreds what token to set the header to
   */
  public setAuthorization(authorizationCreds: string): void {
    Object.assign(this.headers, { Authorization: `Bearer ${authorizationCreds}` });
  }

  /**
   * Removes the authorization header
   */
  public deleteAuthorization(): void {
    delete this.headers.Authorization;
  }

  /**
   * A wrapper around the generic axios request() function, that also provides some error handling
   * @param method
   * @param url
   * @param data
   */
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
