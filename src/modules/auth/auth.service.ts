import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from "../user/user.service";
import * as bcrypt from 'bcrypt';
import { IUser } from "../user/interfaces/user.interface";
import { LoginResponseDto } from "./dto/login-response.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(login: string, pass: string): Promise<IUser | null> {
    const user = await this.usersService.findOneByLogin(login);
    if (user && await bcrypt.compare(pass, user.password)) {
      return user;
    }
    return null;
  }

  async login(user: IUser):Promise<LoginResponseDto>{
    const payload = { username: user.login, id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}