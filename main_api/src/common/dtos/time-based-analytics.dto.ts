import { TimeBin } from './time-bin.dto';

export class TimeBasedAnalytics<T extends string> {
  sum: {
    total: number;
  } & Record<T, number>;
  bins: (TimeBin & Record<T, number>)[];
}
