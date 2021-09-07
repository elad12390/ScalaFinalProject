import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "@env";
import {tap} from "rxjs/operators";
import {IApiResponseModel} from "../models/api.models";
import {InnerErrorCodes} from "../enums";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
        tap((res) => {
          if (res instanceof HttpResponse) {
            const apiResponse = res?.body as IApiResponseModel<any>;
            if (!!apiResponse.errorCode && apiResponse.errorCode == InnerErrorCodes.NotLoggedIn) {
              this.authService.logout()
              this.router.navigate(['login']).then()
            }
          }
          return res;
        })
      );
  }
}
