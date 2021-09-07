import { union, keys, filter, isEqual } from "lodash";

export function changedKeys(o1: any, o2: any): any {
  var k = union(keys(o1), keys(o2));
  return k.reduce((accumulator, key) => {
    if (typeof o1[key] === 'object' && typeof o2[key] === 'object' && !isEqual(o1, o2)) {
      accumulator[key] = changedKeys(o1[key], o2[key]);
    } else {
      if (o1[key] !== o2[key]) {
        accumulator[key] = o2[key];
      }
    }

    return accumulator;
  }, {} as any)
}
