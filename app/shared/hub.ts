import { Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface IHubData {
  uri: string;
  data: any;
  source: string;
}

export const Hub$ = new Subject<IHubData>();

export function Subscribe$<T>(prefix: string, cb: (data: T) => void): Subscription {
  return Hub$.pipe(filter(d => d.uri.startsWith(prefix))).subscribe(
    d => cb(d.data)
  );
}

export function Publish(uri: string, data: any, source?: string) {
  Hub$.next({ uri, data, source });
}
