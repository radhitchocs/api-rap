import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import Request from 'express';
import { Observable } from 'rxjs';

import { AccessLog, ApiLog } from '../dto/request/access-log.request.dto';

/**
 * A custom http service responsible for adding authorization header coming from express to microservice
 */
@Injectable({ scope: Scope.REQUEST })
export class RestService {
  private readonly logger = new Logger(RestService.name);

  constructor(
    @Inject(REQUEST) private readonly expressRequest: Request,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  get axiosRef(): AxiosInstance {
    return this.httpService.axiosRef;
  }

  request<T = any>(config: AxiosRequestConfig): Observable<AxiosResponse<T>> {
    return this.httpService.request(this.addAuthorizationHeader(config));
  }

  delete<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Observable<AxiosResponse<T>> {
    return this.httpService.delete(url, this.addAuthorizationHeader(config));
  }

  get<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Observable<AxiosResponse<T>> {
    return this.httpService.get(url, this.addAuthorizationHeader(config));
  }

  head<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Observable<AxiosResponse<T>> {
    return this.httpService.head(url, this.addAuthorizationHeader(config));
  }

  patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Observable<AxiosResponse<T>> {
    return this.httpService.patch(
      url,
      data,
      this.addAuthorizationHeader(config),
    );
  }

  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Observable<AxiosResponse<T>> {
    return this.httpService.post(
      url,
      data,
      this.addAuthorizationHeader(config),
    );
  }

  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Observable<AxiosResponse<T>> {
    return this.httpService.put(url, data, this.addAuthorizationHeader(config));
  }

  private addAuthorizationHeader(config?: AxiosRequestConfig) {
    if (
      typeof config === 'undefined' ||
      config == null ||
      typeof config !== 'object'
    ) {
      config = {};
    }
    if (!config.headers) {
      config.headers = {};
    }
    config.headers.authorization =
      this.expressRequest.headers['authorization'] || '';
    return config;
  }

  log(apiLog: ApiLog) {
    const accessLog = <AccessLog>apiLog;
    const realExpressAccessToken = this.expressRequest.headers['authorization']
      ? this.expressRequest.headers['authorization'].replace('Bearer ', '')
      : null;
    if (realExpressAccessToken) {
      accessLog.accessToken = realExpressAccessToken;
    }
    accessLog.ip = this.expressRequest.headers['x-forwarded-for'];
    accessLog.hostName = this.expressRequest.headers['host'];
    accessLog.userAgent = this.expressRequest.headers['user-agent'];
    const host = this.configService.get<string>('AGENT_PROCESS_API_HOST');
    const endpoint = `http://${host}/log`;
    try {
      this.post(endpoint, accessLog).toPromise();
    } catch (e) {
      this.logger.error(
        `Failed to save access log into database: ${accessLog}`,
      );
    }
  }
}
