/** *****************User***************** */
export enum UserError {
  USER_NOT_FOUND = 100,
  USER_REACHES_CREATE_TEAM_LIMIT = 101,
  USER_CANNOT_CREATE = 102,
  USER_REACHES_JOIN_TEAM_LIMIT = 103,
  USER_CANNOT_JOIN_TEAM = 104,
  USER_CANNOT_LEAVE_TEAM = 105,
  CREATE_USER_FAILED = 106,
  USER_ALREADY_EXISTS = 107,
}

/** *****************End***************** */

/** *****************Team***************** */

export enum TeamError {
  TEAM_NOT_FOUND = 200,
}

/** *****************End***************** */

/** *****************Resource***************** */

/** *****************End***************** */

/** *****************Blog***************** */

/** *****************End***************** */

/** *****************Auth***************** */
export enum AuthError {
  AUTH_INVALID_CREDENTIALS = 300,
  AUTH_INVALID_SESSION = 301,
  NOT_AUTHORIZED = 302,
}
/** *****************End***************** */

/** *****************System Error***************** */
export enum SystemError {
  INTERNAL_SERVER_ERROR = 500,
  REQUIRED_TEAM_ALIAS = 501,
}
/** *****************End***************** */
