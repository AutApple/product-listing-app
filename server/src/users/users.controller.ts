import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { OutputUserDto } from './dto/output/output-user.dto.js';
import { ApiAuthHeader } from '../swagger/';
import { AccessTokenGuard, User } from '../auth/';
import { toOutputDto } from '../common/';
import { UserEntity } from './';
import { UpdateUserInfoDto } from './dto/update-user-info.dto.js';

@Controller('users')
export class UsersController { 
    constructor(
        private readonly usersService: UsersService
    ) {}

    private dto(entity: UserEntity | UserEntity[]): OutputUserDto | OutputUserDto[] {
        return toOutputDto(entity, OutputUserDto);
    }
    
    @ApiTags('Users')
    @ApiOperation({
        summary: 'Change info (name, non-auth fields) of user object associated with acess token in a header'
    })
    @ApiOkResponse({type: OutputUserDto, description: 'User object associated with updated info'})
    @ApiUnauthorizedResponse({ description: 'Unauthorized: invalid auth credentials' })
    @ApiAuthHeader()
    @UseGuards(AccessTokenGuard)
    @Patch('me')
    async updateMe(@User('email') email: string, @Body() updateUserInfoDto: UpdateUserInfoDto) {
        const data = await this.usersService.changeInfo(email, updateUserInfoDto);
        return this.dto(data);
    }
    
    @ApiTags('Users')
    @ApiOperation({
        summary: 'Get user object associated with access token in a header'
    })
    @ApiOkResponse({type: OutputUserDto, description: 'User object associated with provided credentials'})
    @ApiUnauthorizedResponse({ description: 'Unauthorized: invalid auth credentials' })
    @ApiAuthHeader()
    @UseGuards(AccessTokenGuard)
    @Get('me') 
    async getMe(@User('email') email: string) {
        const data = await this.usersService.findOneByEmail(email)
        return this.dto(data);
    }

    // TODO: admin-only endpoints (make/remove admin, maybe get user info)
    
}