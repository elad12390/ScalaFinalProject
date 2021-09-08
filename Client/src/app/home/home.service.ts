import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseApiPath} from "../../shared/api-mapping/base-api-mapping.model";
import {IApiResponseModel} from "../../shared/models/api.models";
import {Observable} from "rxjs";
import { AccountOps } from './account-ops';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }

  get accountOps$(): Observable<IApiResponseModel<AccountOps>> {
    const path = BaseApiPath.accountOperations.getAll
    return this.http.get(path)
  }
   account$(id:string): Observable<IApiResponseModel<AccountOps>> {
    const path = BaseApiPath.accountOperations.getById(id)
    return this.http.get(path)
  }
  get newAccount$(): Observable<IApiResponseModel<AccountOps>> {
    const path = BaseApiPath.accountOperations.create
    return this.http.get(path)
  }






}
