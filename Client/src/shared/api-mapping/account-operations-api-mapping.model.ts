import { addToPath } from "./utils";

export class AccountOperationsApiMapping {
  private static readonly _basePath = 'account-operation';
  path;

  constructor(path: string) {
    this.path = addToPath(path, AccountOperationsApiMapping._basePath);
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

  get update(): string {
    return this.path;
  }
}
