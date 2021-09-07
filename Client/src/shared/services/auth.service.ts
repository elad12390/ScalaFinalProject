import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { BaseApiPath } from '../api-mapping/base-api-mapping.model';
import { IAuthorizedUserData } from '../models/auth.models';
import { ObservableCache } from '../utils/observable-cache';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private observableCache = new ObservableCache();
  private authUserData = new BehaviorSubject<IAuthorizedUserData | null>(null);
  constructor(private localStorageService: LocalStorageService) { }

  public get isLoggedIn() {
    BaseApiPath.auth.login
    return true;
  }

  public get userData$(): Observable<IAuthorizedUserData | null> {
    return this.authUserData.pipe();
  }

  public login$(username: string, password: string) {
    const mock: IAuthorizedUserData = {
      firstName: 'elad',
      lastName: 'ben haim',
      authToken: 'token'
    };
    return this.observableCache.cache(
      BaseApiPath.auth.login,
      of(mock).pipe(
        tap((data) => this.authUserData.next(data)),
        switchMap(data => this.localStorageService.set$(BaseApiPath.auth.login, data))
      ));
  }

  public register$(username: string, password: string) {
    const mock: IAuthorizedUserData = {
      firstName: 'elad',
      lastName: 'ben haim',
      authToken: 'token'
    };
    return this.observableCache.cache(
      BaseApiPath.auth.register,
      of(mock).pipe(
        tap((data) => this.authUserData.next(data)),
        switchMap(data => this.localStorageService.set$(BaseApiPath.auth.register, data))
      ));
  }
}

