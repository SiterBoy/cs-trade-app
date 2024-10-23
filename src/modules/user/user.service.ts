import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Sql } from 'postgres';
import { IUser } from "./interfaces/user.interface";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(@Inject('DATABASE_CONNECTION') private readonly db: Sql) {}

  async findUserById(userId: number): Promise<IUser | null> {
    try {
      const users = await this.db<IUser[]>`
        SELECT * FROM users WHERE id = ${userId}
      `;
      return users[0] || null;
    } catch (error) {
      console.error('Error in findUserById:', error);
      throw new InternalServerErrorException('Failed to find user by ID');
    }
  }

  async findOneByLogin(login: string): Promise<IUser | null> {
    try {
      const users = await this.db<IUser[]>`
        SELECT * FROM users WHERE login = ${login} LIMIT 1
      `;
      return users[0] || null;
    } catch (error) {
      console.error('Error in findOneByLogin:', error);
      throw new InternalServerErrorException('Failed to find user by login');
    }
  }

  async findUserByIdWithTransaction(userId: number, transaction: Sql): Promise<IUser | null> {
    try {
      const users = await transaction<IUser[]>`
        SELECT * FROM users WHERE id = ${userId} FOR UPDATE
      `;
      return users[0] || null;
    } catch (error) {
      console.error('Error in findUserByIdWithTransaction:', error);
      throw new InternalServerErrorException('Failed to find user by ID with transaction');
    }
  }

  async updateUserBalanceWithTransaction(
    userId: number,
    newBalance: number,
    transaction: Sql,
  ): Promise<void> {
    try {
      await transaction`
        UPDATE users SET balance = ${newBalance} WHERE id = ${userId}
      `;
    } catch (error) {
      console.error('Error in updateUserBalanceWithTransaction:', error);
      throw new InternalServerErrorException('Failed to update user balance with transaction');
    }
  }

  async updatePassword(userId: number, hashedPassword: string): Promise<void> {
    try {
      await this.db`
        UPDATE users SET password = ${hashedPassword} WHERE id = ${userId}
      `;
    } catch (error) {
      console.error('Error in updatePassword:', error);
      throw new InternalServerErrorException('Failed to update user password');
    }
  }

  async createRandomUser(): Promise<CreateUserDto> {
    try {
      const randomLogin = `user_${uuidv4()}`;
      const randomPassword = uuidv4();

      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      const users = await this.db`
        INSERT INTO users (login, password)
        VALUES (${randomLogin}, ${hashedPassword})
        RETURNING *
      `;

      const newUser = users[0];

      const createUserDto = new CreateUserDto();
      createUserDto.id = newUser.id;
      createUserDto.login = newUser.login;
      createUserDto.password = randomPassword; // Возвращаем исходный пароль
      createUserDto.balance = newUser.balance;
      createUserDto.created_at = newUser.created_at;
      createUserDto.updated_at = newUser.updated_at;

      return createUserDto;
    } catch (error) {
      console.error('Error in createRandomUser:', error);
      throw new InternalServerErrorException('Failed to create random user');
    }
  }
}