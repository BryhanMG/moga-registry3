import { Injectable } from '@angular/core';
import { timer, Observable, Subject } from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RelojService {
  private _time$: Observable<Date> = timer(0, 1000*10).pipe(
    map(tick => new Date()),
    shareReplay(1)
  );

  private _timeSecond$: Observable<Date> = timer(0, 1000*2).pipe(
    map(tick => new Date()),
    shareReplay(1)
  );

  private _timeSecondSession$: Observable<Date> = timer(0, 1000).pipe(
    map(tick => new Date()),
    shareReplay(1)
  );

  get time() {
    return this._time$;
  }

  get timeSecond() {
    return this._timeSecond$;
  }
  get timeSecondSession() {
    return this._timeSecondSession$;
  }
  constructor() { }
}
