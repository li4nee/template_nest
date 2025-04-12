import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { AppDataSource } from 'src/config/db.config';

@Injectable()
export class UserRepository {
  private userModel: Repository<User>;

  constructor() {
    this.userModel = AppDataSource.getRepository(User);
  }

  get model(): Repository<User> {
    return this.userModel;
  }
}
