import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { BadRequestException, ForbiddenException, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { compare, hash } from 'bcryptjs';
import { isUndefined } from 'lodash';
import { Model } from 'mongoose';
import { JwtTokenService } from 'src/auth/jwt-token.service';
import { CreateUserDto } from 'src/common/dtos/create-user.dto';
import { LoginDto } from 'src/common/dtos/login.dto';
import ErrorMessage from 'src/common/enums/error-message.enum';
import { TokenPurpose } from 'src/common/enums/token-purpose.enum';
import { UserRole } from 'src/common/enums/user-roles.enum';
import { TokenFamily } from 'src/common/schema/tokenFamily.schema';
import { EmailService } from 'src/email/email.service';
import { TokenService } from 'src/token/token.service';
import { User } from 'src/users/user.schema';
import { UsersService } from 'src/users/users.service';

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
      const isPasswordsMatching = await compare(password, existingUser.password);

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

      const { password: _userPassword, ...sanitizedUser } = existingUser.toJSON();
      return { tokens: { accessToken, refreshToken }, user: sanitizedUser };
    } catch (error) {
      this.logger.warn(`Failed to login user with email '${email}'`);
      console.log(error);
      throw new BadRequestException(ErrorMessage.INVALID_CREDENTIALS);
    }
  }

  async loginUserWithoutPassword(email: string): Promise<LoginDto> {
    try {
      const existingUser = await this.usersService.getUserByEmail(email);

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

      const { password: _userPassword, ...sanitizedUser } = existingUser.toJSON();
      return { tokens: { accessToken, refreshToken }, user: sanitizedUser };
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
    const createdUser = new this.userModel(userDto);
    createdUser.roles = [UserRole.ADMIN];
    createdUser.password = await hash(createdUser.password, 10);
    createdUser.isAuthorized = false;
    const savedUser = await createdUser.save();
    this.sendRegistrationMail(userDto.email);
    return savedUser;
  }

  async registerOAuthUser(userDto: Partial<CreateUserDto>) {
    const existingUser = await this.userModel.findOne({ email: userDto.email });
    if (existingUser !== null) {
      this.logger.warn(`Attempted register but user with email '${userDto.email}' already exists`);
      throw new BadRequestException(ErrorMessage.USER_ALREADY_EXISTS);
    }
    const createdUser = new this.userModel(userDto);
    createdUser.roles = [UserRole.ADMIN];
    createdUser.isAuthorized = true;
    const savedUser = await createdUser.save();
    return savedUser;
  }

  async sendRegistrationMail(email: string) {
    await this.tokenService.revokeAllActiveSignUpTokens(email);
    const token = await this.tokenService.createSignUpToken(email);
    this.emailService.sendMail(email, TokenPurpose.SIGN_UP, {
      token: token.code,
    });
  }

  async authorizeUser(tokenCode: string) {
    const { email } = await this.tokenService.claimToken(tokenCode, TokenPurpose.SIGN_UP);
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser == null) {
      this.logger.warn(`Could not find user with email '${email}'`);
      throw new BadRequestException(ErrorMessage.USER_NOT_FOUND);
    }

    existingUser.isAuthorized = true;
    const savedUser = await existingUser.save();
    return savedUser.toJSON();
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
    });
  }

  async resetUserPassword(password: string, tokenCode: string) {
    const { email } = await this.tokenService.claimToken(tokenCode, TokenPurpose.SIGN_UP);
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser === null) {
      this.logger.warn(`Could not find user with email '${email}'`);
      return;
    }
    await this.cacheManager.del(existingUser.id);

    existingUser.password = await hash(password, 10);
    const savedUser = await existingUser.save();
    return savedUser.toJSON();
  }

  async changeUserPassword(email: string, password: string, oldPassword: string) {
    try {
      const existingUser = await this.userModel.findOne({ email });
      if (existingUser === null) {
        return;
      }

      const isPasswordsMatching = await compare(oldPassword, existingUser.password);

      if (!isPasswordsMatching) {
        throw Error();
      }

      existingUser.password = await hash(password, 10);
      await this.cacheManager.del(existingUser.id);

      await existingUser.save();
    } catch (error) {
      throw new BadRequestException(ErrorMessage.INVALID_CREDENTIALS);
    }
  }
}
