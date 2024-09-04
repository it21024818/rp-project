import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { BadRequestException, ForbiddenException, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { compare, hash } from 'bcryptjs';
import { isUndefined } from 'lodash';
import { Model } from 'mongoose';
import { JwtTokenService } from 'src/auth/jwt-token.service';
import { CreateUserDto } from 'src/common/dtos/create-user.dto';
import { LoginDto } from 'src/common/dtos/login.dto';
import { TokenFamily } from 'src/common/dtos/token-family.dto';
import { AuthType } from 'src/common/enums/auth-type.enum';
import ErrorMessage from 'src/common/enums/error-message.enum';
import { TokenPurpose } from 'src/common/enums/token-purpose.enum';
import { UserRole } from 'src/common/enums/user-roles.enum';
import { EmailService } from 'src/email/email.service';
import { TokenService } from 'src/token/token.service';
import { User } from 'src/users/user.schema';
import { UsersService } from 'src/users/users.service';
import { AuthDetails, Credentials, CredentialsDocument } from './credentials.schema';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
    private readonly jwtTokenService: JwtTokenService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Credentials.name) private readonly credentialModel: Model<Credentials>,
  ) {}

  async refreshTokens(oldRefreshToken: string): Promise<Omit<LoginDto, 'user'>> {
    try {
      const id = await this.jwtTokenService.verifyRefreshToken(oldRefreshToken);

      // Get token family
      const tokenFamily = await this.cacheManager.get<TokenFamily>(id);
      if (isUndefined(tokenFamily)) {
        throw new ForbiddenException('Invalid refresh token');
      }

      // Check whether its the latest token
      if (tokenFamily.activeRefreshToken !== oldRefreshToken) {
        await this.cacheManager.del(id);
        throw new ForbiddenException('Old refresh token used');
      }

      // Generate new tokens
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtTokenService.getAccessToken(id),
        this.jwtTokenService.getRefreshToken(id),
      ]);

      // Update token family
      tokenFamily.oldAccessTokens = [tokenFamily.activeAccessToken];
      tokenFamily.oldRefreshTokens = [tokenFamily.activeRefreshToken];
      tokenFamily.activeAccessToken = accessToken;
      tokenFamily.activeRefreshToken = refreshToken;
      await this.cacheManager.set(id, tokenFamily);

      // Send back new updated token set
      return { tokens: { accessToken, refreshToken } };
    } catch (error) {
      console.log(error);
      throw new ForbiddenException(ErrorMessage.INVALID_TOKEN);
    }
  }

  async loginUser(email: string, password: string): Promise<LoginDto> {
    try {
      const existingUser = await this.usersService.getUserByEmail(email);
      const existingCredentials = await this.getCredentials(existingUser.id);
      const authDetails = this.findAuthDetails(existingCredentials, AuthType.EMAIL_PASSWORD);
      const isPasswordsMatching = await compare(password, authDetails.password!);

      if (!isPasswordsMatching) {
        this.logger.warn(`User with id '${existingUser.id}' has tried to login but used wrong password`);
        throw Error();
      }

      const [accessToken, refreshToken] = await Promise.all([
        this.jwtTokenService.getAccessToken(existingUser.id),
        this.jwtTokenService.getRefreshToken(existingUser.id),
      ]);

      const tokenFamily: TokenFamily = {
        userId: existingUser.id,
        activeAccessToken: accessToken,
        activeRefreshToken: refreshToken,
        oldAccessTokens: [],
        oldRefreshTokens: [],
      };
      await this.cacheManager.set(existingUser.id, tokenFamily);

      return { tokens: { accessToken, refreshToken }, user: existingUser.toJSON() };
    } catch (error) {
      this.logger.warn(`Failed to login user with email '${email}'`);
      console.log(error);
      throw new BadRequestException(ErrorMessage.INVALID_CREDENTIALS);
    }
  }

  async loginUserWithOAuth(email: string, type: AuthType): Promise<LoginDto> {
    try {
      const existingUser = await this.usersService.getUserByEmail(email);
      const existingCredentials = await this.getCredentials(existingUser.id);
      this.findAuthDetails(existingCredentials, type); // Just need to verify it exists
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtTokenService.getAccessToken(existingUser.id),
        this.jwtTokenService.getRefreshToken(existingUser.id),
      ]);

      const tokenFamily: TokenFamily = {
        userId: existingUser.id,
        activeAccessToken: accessToken,
        activeRefreshToken: refreshToken,
        oldAccessTokens: [],
        oldRefreshTokens: [],
      };
      await this.cacheManager.set(existingUser.id, tokenFamily);

      return { tokens: { accessToken, refreshToken }, user: existingUser.toJSON() };
    } catch (error) {
      this.logger.warn(`Failed to login user with email '${email}'`);
      console.log(error);
      throw new BadRequestException(ErrorMessage.INVALID_CREDENTIALS);
    }
  }

  async registerUser(userDto: CreateUserDto) {
    const existingUser = await this.userModel.findOne({ email: userDto.email });
    if (existingUser !== null) {
      this.logger.warn(`Attempted register but user with email '${userDto.email}' already exists`);
      throw new BadRequestException(ErrorMessage.USER_ALREADY_EXISTS);
    }

    // Create user
    const createdUser = new this.userModel(userDto);
    createdUser.roles = [UserRole.USER];
    const savedUser = await createdUser.save();

    // Create credentials
    const createdCredentials = new this.credentialModel({
      createdAt: new Date(),
      userId: savedUser.id,
      strategies: [
        {
          type: AuthType.EMAIL_PASSWORD,
          password: await hash(userDto.password, 10),
          createdAt: new Date(),
          createdBy: savedUser.id,
          isActive: false,
          archived: false,
        },
      ],
      createdBy: savedUser.id,
      archived: false,
    });
    await createdCredentials.save();

    this.sendRegistrationMail(userDto.email);
    return savedUser;
  }

  async registerOAuthUser(userDto: Partial<CreateUserDto>, authType: Omit<AuthType, 'EMAIL_PASSWORD'>) {
    const existingUser = await this.userModel.findOne({ email: userDto.email });
    if (existingUser !== null) {
      this.logger.warn(`Attempted register but user with email '${userDto.email}' already exists`);
      throw new BadRequestException(ErrorMessage.USER_ALREADY_EXISTS);
    }

    // Create user
    const createdUser = new this.userModel(userDto);
    createdUser.roles = [UserRole.ADMIN];
    const savedUser = await createdUser.save();

    // Create credentials
    const createdCredentials = new this.credentialModel({
      createdAt: new Date(),
      userId: savedUser.id,
      strategies: [
        {
          type: authType,
          createdAt: new Date(),
          createdBy: savedUser.id,
          isActive: false,
          archived: false,
        },
      ],
      createdBy: savedUser.id,
      archived: false,
    });
    await createdCredentials.save();

    return savedUser;
  }

  async sendRegistrationMail(email: string) {
    this.logger.log(`Attempting to send registration email to user with email '${email}'`);
    await this.tokenService.revokeAllActiveSignUpTokens(email);
    const token = await this.tokenService.createSignUpToken(email);
    this.emailService.sendMail(email, TokenPurpose.SIGN_UP, {
      token: token.code,
    });
    this.logger.log(`Successfully sent registration email to user with email '${email}'`);
  }

  async authorizeUser(tokenCode: string) {
    const { email } = await this.tokenService.claimToken(tokenCode, TokenPurpose.SIGN_UP);
    const existingUser = await this.usersService.getUserByEmail(email);
    const existingCredentials = await this.getCredentials(existingUser.id);
    const authDetails = this.findAuthDetails(existingCredentials, AuthType.EMAIL_PASSWORD);
    authDetails.isActive = true;
    await existingCredentials.save();
    return existingUser.toJSON();
  }

  async forgotUserPassword(email: string) {
    this.logger.log(`Attempting to send forgot password email to user with email '${email}'`);
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser === null) {
      this.logger.log(`Could not find a user with email '${email}'`);
      return;
    }

    await this.tokenService.revokeAllActiveResetPasswordTokens(email);
    const token = await this.tokenService.createResetPasswordToken(email);
    this.emailService.sendMail(email, TokenPurpose.RESET_PASSWORD, {
      token: token.code,
      firstName: existingUser.firstName,
      link: 'http://localhost:3000/reset-password',
    });
  }

  async resetUserPassword(password: string, tokenCode: string) {
    this.logger.log(`Attempting to reset password for user with token code '${tokenCode}'`);
    const { email } = await this.tokenService.claimToken(tokenCode, TokenPurpose.RESET_PASSWORD);
    const existingUser = await this.usersService.getUserByEmail(email);
    const existingCredentials = await this.getCredentials(existingUser.id);
    const authDetails = this.findAuthDetails(existingCredentials, AuthType.EMAIL_PASSWORD);
    await this.cacheManager.del(existingUser.id);
    authDetails.password = await hash(password, 10);
    await existingCredentials.save();
    this.logger.log(`Successfully reset password for user with email '${email}'`);
    return existingUser.toJSON();
  }

  async changeUserPassword(email: string, password: string, oldPassword: string) {
    try {
      const existingUser = await this.usersService.getUserByEmail(email);
      const existingCredentials = await this.getCredentials(existingUser.id);
      const authDetails = this.findAuthDetails(existingCredentials, AuthType.EMAIL_PASSWORD);
      const isPasswordsMatching = await compare(oldPassword, authDetails.password!);
      if (!isPasswordsMatching) {
        throw Error();
      }
      authDetails.password = await hash(password, 10);
      await existingCredentials.save();
      await this.cacheManager.del(existingUser.id);
      await existingUser.save();
    } catch (error) {
      throw new BadRequestException(ErrorMessage.INVALID_CREDENTIALS);
    }
  }

  async getCredentials(userId: string): Promise<CredentialsDocument> {
    const result = await this.credentialModel.findOne({ userId });
    if (result === null) {
      throw new BadRequestException(ErrorMessage.CREDENTIALS_NOT_FOUND, {
        description: `Could not find credentials for user with id '${userId}'`,
      });
    }
    return result;
  }

  private findAuthDetails(credentials: Credentials, type: AuthType): AuthDetails {
    const result = credentials.strategies.find(strategy => strategy.type === type);
    if (result === undefined) {
      throw new BadRequestException(ErrorMessage.CREDENTIALS_NOT_FOUND, {
        description: `Could not find auth details for type '${type}'`,
      });
    }
    return result;
  }
}
