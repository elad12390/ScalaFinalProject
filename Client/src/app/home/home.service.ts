import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseApiPath} from "../../shared/api-mapping/base-api-mapping.model";
import {IApiResponseModel} from "../../shared/models/api.models";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }

  get accountOps$(): Observable<IApiResponseModel<any>> {
    const path = BaseApiPath.accountOperations.getAll
    return this.http.get(path)
  }
}
