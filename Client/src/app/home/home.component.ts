import { Component, OnInit } from '@angular/core';
import {HomeService} from "./home.service";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {map, switchMap} from "rxjs/operators";
import {AccountOp} from "./account-op";
import {IApiResponseModel} from "../../shared/models/api.models";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  allOps$?: Observable<any>;
  balance$?: Observable<number>;
  dataSource!: AccountOp[];
  refresh$: Subject<any> = new Subject();
  displayedColumns!: string[];
  constructor(private homeService: HomeService) { }

  ngOnInit(): void {
    this.dataSource = [];
    this.displayedColumns = ['accountNumber', '_createdAt', '_updatedAt', 'actionType', 'amount', 'actions']
    this.allOps$ = this.homeService.accountOps$.pipe
    (map(i => i.data));
    this.balance$ = this.refresh$.pipe(
      switchMap(() => this.homeService.balance$),
      map(res => res.data),
      map(data => !!data ? -data : 0)
    )
    setTimeout(() => this.refresh$.next(), 0)
  }

  create(): void {
    this.homeService.newAccountOperation$.subscribe();
  }

  createAccountOperation(): void {
    this.homeService.newAccountOperation$.subscribe();
  }
}
