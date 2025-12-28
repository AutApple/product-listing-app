import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserEntity } from '../users/index.js';
import bcrypt from 'bcrypt';
import { globalAuthConfiguration } from '../config/auth.config.js';

@Injectable()
export class RootUserService implements OnApplicationBootstrap {
  constructor(private dataSource: DataSource) {}

  async onApplicationBootstrap() {
    const userRepo = this.dataSource.getRepository(UserEntity);

    const rootEmail = process.env.DEFAULT_ROOT_EMAIL || 'root@example.com';
    const rootPassword = process.env.DEFAULT_ROOT_PASSWORD || 'root';

    const existingRoot = await userRepo.findOne({
      where: { email: rootEmail },
    });

    if (!existingRoot) {
      const password = rootPassword;
      const hashed = await bcrypt.hash(password, globalAuthConfiguration.saltLevel);

      const rootUser = userRepo.create({
        email: rootEmail,
        hashedPassword: hashed,
        isAdmin: true,
        name: 'ROOT'
      });

      await userRepo.save(rootUser);
      console.log(`Root user created: ${rootEmail}`);
    }
  }
}