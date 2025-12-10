import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ERROR_MESSAGES } from '../config/error-messages.config.js';
import { OutputUserDto } from './dto/output/output-user.dto.js';

@Injectable()
export class UsersService {
  constructor (
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>
  ) {}
  async create(createUserDto: CreateUserDto): Promise<OutputUserDto> {
    const user = this.userRepository.create(createUserDto)
    return new OutputUserDto(await this.userRepository.save(user));
  }

  async findAll(): Promise<OutputUserDto[]> {
    return (await this.userRepository.find()).map(u => new OutputUserDto(u));
  }

  async findOneByEmail(email: string, selectPassword: boolean = false): Promise<UserEntity> {
    const user = await this.userRepository.findOne({where: {email}, select: selectPassword ? {id: true, isAdmin: true, email: true, name: true, hashedPassword: true} : {}});
    if(!user)
      throw new BadRequestException(ERROR_MESSAGES.RESOURCE_NOT_FOUND('user', email, 'email'));
    return user;
  }

  async findOneByEmailDto(email: string): Promise<OutputUserDto> {
    return new OutputUserDto(await this.findOneByEmail(email, false));
  }

  async update(email: string, updateUserDto: UpdateUserDto): Promise<OutputUserDto> {
    const user = await this.findOneByEmail(email);
    Object.assign(user, updateUserDto);
    await this.userRepository.save(user);
    return new OutputUserDto(user);
  }

  async remove(email: string): Promise<OutputUserDto> {
    const user = await this.findOneByEmail(email);
    this.userRepository.remove(user);
    return new OutputUserDto(user);
  }
}
