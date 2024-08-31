import { TimeBin } from './time-bin.dto';

type StringUnion<T extends string> = T extends any ? T : never;

export class TimeBasedAnalytics<T extends string> {
  sum: {
    total: number;
  } & { [k in T]: number };
  bins: (TimeBin & { [k in T]: number })[];
}
