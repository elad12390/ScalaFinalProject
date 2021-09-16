export interface AccountOp {
    _id?: string;
    accountNumber?: number;
    _createdAt?: string;
    _updatedAt?: string;
    actionType?: string;
    amount?: number;
}

export class AccountOpRequest {
  accountNumber?: number;
  _createdAt?: string;
  _updatedAt?: string;
  actionType?: string;
  amount?: number;

  constructor(data: AccountOp) {
    this.accountNumber = data.accountNumber;
    this._createdAt = data._createdAt;
    this._updatedAt = data._updatedAt;
    this.actionType = data.actionType;
    this.amount = data.amount;
  }
}

export interface AccountOpsTableView {
  _id?: string;
  accountNumber?: number;
  _createdAt?: string;
  _updatedAt?: string;
  actionType?: string;
  amount?: number;
  isEditing: boolean;
  isChanged: boolean;
}

export const ActionTypes = {
  Purchases: {id: 1, name: 'קניות'},
  Sales: {id: 2, name: 'מכירה'},
  WorkIncome: {id: 3, name: 'הכנסות מהעבודה'},
  HomeExpenses: {id: 4, name: 'הוצאה ביתית'},
  Electricity: {id: 5, name: 'חשמל'},
  Water: {id: 6, name: 'מים'},
  Food: {id: 7, name: 'קניות אוכל'},
  getById: (id: number) => Object.values(ActionTypes).filter((val: any) => typeof(val) === 'object' ? val.id === id : false)[0],
  getElements: () => Object.values(ActionTypes).filter((val: any) => typeof(val) === 'object') as {id: number; name: string}[]
}
