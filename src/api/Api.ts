/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Report {
  /** ID */
  id?: number;
  /** Owner */
  owner?: string;
  /** Moderator */
  moderator?: string;
  /** Resources */
  resources?: string;
  /** Статус */
  status?: 1 | 2 | 3 | 4 | 5;
  /**
   * Дата создания
   * @format date-time
   */
  date_created?: string | null;
  /**
   * Дата формирования
   * @format date-time
   */
  date_formation?: string | null;
  /**
   * Дата завершения
   * @format date-time
   */
  date_complete?: string | null;
  /** Company */
  company?: string | null;
  /** Month */
  month?: string | null;
}

export interface ResourceReport {
  /** ID */
  id?: number;
  /**
   * Плановый обьем
   * @min -2147483648
   * @max 2147483647
   */
  plan_volume?: number | null;
  /**
   * Реальный обьем
   * @min -2147483648
   * @max 2147483647
   */
  volume?: number | null;
  /** Resource */
  resource?: number | null;
  /** Report */
  report?: number | null;
}

export interface UserLogin {
  /**
   * Username
   * @minLength 1
   */
  username: string;
  /**
   * Password
   * @minLength 1
   */
  password: string;
}

export interface UserRegister {
  /** ID */
  id?: number;
  /**
   * Адрес электронной почты
   * @format email
   * @maxLength 254
   */
  email?: string;
  /**
   * Пароль
   * @minLength 1
   * @maxLength 128
   */
  password: string;
  /**
   * Имя пользователя
   * Обязательное поле. Не более 150 символов. Только буквы, цифры и символы @/./+/-/_.
   * @minLength 1
   * @maxLength 150
   * @pattern ^[\w.@+-]+$
   */
  username: string;
}

export interface UserProfile {
  /**
   * Username
   * @minLength 1
   */
  username?: string;
  /**
   * Email
   * @minLength 1
   */
  email?: string;
  /**
   * Password
   * @minLength 1
   */
  password?: string;
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "http://localhost:8000/api" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Snippets API
 * @version v1
 * @license BSD License
 * @termsOfService https://www.google.com/policies/terms/
 * @baseUrl http://localhost:8000/api
 * @contact <contact@snippets.local>
 *
 * Test description
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  reports = {
    /**
     * No description
     *
     * @tags reports
     * @name ReportsList
     * @request GET:/reports/
     * @secure
     */
    reportsList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/reports/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags reports
     * @name ReportsRead
     * @request GET:/reports/{report_id}/
     * @secure
     */
    reportsRead: (reportId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/reports/${reportId}/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags reports
     * @name ReportsDeleteDelete
     * @request DELETE:/reports/{report_id}/delete/
     * @secure
     */
    reportsDeleteDelete: (reportId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/reports/${reportId}/delete/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags reports
     * @name ReportsDeleteResourceDelete
     * @request DELETE:/reports/{report_id}/delete_resource/{resource_id}/
     * @secure
     */
    reportsDeleteResourceDelete: (reportId: string, resourceId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/reports/${reportId}/delete_resource/${resourceId}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags reports
     * @name ReportsUpdateUpdate
     * @request PUT:/reports/{report_id}/update/
     * @secure
     */
    reportsUpdateUpdate: (reportId: string, data: Report, params: RequestParams = {}) =>
      this.request<Report, any>({
        path: `/reports/${reportId}/update/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags reports
     * @name ReportsUpdateResourceUpdate
     * @request PUT:/reports/{report_id}/update_resource/{resource_id}/
     * @secure
     */
    reportsUpdateResourceUpdate: (
      reportId: string,
      resourceId: string,
      data: ResourceReport,
      params: RequestParams = {},
    ) =>
      this.request<ResourceReport, any>({
        path: `/reports/${reportId}/update_resource/${resourceId}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags reports
     * @name ReportsUpdateStatusAdminUpdate
     * @request PUT:/reports/{report_id}/update_status_admin/
     * @secure
     */
    reportsUpdateStatusAdminUpdate: (reportId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/reports/${reportId}/update_status_admin/`,
        method: "PUT",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags reports
     * @name ReportsUpdateStatusUserUpdate
     * @request PUT:/reports/{report_id}/update_status_user/
     * @secure
     */
    reportsUpdateStatusUserUpdate: (reportId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/reports/${reportId}/update_status_user/`,
        method: "PUT",
        secure: true,
        ...params,
      }),
  };
  resources = {
    /**
     * No description
     *
     * @tags resources
     * @name ResourcesList
     * @request GET:/resources/
     * @secure
     */
    resourcesList: (
      query?: {
        query?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/resources/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags resources
     * @name ResourcesCreateCreate
     * @request POST:/resources/create/
     * @secure
     */
    resourcesCreateCreate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/resources/create/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags resources
     * @name ResourcesRead
     * @request GET:/resources/{resource_id}/
     * @secure
     */
    resourcesRead: (resourceId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/resources/${resourceId}/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags resources
     * @name ResourcesAddToReportCreate
     * @request POST:/resources/{resource_id}/add_to_report/
     * @secure
     */
    resourcesAddToReportCreate: (resourceId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/resources/${resourceId}/add_to_report/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags resources
     * @name ResourcesDeleteDelete
     * @request DELETE:/resources/{resource_id}/delete/
     * @secure
     */
    resourcesDeleteDelete: (resourceId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/resources/${resourceId}/delete/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags resources
     * @name ResourcesUpdateUpdate
     * @request PUT:/resources/{resource_id}/update/
     * @secure
     */
    resourcesUpdateUpdate: (resourceId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/resources/${resourceId}/update/`,
        method: "PUT",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags resources
     * @name ResourcesUpdateImageCreate
     * @request POST:/resources/{resource_id}/update_image/
     * @secure
     */
    resourcesUpdateImageCreate: (resourceId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/resources/${resourceId}/update_image/`,
        method: "POST",
        secure: true,
        ...params,
      }),
  };
  users = {
    /**
     * No description
     *
     * @tags users
     * @name UsersLoginCreate
     * @request POST:/users/login/
     * @secure
     */
    usersLoginCreate: (data: UserLogin, params: RequestParams = {}) =>
      this.request<UserLogin, any>({
        path: `/users/login/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersLogoutCreate
     * @request POST:/users/logout/
     * @secure
     */
    usersLogoutCreate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/users/logout/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersRegisterCreate
     * @request POST:/users/register/
     * @secure
     */
    usersRegisterCreate: (data: UserRegister, params: RequestParams = {}) =>
      this.request<UserRegister, any>({
        path: `/users/register/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersUpdateUpdate
     * @request PUT:/users/{user_id}/update/
     * @secure
     */
    usersUpdateUpdate: (userId: string, data: UserProfile, params: RequestParams = {}) =>
      this.request<UserProfile, any>({
        path: `/users/${userId}/update/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
