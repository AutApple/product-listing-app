import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ERROR_MESSAGES } from '../config/error-messages.config.js';

@Injectable()
export class UsersService {
  constructor (
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>
  ) {}
  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = this.userRepository.create(createUserDto)
    return await this.userRepository.save(user);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOne({where: {email}});
    if(!user)
      throw new BadRequestException(ERROR_MESSAGES.RESOURCE_NOT_FOUND('user', email));
    return user;
  }

  async update(email: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOneByEmail(email);
    Object.assign(user, updateUserDto);
    await this.userRepository.save(user);
    return user;
  }

  async remove(email: string) {
    const user = await this.findOneByEmail(email);
    this.userRepository.remove(user);
    return user;
  }
}
