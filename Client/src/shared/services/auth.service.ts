import { Injectable } from '@angular/core';
import {BehaviorSubject, EMPTY, Observable, of} from 'rxjs';
import {catchError, switchMap, tap} from 'rxjs/operators';
import { BaseApiPath } from '../api-mapping/base-api-mapping.model';
import { IAuthorizedUserData } from '../models/auth.models';
import { ObservableCache } from '../utils/observable-cache';
import { LocalStorageService } from './local-storage.service';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {IApiResponseModel} from "../models/api.models";

export const USER_LOCALSTORAGE_PATH = 'user';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private observableCache = new ObservableCache();
  private authUserData$ = new BehaviorSubject<IAuthorizedUserData | null>(null);
  constructor(private localStorageService: LocalStorageService, private httpClient: HttpClient) { }
  public get isLoggedIn() {
    return !!this.localStorageService.get(USER_LOCALSTORAGE_PATH) || !!this.authUserData$.value;
  }

  public get userData$(): Observable<IAuthorizedUserData | null> {
    return this.authUserData$.pipe();
  }

  public login$(userName: string, password: string): Observable<IApiResponseModel<IAuthorizedUserData>> {
    const path = BaseApiPath.auth.login;
    return this.observableCache.cache(
      path,
      this.httpClient.post<IApiResponseModel<IAuthorizedUserData>>(path, {userName, password})
        .pipe(
          switchMap((res) => {
            if (!!res.errorCode) {
              return of(res);
            }
            return of(res).pipe(
              tap((res) => {this.authUserData$.next(res.data!)}),
              switchMap(data => this.localStorageService.set$(USER_LOCALSTORAGE_PATH, data).pipe(switchMap(() => of(data))))
            );
          })
      ));
  }

  public register$(userName: string, password: string) {
    const path = BaseApiPath.auth.register;
    return this.observableCache.cache(
      path,
      this.httpClient.post<IApiResponseModel<IAuthorizedUserData>>(path, {userName, password})
        .pipe(
          switchMap((res) => {
            if (!!res.errorCode) {
              return of(res);
            }
            return of(res).pipe(
              tap((res) => {this.authUserData$.next(res.data!)}),
              switchMap(data => this.localStorageService.set$(USER_LOCALSTORAGE_PATH, data).pipe(switchMap(() => of(data))))
            );
          })
        ));
  }
}

