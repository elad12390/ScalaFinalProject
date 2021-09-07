import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, pairwise } from 'rxjs/operators';
import { clone, cloneDeep } from 'lodash';
import { changedKeys } from '../utils/changed-keys';
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private _data$ = new BehaviorSubject<any>({});
  private _localStorage: Storage = localStorage;
  constructor() {
    this._data$.next(
      Object.keys(this._localStorage)
        .reduce((accumulator, key) => {
          accumulator[key] = JSON.parse(this._localStorage.getItem(key) ?? '');
          return accumulator;
        }, {} as any)
    );

    console.log(this._data$.value)
  }

  get changes$() {
    return this._data$.pipe(
      pairwise(),
      map(([prev, curr]) => changedKeys(prev, curr))
    );
  }

  get(key: string): any {
    if (!this._data$.value || !this._data$.value[key]) {
      this.set(key, JSON.parse(this._localStorage.getItem(key) as string));
    }
    console.log(this._data$.value)
    return clone(this._data$.value[key]);
  }

  get$(key: string): Observable<any> {
    return this._data$.pipe(map(data => clone(data[key])))
  }

  set(key: string, data: any): void {
    const jsonData = JSON.stringify(data);
    localStorage.setItem(key, jsonData);
    this._data$.next({
      ...this._data$.value,
      [key]: data
    })
  }

  set$(key: string, data: any): Observable<boolean> {
    return new Observable(subscriber => {
      const jsonData = JSON.stringify(data);
      localStorage.setItem(key, jsonData);
      subscriber.next(true);
      subscriber.complete();
    })
  }

  remove(key: string) {
    localStorage.removeItem(key);
  }

}
