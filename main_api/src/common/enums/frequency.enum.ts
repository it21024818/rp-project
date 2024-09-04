import dayjs from 'dayjs';

export const Frequency = {
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  MONTHLY: 'MONTHLY',
  YEARLY: 'YEARLY',
} as const;

export class FrequencyUtil {
  static getDayJsUnit(frequency: Frequency): dayjs.ManipulateType {
    switch (frequency) {
      case 'DAILY':
        return 'd';
      case 'WEEKLY':
        return 'w';
      case 'MONTHLY':
        return 'M';
      case 'YEARLY':
        return 'y';
    }
  }
}

export type Frequency = keyof typeof Frequency;
