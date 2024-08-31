import { ArgumentMetadata, BadRequestException, Injectable, Logger, PipeTransform } from '@nestjs/common';
import dayjs from 'dayjs';

@Injectable()
export class ToUpperPipe implements PipeTransform {
  private readonly logger = new Logger(ToUpperPipe.name);

  transform(value: any, metadata: ArgumentMetadata) {
    try {
      return (value as string).toUpperCase();
    } catch (error) {
      const message = `Uppercasing failed (${JSON.stringify(value)} is not a valid date for ${metadata.type} '${
        metadata.data
      }')`;
      this.logger.warn('Rejecting request due to: ' + message);
      throw new BadRequestException(message);
    }
  }
}
