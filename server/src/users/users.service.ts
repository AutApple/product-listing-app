import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, UserEntity  } from './';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ERROR_MESSAGES, globalAuthConfiguration } from '../config/';
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
      throw new NotFoundException(ERROR_MESSAGES.RESOURCE_NOT_FOUND('user', email, 'email'));
    return user;
  }
 
  async setRefreshToken(email: string, token: string | null): Promise<UserEntity> { 
      const user = await this.findOneByEmail(email);

      user.hashedRefreshToken = typeof(token) === 'string' ? await bcrypt.hash(token, globalAuthConfiguration.saltLevel) : null;
      return await this.userRepository.save(user);
  }

  async changeEmailName(email: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findOneByEmail(email);
    if (updateUserDto.name !== undefined) user.name = updateUserDto.name;
    if (updateUserDto.email !== undefined) user.email = updateUserDto.email;
    await this.userRepository.save(user);
    return user;
  }

  async changePassword(email: string, newPassword: string): Promise<UserEntity> {
    const user = await this.findOneByEmail(email);
    const hashedPassword = await bcrypt.hash(newPassword, globalAuthConfiguration.saltLevel);
    user.hashedPassword = hashedPassword;
    this.userRepository.save(user);
    return user;
  } 

  

  async remove(email: string): Promise<UserEntity> {
    const user = await this.findOneByEmail(email);
    this.userRepository.remove(user);
    return user;
  }
}
