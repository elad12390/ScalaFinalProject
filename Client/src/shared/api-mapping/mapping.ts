
export class Mapping {
  [key: string]: string;
  constructor(mapping: string[]) {
    mapping.forEach(mapKey => {
      Object.defineProperty(this, mapKey, {
        get: () => mapKey,
      });
    })
  }
}
