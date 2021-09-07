import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "@env";
import {tap} from "rxjs/operators";
import {IApiResponseModel} from "../models/api.models";
import {InnerErrorCodes} from "../enums";
import {Router} from "@angular/router";

@Injectable()
export class APIInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
        tap((res) => {
          const apiResponse = res as IApiResponseModel<any>;
          if (!!apiResponse.errorCode && apiResponse.errorCode == InnerErrorCodes.NotLoggedIn) {
            this.router.navigate(['login']).then()
          }
        })
      );
  }
}
