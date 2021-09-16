import {Component, Input, OnInit, Output} from '@angular/core';
import {concat, forkJoin, Observable, zip} from "rxjs";
import {AccountOp, AccountOpsTableView, ActionTypes} from "../../account-op";
import {HomeService} from "../../home.service";
import {switchMap, tap} from "rxjs/operators";

@Component({
  selector: 'app-home-table',
  templateUrl: './home-table.component.html',
  styleUrls: ['./home-table.component.scss']
})
export class HomeTableComponent implements OnInit {

  @Input() allOps$?: Observable<AccountOpsTableView[]>;
  @Input() displayedColumns?: string[];
  allOps: AccountOpsTableView[] = [];
  ActionTypes = ActionTypes;
  newLines: AccountOpsTableView[] = [];
  isEdited = false;
  now: Date = new Date();
  constructor(private homeService: HomeService) {
  }

  ngOnInit(): void {
    this.allOps$?.subscribe(data => this.allOps = data);
  }

  createNewLine() {
    this.enterEditMode();
    this.newLines.push({
      isEditing: true,
      isChanged: true
    })
  }

  identity(element: AccountOpsTableView): AccountOpsTableView {
    return element;
  }

  enterEditMode() {
    this.isEdited = true;
    this.allOps = this.allOps.map(op => {
      op.isEditing = true;
      return op;
    });
  }

  get isEditValid(): boolean {
    return this.newLines.filter(line => line.accountNumber && line.actionType && line.amount).length === this.newLines.length &&
      this.allOps.filter(line => line.accountNumber && line.actionType && line.amount).length === this.allOps.length;
  }

  saveEdit() {
    const updated = [...this.allOps.filter(op => op.isChanged)];
    const obs = updated.map(op => this.homeService.updateAccountOp(op._id!, op));
    obs.push(...this.newLines.map(line => this.homeService.createAccountOp(line)))
    if (obs.length) {
      forkJoin(obs).pipe(
        switchMap(() => this.allOps$!),
        tap((data: AccountOpsTableView[]) => {
          this.allOps = data;
          this.isEdited = false;
          this.newLines = [];
        })
      ).subscribe()
    } else {
      this.isEdited = false;
    }
  }

  cancelEdit() {
    this.allOps$?.subscribe(data => {
      this.allOps = data;
      this.isEdited = false;
      this.newLines = [];
    });
  }

  delete(element: AccountOpsTableView) {
    console.log(element)
    this.homeService.delete(element._id!)
      .pipe(
        switchMap(() => this.allOps$!),
        tap((data: AccountOpsTableView[]) => {
          this.allOps = data;
          this.isEdited = false;
        })
      ).subscribe();
  }
}
