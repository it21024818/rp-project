import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { JWTPayload, KeyLike, SignJWT, importPKCS8, importSPKI, jwtVerify } from 'jose';
import _ from 'lodash';
import { join } from 'path';
import { Audience } from 'src/common/enums/audience.enum';
import ErrorMessage from 'src/common/enums/error-message.enum';

@Injectable()
export class JwtTokenService {
  private accessPublicKey: KeyLike;
  private accessPrivateKey: KeyLike;
  private refreshPublicKey: KeyLike;
  private refreshPrivateKey: KeyLike;
  private readonly keyAlgorithm = 'RS256';
  private readonly issuer = 'UEE';
  private readonly logger = new Logger(JwtTokenService.name);

  constructor() {
    this.setup();
  }

  private async setup() {
    this.logger.log('Setting up private and public keys...');
    const [accessPrivateKey, accessPublicKey, refreshPrivateKey, refreshPublicKey] = await Promise.all([
      this.loadKey('./assets/certs/access-private-key.pem', true),
      this.loadKey('./assets/certs/access-public-key.pem'),
      this.loadKey('./assets/certs/refresh-private-key.pem', true),
      this.loadKey('./assets/certs/refresh-public-key.pem'),
    ]);
    this.accessPrivateKey = accessPrivateKey;
    this.accessPublicKey = accessPublicKey;
    this.refreshPrivateKey = refreshPrivateKey;
    this.refreshPublicKey = refreshPublicKey;
    this.logger.log('Finished setting up private and public keys');
  }

  async getAccessToken(id: string, aud: Audience): Promise<string> {
    this.logger.log(`Creating new access token for user with id '${id}' for audience '${aud}'`);
    return new SignJWT({})
      .setIssuedAt()
      .setSubject(id)
      .setIssuer(this.issuer)
      .setAudience(aud)
      .setExpirationTime('2h')
      .setProtectedHeader({ alg: this.keyAlgorithm })
      .sign(this.accessPrivateKey);
  }

  async getRefreshToken(id: string, aud: Audience): Promise<string> {
    this.logger.log(`Creating new refresh token for user with id '${id}' for audience '${aud}'`);
    return new SignJWT({})
      .setIssuedAt()
      .setSubject(id)
      .setIssuer(this.issuer)
      .setAudience(Object.values(Audience))
      .setExpirationTime('7d')
      .setProtectedHeader({ alg: this.keyAlgorithm })
      .sign(this.refreshPrivateKey);
  }

  async verifyAccessToken(token: string): Promise<string> {
    this.logger.debug(`Verifying access token '${_.truncate(token)}'`);
    const { payload } = await jwtVerify(token, this.accessPublicKey, {
      issuer: this.issuer,
      requiredClaims: ['sub', 'aud'],
      algorithms: [this.keyAlgorithm],
      audience: Object.values(Audience),
    });
    if (!payload.sub) {
      throw new InternalServerErrorException(ErrorMessage.INVALID_TOKEN, {
        description: 'Access token does not contain a subject',
      });
    }
    return payload.sub;
  }

  async getPayload(token: string): Promise<Required<JWTPayload>> {
    this.logger.log(`Getting access token '${_.truncate(token)}' payload`);
    const { payload } = await jwtVerify(token, this.accessPublicKey, {
      issuer: this.issuer,
      requiredClaims: ['sub', 'aud'],
      algorithms: [this.keyAlgorithm],
      audience: Object.values(Audience),
    });
    if (!payload.sub) {
      throw new InternalServerErrorException(ErrorMessage.INVALID_TOKEN, {
        description: 'Access token does not contain a subject',
      });
    }
    if (!payload.aud) {
      throw new InternalServerErrorException(ErrorMessage.INVALID_TOKEN, {
        description: 'Access token does not contain an audience',
      });
    }
    return payload as Required<JWTPayload>;
  }

  async verifyRefreshToken(token: string): Promise<string> {
    this.logger.log(`Verifying refresh token '${_.truncate(token)}'`);
    const { payload } = await jwtVerify(token, this.refreshPublicKey, {
      issuer: this.issuer,
      requiredClaims: ['sub', 'aud'],
      algorithms: [this.keyAlgorithm],
      audience: Object.values(Audience),
    });
    if (!payload.sub) {
      throw new InternalServerErrorException(ErrorMessage.INVALID_TOKEN, {
        description: 'Refresh token does not contain a subject',
      });
    }
    return payload.sub;
  }

  private async loadKey(path: string, isPrivate?: boolean) {
    const keyStr = (await readFile(join(process.cwd(), path))).toString();
    if (isPrivate) {
      return await importPKCS8(keyStr, this.keyAlgorithm);
    }
    return await importSPKI(keyStr, this.keyAlgorithm);
  }
}
