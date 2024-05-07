import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ValidateObjectIdPipe implements PipeTransform {
  private readonly logger = new Logger(ValidateObjectIdPipe.name);

  transform(value: any, metadata: ArgumentMetadata) {
    if (!isValidObjectId(value)) {
      const message = `Validation Failed ('${value}' is not a valid object id for ${metadata.type} '${metadata.data}')`;
      this.logger.warn('Rejecting request due to: ' + message);
      throw new BadRequestException(message);
    }
    return value;
  }
}
