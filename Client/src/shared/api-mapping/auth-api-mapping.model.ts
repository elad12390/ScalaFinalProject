import { Mapping } from "./mapping";
import { addToPath } from "./utils";

export class AuthApiPath {
  private static readonly mapping = new Mapping(['login', 'register']);
  private static readonly _basePath = 'auth';
  readonly path;

  constructor(path: string) {
    this.path = addToPath(path, AuthApiPath._basePath);
  }

  get login() {
    return addToPath(this.path, AuthApiPath.mapping.login);
  }

  get register() {
    return addToPath(this.path, AuthApiPath.mapping.register);
  }
}
