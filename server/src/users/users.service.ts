import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ERROR_MESSAGES } from '../config/error-messages.config.js';
import { globalAuthConfiguration } from '../config/auth.config.js';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor (
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>
  ) {}
  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const {password, ...userData} = createUserDto;
    const hashedPassword = await bcrypt.hash(password, globalAuthConfiguration.saltLevel);
    const user = this.userRepository.create({hashedPassword, ...userData});
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<UserEntity[]> {
    return  await this.userRepository.find();
  }

  async findOneByEmail(email: string, selectPassword: boolean = false): Promise<UserEntity> {
    const user = await this.userRepository.findOne({where: {email}, select: selectPassword ? {id: true, isAdmin: true, email: true, name: true, hashedPassword: true} : {}});
    if(!user)
      throw new BadRequestException(ERROR_MESSAGES.RESOURCE_NOT_FOUND('user', email, 'email'));
    return user;
  }
 
  async setRefreshToken(email: string, token: string): Promise<UserEntity> { 
      const user = await this.findOneByEmail(email);
      user.hashedRefreshToken = await bcrypt.hash(token, globalAuthConfiguration.saltLevel);
      return await this.userRepository.save(user);
  }

  async update(email: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findOneByEmail(email);
    Object.assign(user, updateUserDto);
    await this.userRepository.save(user);
    return user;
  }

  async remove(email: string): Promise<UserEntity> {
    const user = await this.findOneByEmail(email);
    this.userRepository.remove(user);
    return user;
  }
}
