import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import {Observable} from "rxjs";
import {environment} from "@env";
import {AuthService} from "../services/auth.service";

@Injectable()
export class APIInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headers = req.headers;
    console.log(this.authService.userData)
    const token = this.authService.userData?.token as string;

    const apiReq = req.clone({
      url: `${environment.baseURL}/${req.url}`,
      setHeaders: {
        'Authorization': token
      }
    });
    return next.handle(apiReq);
  }
}
