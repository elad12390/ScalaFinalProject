import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../shared/services/auth.service";
import {BehaviorSubject} from "rxjs";
import {InnerErrorCodes} from "../../shared/enums";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  loginInvalid = false;
  formSubmitAttempt = false;
  returnUrl: string;
  loginErrors$ = new BehaviorSubject<{ userNotFound: boolean, wrongUserOrPassword: boolean }>({userNotFound: false, wrongUserOrPassword: false});

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    const {returnUrl} = this.route.snapshot.queryParams;
    this.returnUrl = returnUrl || '/home';
    if (this.authService.isLoggedIn) {
      this.router.navigate([this.returnUrl]).then();
    }

    this.form = this.fb.group({
      username: [''],
      password: ['', Validators.required]
    });
  }

  async ngOnInit(): Promise<void> {
    // if (await this.authService.checkAuthenticated()) {
    //   await this.router.navigate([this.returnUrl]);
    // }
  }

  async onSubmit(): Promise<void> {
    this.loginInvalid = false;
    this.formSubmitAttempt = false;
    if (this.form.valid) {
        const username = this.form.get('username')?.value;
        const password = this.form.get('password')?.value;
        this.authService.login$(username, password)
          .subscribe((res) => {
            switch (res.errorCode) {
              case InnerErrorCodes.UserNotFound:
                this.loginErrors$.next({
                  userNotFound: true,
                  wrongUserOrPassword: false
                })
                break;
              case InnerErrorCodes.UserOrPasswordWrong:
                this.loginErrors$.next({
                  userNotFound: false,
                  wrongUserOrPassword: true
                })
                break;
              default:
                if (this.authService.isLoggedIn) {
                  this.router.navigate([this.returnUrl]).then();
                }
                break;
            }
          });
    } else {
      this.formSubmitAttempt = true;
    }
  }

  navigateToRegister() {
    this.router.navigate(['register'], {queryParams:{userName: this.form.get('username')?.value}})
  }
}
