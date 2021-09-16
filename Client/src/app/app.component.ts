import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/shared/services/auth.service';
import {Observable} from "rxjs";
import {debounceTime, delay} from "rxjs/operators";
import {Navigation, NavigationEnd, NavigationError, NavigationStart, Router} from "@angular/router";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'scala-project-client';
  public isLoggedIn?: boolean;
  constructor(private authService: AuthService, private router: Router) {
    this.authService.isLoggedIn$
      .subscribe((isLoggedin) => {
        this.isLoggedIn = isLoggedin;
      });
  }
}
