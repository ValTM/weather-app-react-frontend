// usually this would be retrieved from configuration and go in a store or something, but today we hardcode!
export const backendUrl = 'http://localhost:4000/';

// well if it were a HATEOAS API it would let you know, but it isn't
export enum bckEndpoints {
  LOGIN = 'login',
  REGISTER = 'register',
  WEATHER = 'weather',
  USERS = 'users'
}

export enum ROUTES {
  DASHBOARD = '/dashboard',
  LOGIN = '/login',
  REGISTER = '/register',
  USERS = '/users'
}

// for this one I don't have a funny joke
export const authCookieName = 'AUTH';

export type TokenType = { exp: number, sub: string, permissions?: string[], iat: number }
