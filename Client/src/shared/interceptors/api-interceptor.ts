import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from "rxjs";
import {environment} from "@env";
import {AuthService} from "../services/auth.service";
import {tap} from "rxjs/operators";

@Injectable()
export class APIInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headers = req.headers;
    const token = this.authService.userData?.token as string;
    const userName = this.authService.userData?.userName as string;


    const apiReq = req.clone({
      url: `${environment.baseURL}/${req.url}`,
      ...(token && {setHeaders: {
        'user': userName,
        'token': token
      }})
    });
    return next.handle(apiReq)
      .pipe(
        tap(res => {
          return res;
        })
      );
  }
}
