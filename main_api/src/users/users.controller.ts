import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import { UserRole } from 'src/common/enums/user-roles.enum';
import { ValidateEmailPipe } from 'src/common/pipes/validate-email.pipe';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('search')
  async getUsersPage(@Body() pageRequest: PageRequest) {
    return await this.usersService.getUserPage(pageRequest);
  }

  @Get(':id')
  async getUser(@Param('id', ValidateObjectIdPipe) id: string) {
    const { password, ...user } = (await this.usersService.getUser(id)).toJSON();
    return user;
  }

  @Delete(':id')
  @Roles(...Object.values(UserRole))
  async deleteUser(@Param('id', ValidateObjectIdPipe) id: string) {
    await this.usersService.deleteUser(id);
  }
}
