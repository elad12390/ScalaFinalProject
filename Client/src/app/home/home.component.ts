import { Component, OnInit } from '@angular/core';
import {HomeService} from "./home.service";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import { AccountOps } from './account-ops';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  allOps$?: Observable<any>;
  account$?: Observable<any>;
  constructor(private homeService: HomeService) { }

  ngOnInit(): void {
  }
  getAccount(): void {
    this.allOps$ = this.homeService.accountOps$.pipe
    (map(i => i.data));
  }
  getAccountById(id:string): void {
    this.account$ = this.homeService.account$(id).pipe(
      map(res=>res.data)
    )
  }

  createAccountOperation(): void {
    this.homeService.newAccountOperation$.subscribe();
  }




}
