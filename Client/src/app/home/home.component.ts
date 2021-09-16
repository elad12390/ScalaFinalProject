import { Component, OnInit } from '@angular/core';
import {HomeService} from "./home.service";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {AccountOp} from "./account-op";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  allOps$?: Observable<any>;
  dataSource!: AccountOp[];
  displayedColumns!: string[];
  constructor(private homeService: HomeService) { }

  ngOnInit(): void {
    this.dataSource = [];
    this.displayedColumns = ['accountNumber', '_createdAt', '_updatedAt', 'actionType', 'amount', 'actions']
    this.allOps$ = this.homeService.accountOps$.pipe
    (map(i => i.data));
  }
  getAccount(): void {
  }
  create(): void {
    this.homeService.newAccountOperation$.subscribe();
  }

  createAccountOperation(): void {
    this.homeService.newAccountOperation$.subscribe();
  }
}
