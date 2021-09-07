import { Observable } from "rxjs";
import { share } from 'rxjs/operators'

interface CachedObservable {
  observable: Observable<any>;
  deleteTimeout: any
}

const DEFAULT_SLIDING_TIME: number = 3000;

export class ObservableCache extends Map<string, CachedObservable> {
  private readonly slidingTime;
  constructor(slidingTime: number = DEFAULT_SLIDING_TIME) {
    super();
    this.slidingTime = slidingTime;
  }

  cache(key: string, obs: Observable<any>): Observable<any> {
    const newTimeout = setTimeout(() => {
                         super.delete(key);
                       }, this.slidingTime);
    const cached = super.get(key);
    if (cached?.observable) {
      clearTimeout(cached.deleteTimeout);
      cached.deleteTimeout = newTimeout;
      return cached.observable
    };
    const newCached = obs.pipe(share());
    super.set(key, {
      observable: newCached,
      deleteTimeout: newTimeout
    });
    return newCached;
  }
}
