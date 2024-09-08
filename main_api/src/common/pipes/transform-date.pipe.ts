import { ArgumentMetadata, BadRequestException, Injectable, Logger, PipeTransform } from '@nestjs/common';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash';

@Injectable()
export class TransformDatePipe implements PipeTransform {
  private readonly logger = new Logger(TransformDatePipe.name);

  transform(value: string | undefined, metadata: ArgumentMetadata) {
    try {
      if (value === null || value === undefined || isEmpty(value)) {
        throw Error('Value is null or undefined');
      }

      return new Date(value);
    } catch (error) {
      const message = `Validation Failed (${JSON.stringify(value)} is not a valid date for ${metadata.type} '${
        metadata.data
      }')`;
      this.logger.warn('Rejecting request due to: ' + message);
      throw new BadRequestException(message);
    }
  }
}
