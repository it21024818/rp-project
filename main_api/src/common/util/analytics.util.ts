import dayjs from 'dayjs';
import _ from 'lodash';
import { Model } from 'mongoose';
import { TimeBasedAnalytics } from '../dtos/time-based-analytics.dto';
import { Frequency, FrequencyUtil } from '../enums/frequency.enum';
import { Audit } from '../schema/audit.schema';

export class AnalyticsUtils {
  public static async getTimeBasedAnalytics<T extends string, V extends Audit>({
    model,
    options,
    fields,
    filters,
  }: {
    model: Model<V>;
    options: { startDate: Date; endDate: Date; frequency: Frequency };
    fields: Record<T, (item: V) => boolean | undefined>;
    filters?: Record<string, string | undefined>;
  }): Promise<TimeBasedAnalytics<T>> {
    let bins: TimeBasedAnalytics<string>['bins'] = [];
    const { startDate, endDate, frequency } = options;
    const items = await model.find({ createdAt: { $gte: startDate, $lt: endDate }, ...filters });
    let current = dayjs(startDate);
    const end = dayjs(endDate);
    const stop = 9999;
    while (current.isBefore(end) && bins.length < stop) {
      let currentBin: (typeof bins)[number] = { startDate: current.toDate(), endDate: end.toDate() } as any;
      const next = current.add(1, FrequencyUtil.getDayJsUnit(frequency));
      for (const field in fields) {
        const predicate = fields[field];
        const count = items
          .filter(item => dayjs(item.createdAt).isBefore(end))
          .filter(item => dayjs(item.createdAt).isAfter(current))
          .filter(predicate).length;
        currentBin[field] = count;
      }

      bins = [...bins, currentBin];
      current = next;
    }
    let sum: TimeBasedAnalytics<string>['sum'] = {
      total: 0,
    };
    for (const field in fields) {
      sum[field] = _.sum(bins.map(i => i[field]));
    }
    sum.total = _.sum(Object.values(sum));
    return { sum, bins } as TimeBasedAnalytics<T>;
  }
}
