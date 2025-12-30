import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserCredentialsDto, UserEntity  } from './';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ERROR_MESSAGES, globalAuthConfiguration } from '../config/';
import bcrypt from 'bcrypt';
import { UpdateUserInfoDto } from './dto/update-user-info.dto.js';

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

  async changeCredentials(email: string, updateUserCredentialsDto: UpdateUserCredentialsDto): Promise<UserEntity> {
    const user = await this.findOneByEmail(email);
    if (updateUserCredentialsDto.email !== undefined) {
      if (await this.findOneByEmail(updateUserCredentialsDto.email))
        throw new ConflictException(ERROR_MESSAGES.DB_UNIQUE_CONSTRAINT_VIOLATION())
      user.email = updateUserCredentialsDto.email;
    }
    if (updateUserCredentialsDto.password !== undefined) user.hashedPassword = await bcrypt.hash(updateUserCredentialsDto.password, globalAuthConfiguration.saltLevel);
    await this.userRepository.save(user);
    return user;
  }

  async changeInfo(email: string, updateUserInfoDto: UpdateUserInfoDto): Promise<UserEntity> {
    const user = await this.findOneByEmail(email);
    if (updateUserInfoDto.name !== undefined) user.name = updateUserInfoDto.name;
    await this.userRepository.save(user);
    return user; 
  }


  async remove(email: string): Promise<UserEntity> {
    const user = await this.findOneByEmail(email);
    this.userRepository.remove(user);
    return user;
  }
}
