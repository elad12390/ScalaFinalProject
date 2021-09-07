import { AuthApiPath } from './auth-api-mapping.model';

export class BaseApiPath {
  static readonly path = 'api';
  constructor() {}
  static get auth() {
    return new AuthApiPath(BaseApiPath.path);
  }
}
