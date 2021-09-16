import { addToPath } from "./utils";
import {Mapping} from "./mapping";

export class AccountOperationsApiMapping {
  private static readonly _basePath = 'account-operation';
  private static readonly mapping = new Mapping(['balance']); // {login: 'login', register: 'register'}
  path;

  constructor(path: string) {
    this.path = addToPath(path, AccountOperationsApiMapping._basePath);
  }

  get balance(): string {
    return addToPath(this.path, AccountOperationsApiMapping.mapping.balance);
  }

  get getAll(): string {
    return this.path;
  }

  getById(id: string): string {
    return addToPath(this.path, id);
  }

  get create(): string {
    return this.path;
  }

  update(id: string): string {
    return addToPath(this.path, id);
  }

  delete(id: string): string {
    return addToPath(this.path, id);
  }
}
