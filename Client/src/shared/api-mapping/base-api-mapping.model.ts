import { AuthApiPath } from './auth-api-mapping.model';
import {AccountOperationsApiMapping} from "./account-operations-api-mapping.model";

export class BaseApiPath {
  static readonly path = 'api';
  constructor() {}
  static get auth() {
    return new AuthApiPath(BaseApiPath.path);
  }
  static get accountOperations() {
    return new AccountOperationsApiMapping(BaseApiPath.path)
  }
}
