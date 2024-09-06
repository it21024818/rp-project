import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { DetailedUserDto } from 'src/common/dtos/detailed-user.dto';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import { EditUserRequestDto } from 'src/common/dtos/request/edit-user.request.dto';
import { UserDto } from 'src/common/dtos/user.dto';
import { UserRole } from 'src/common/enums/user-roles.enum';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';
import { UsersService } from './users.service';

@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('search')
  async getUsersPage(@Body() pageRequest: PageRequest) {
    return await this.usersService.getUserPage(pageRequest);
  }

  @Put(':id')
  @Roles(...Object.values(UserRole))
  async updateUser(@Param('id', ValidateObjectIdPipe) id: string, @Body() editUserDto: EditUserRequestDto) {
    return await this.usersService.updateUser(id, editUserDto);
  }

  @Get(':id')
  async getUser(@Param('id', ValidateObjectIdPipe) id: string) {
    return (await this.usersService.getUser(id)).toJSON();
  }

  @Delete(':id')
  @Roles(...Object.values(UserRole))
  async deleteUser(@Param('id', ValidateObjectIdPipe) id: string) {
    await this.usersService.deleteUser(id);
  }

  @Get(':id/details')
  async getUserDetails(@Param('id', ValidateObjectIdPipe) id: string): Promise<UserDto> {
    const details = await this.usersService.getUserDetails(id);
    return DetailedUserDto.buildFrom(...details);
  }
}
