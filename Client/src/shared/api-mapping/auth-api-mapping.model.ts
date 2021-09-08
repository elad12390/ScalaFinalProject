import { Mapping } from "./mapping";
import { addToPath } from "./utils";

// api/auth
export class AuthApiPath {
  private static readonly mapping = new Mapping(['login', 'register']); // {login: 'login', register: 'register'}
  private static readonly _basePath = 'auth';
  path;

  constructor(path: string) {
    this.path = addToPath(path, AuthApiPath._basePath);
  }

  // api/auth/login
  get login() {
    return addToPath(this.path, AuthApiPath.mapping.login);
  }

  // api/auth/register
  get register() {
    return addToPath(this.path, AuthApiPath.mapping.register);
  }
}
