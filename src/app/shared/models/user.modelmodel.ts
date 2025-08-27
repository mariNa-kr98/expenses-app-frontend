export interface User {

    id?: number;
    username: string;
    password: string;
  }
  
export interface LoggedInUser {

  sub: string,
  roles: string[];
  exp?: number;
  iat?: number;
  }

export interface DecodedTokenRaw {
  sub: string;
  role: string | string[];
  iat?: number;
  exp?: number;
  } 