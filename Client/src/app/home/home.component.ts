import { Component, OnInit } from '@angular/core';
import {HomeService} from "./home.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  allOps$?: Observable<any>;
  constructor(private home: HomeService) { }

  ngOnInit(): void {
    this.allOps$ = this.home.accountOps$;
  }

}
