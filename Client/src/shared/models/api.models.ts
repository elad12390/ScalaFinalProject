
export interface IApiResponseModel<T> {
  data?: T;
  httpCode?: number;
  errorCode?: number;
  errorMessage?: string;
  displayMessage?: string;
  errorDescription?: string;
  exception?: string;
}
