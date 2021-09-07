import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseApiPath} from "../../shared/api-mapping/base-api-mapping.model";

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }

  get accountOps$() {
    const path = BaseApiPath.accountOperations.getAll
    return this.http.get(path)
  }
}
