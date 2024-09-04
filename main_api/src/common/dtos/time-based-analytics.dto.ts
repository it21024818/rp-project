import { TimeBin } from './time-bin.dto';

export class TimeBasedAnalytics<T extends string> {
  sum: {
    total: number;
  } & { [k in T]: number };
  bins: (TimeBin & { [k in T]: number })[];
}
