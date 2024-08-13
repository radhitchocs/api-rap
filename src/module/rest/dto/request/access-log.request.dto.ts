export enum AccessLogModule {
  AUTH = 'AUTH',
  INTEGRATION = 'INTEGRATION',
  RESOURCE = 'RESOURCE',
  ROLE_PERMISSION = 'ROLE_PERMISSION',
  APPLICATION = 'APPLICATION',
}

export enum AccessLogActivity {
  LOGIN = 'LOGIN',
  REFRESH = 'REFRESH',
  LOGOUT = 'LOGOUT',
  GET_INTERNAL_SYSTEM_TOKEN = 'GET_INTERNAL_SYSTEM_TOKEN',
  LOGIN_INTERNAL_SYSTEM = 'LOGIN_INTERNAL_SYSTEM',
  CREATE_RESOURCE = 'CREATE_RESOURCE',
  GET_RESOURCE = 'GET_RESOURCE',
  UPDATE_RESOURCE = 'UPDATE_RESOURCE',
  GET_PERMISSION = 'GET_PERMISSION',
  UPDATE_PERMISSION = 'UPDATE_PERMISSION',
  GET_PUBLIC_PLIST = 'GET_PUBLIC_PLIST',
  GET_OWN_PLIST = 'GET_OWN_PLIST',
  GET_PUBLIC_APPLICATION_LIST = 'GET_PUBLIC_APPLICATION_LIST',
  GET_OWN_APPLICATION_LIST = 'GET_OWN_APPLICATION_LIST',
  GET_APPLICATION_STATUS = 'GET_APPLICATION_STATUS',
}

export interface ApiLog {
  sub: string;
  accessToken?: string;
  service: string;
  activity: AccessLogActivity;
  module: AccessLogModule;
  description?: string;
}

export interface AccessLog extends ApiLog {
  accessToken?: string;
  ip?: string;
  hostName?: string;
  userAgent?: string;
}
