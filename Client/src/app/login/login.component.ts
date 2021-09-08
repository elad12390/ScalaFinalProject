import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../shared/services/auth.service";
import {BehaviorSubject} from "rxjs";
import {InnerErrorCodes} from "../../shared/enums";
import {animate, keyframes, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('flip', [
      state('front', style({
        transform: 'rotateY(0deg)',
        opacity: 1,
      })),
      state('back', style({
        transform: 'rotateY(180deg)',
        opacity: 0,
      })),
      transition('front => back', [
        animate('1s 0s ease-out',
          keyframes([
            style({
              transform: 'perspective(400px) rotateY(0deg)',
              opacity: 1,
              offset: 0
            }),
            style({
              transform: 'perspective(400px) rotateY(80deg)',
              opacity: 1,
              offset: 0.4
            }),
            style({
              transform: 'perspective(400px) rotateY(100deg)',
              opacity: 0,
              offset: 0.5
            }),
            style({
              transform: 'perspective(400px) rotateY(180deg)',
              opacity: 0,
              offset: 0.8
            }),
            style({
              transform: 'perspective(400px) rotateY(180deg)',
              opacity: 0,
              offset: 1
            })
          ]))
      ]),
      transition('back => front', [
        animate('1s 0s ease-in',
          keyframes([
            style({
              transform: 'perspective(400px) rotateY(180deg)',
              opacity: 0,
              offset: 0
            }),
            style({
              transform: 'perspective(400px) rotateY(180deg)',
              opacity: 0,
              offset: 0.4
            }),
            style({
              transform: 'perspective(400px) rotateY(100deg)',
              opacity: 1,
              offset: 0.5
            }),
            style({
              transform: 'perspective(400px) rotateY(80deg)',
              opacity: 1,
              offset: 0.8
            }),
            style({
              transform: 'perspective(400px) rotateY(0deg)',
              opacity: 1,
              offset: 1
            })
          ]))
      ])
    ])
  ]
})
export class LoginComponent implements OnInit {
  viewedForm: 'login' | 'register' = 'login'
  loginFormGroup: FormGroup;
  registerFormGroup: FormGroup;
  loginInvalid = false;
  formSubmitAttempt = false;
  returnUrl: string;
  loginErrors$ = new BehaviorSubject<{ userNotFound: boolean, wrongUserOrPassword: boolean }>({userNotFound: false, wrongUserOrPassword: false});
  registerErrors$ = new BehaviorSubject<{ userExistsAlready: boolean }>({userExistsAlready: false});

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    const {returnUrl} = this.route.snapshot.queryParams;
    this.returnUrl = returnUrl || '/home';
    if (this.authService.isLoggedIn) {
      this.router.navigate([this.returnUrl]).then();
    }

    this.loginFormGroup = new FormGroup({
      username: new FormControl('', [Validators.email]),
      password: new FormControl('', [Validators.required])
    });

    this.registerFormGroup = new FormGroup({
      username: new FormControl('', [Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('')
    }, [this.validateConfirmPassword]);
  }

  get validateConfirmPassword() {
    return (form: AbstractControl) => {
      if (form.value?.password !== form.value?.confirmPassword) {
        form.get('confirmPassword')?.setErrors({passwordsNotEquiv: true})
        return ({confirmPassword: {passwordsNotEquiv: true}})
      }
      return null
    };
  }

  async ngOnInit(): Promise<void> {
    // if (await this.authService.checkAuthenticated()) {
    //   await this.router.navigate([this.returnUrl]);
    // }
  }

  async onLoginSubmit(): Promise<void> {
    this.loginInvalid = false;
    this.formSubmitAttempt = false;
    if (this.loginFormGroup.valid) {
        const {username,password} = this.loginFormGroup.getRawValue();
        this.authService.login$(username, password)
          .subscribe(async (res) => {
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
                  await this.sleep(100)
                  this.router.navigate([this.returnUrl]).then();
                }
                break;
            }
          });
    } else {
      this.formSubmitAttempt = true;
    }
  }

  async onRegisterSubmit(): Promise<void> {
    this.loginInvalid = false;
    this.formSubmitAttempt = false;
    if (!!this.registerFormGroup && this.registerFormGroup.valid) {
      const {username, password} = this.registerFormGroup.value;
      this.authService.register$(username, password)
        .subscribe((res) => {
          switch (res.errorCode) {
            case InnerErrorCodes.UserAlreadyExists:
              this.registerErrors$.next({
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

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  navigateToRegister() {
    this.router.navigate(['register'], {queryParams:{userName: this.loginFormGroup.get('username')?.value}})
  }

  onRegisterFlipButton() {
    this.viewedForm = 'register';
    this.registerFormGroup.setValue({
      username: this.loginFormGroup.get('username')?.value,
      password: '',
      confirmPassword: ''
    })
  }
}
