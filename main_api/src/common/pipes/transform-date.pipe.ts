import { ArgumentMetadata, BadRequestException, Injectable, Logger, PipeTransform } from '@nestjs/common';
import dayjs from 'dayjs';

@Injectable()
export class TransformDatePipe implements PipeTransform {
  private readonly logger = new Logger(TransformDatePipe.name);

  transform(value: any, metadata: ArgumentMetadata) {
    try {
      dayjs(value);
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
