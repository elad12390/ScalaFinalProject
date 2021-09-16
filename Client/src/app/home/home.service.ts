import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseApiPath} from "../../shared/api-mapping/base-api-mapping.model";
import {IApiResponseModel} from "../../shared/models/api.models";
import {Observable} from "rxjs";
import {AccountOp, AccountOpRequest} from './account-op';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }

  get accountOps$(): Observable<IApiResponseModel<AccountOp>> {
    const path = BaseApiPath.accountOperations.getAll
    return this.http.get(path)
  }

  delete(id: string) {
    const path = BaseApiPath.accountOperations.delete(id);
    return this.http.delete(path);
  }

  updateAccountOp(id: string, newData: AccountOp) {
    const path = BaseApiPath.accountOperations.update(id);
    console.log(path);
    return this.http.put(path, new AccountOpRequest(newData));
  }

  account$(id:string): Observable<IApiResponseModel<AccountOp>> {
    const path = BaseApiPath.accountOperations.getById(id)
    return this.http.get(path)
  }

  get newAccountOperation$(): Observable<IApiResponseModel<AccountOp>> {
    const path = BaseApiPath.accountOperations.create
    return this.http.post(path, {
      accountNumber: 3,
      actionType: 3,
      amount: 500
    })
  }


  createAccountOp(op: AccountOp) {
    const path = BaseApiPath.accountOperations.create
    return this.http.post(path, new AccountOpRequest(op));
  }
}
