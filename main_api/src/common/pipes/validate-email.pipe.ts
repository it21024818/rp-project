import { ArgumentMetadata, BadRequestException, Injectable, Logger, PipeTransform } from '@nestjs/common';

@Injectable()
export class ValidateEmailPipe implements PipeTransform {
  private readonly logger = new Logger(ValidateEmailPipe.name);

  transform(value: any, metadata: ArgumentMetadata) {
    const isEmail =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
        value,
      );
    if (!isEmail) {
      const message = `Validation Failed ('${value}' is not a valid email for ${metadata.type} '${metadata.data}')`;
      this.logger.warn('Rejecting request due to: ' + message);
      throw new BadRequestException(message);
    }
    return value;
  }
}
