import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { OutputUserDto } from './dto/output/output-user.dto.js';
import { ApiAuthHeader } from '../swagger/';
import { AccessTokenGuard, User } from '../auth/';
import { toOutputDto } from '../common/';
import { UserEntity } from './';

@Controller('users')
export class UsersController { 
    constructor(
        private readonly usersService: UsersService
    ) {}
    
    private dto(entity: UserEntity | UserEntity[]): OutputUserDto | OutputUserDto[] {
        return toOutputDto(entity, OutputUserDto);
    }
    
    @ApiTags('Auth')
    @ApiOperation({
        summary: 'Get user object associated with access token in a header'
    })
    @ApiOkResponse({type: OutputUserDto, description: 'User object associated with provided credentials'})
    @ApiUnauthorizedResponse({ description: 'Unauthorized: invalid auth credentials' })
    @ApiAuthHeader()
    @UseGuards(AccessTokenGuard)
    @Get('me') 
    async me(@User('email') email: string) {
        const data = await this.usersService.findOneByEmail(email)
        return this.dto(data);
    }
}