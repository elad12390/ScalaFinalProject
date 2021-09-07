import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../shared/services/auth.service";
import {InnerErrorCodes} from "../../shared/enums";
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form?: FormGroup;
  loginInvalid = false;
  formSubmitAttempt = false;
  returnUrl?: string;
  loginErrors$ = new BehaviorSubject<{ userExistsAlready: boolean }>({userExistsAlready: false});

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    const {userName, returnUrl} = this.route.snapshot.queryParams;
    this.returnUrl = returnUrl || '/home'
    if (this.authService.isLoggedIn) {
      this.router.navigate([this.returnUrl]).then();
    }

    this.form = this.fb.group({
      username: [userName],
      password: ['', Validators.required]
    });
  }

  async onSubmit(): Promise<void> {
    this.loginInvalid = false;
    this.formSubmitAttempt = false;
    if (!!this.form && this.form.valid) {
      const {username, password} = this.form.value;
      this.authService.register$(username, password)
        .subscribe((res) => {
          switch (res.errorCode) {
            case InnerErrorCodes.UserAlreadyExists:
              this.loginErrors$.next({
                userExistsAlready: true
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
}
