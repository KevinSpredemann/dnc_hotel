import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserService } from '../users/user.service';
import { AuthRegisterDTO } from './domain/dto/authRegister.dto';
import { CreateUserDTO } from '../users/domain/dto/createUser.dto';
import { AuthResetPasswordDTO } from './domain/dto/authResetPassword.dto';
import { ValidateTokenDTO } from './domain/dto/validateToken.dto';
import { AuthLoginDTO } from './domain/dto/authLogin.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async generateToken(user: User, expiresIn: number = 60 * 60 * 24) {
    const payload = { sub: user.id, name: user.name };
    const options = {
      expiresIn: expiresIn,
      issuer: 'dnc_hotel',
      audience: 'users',
    };
    return { access_token: this.jwtService.sign(payload, options) };
  }

  async login({ email, password }: AuthLoginDTO) {
    const user = await this.userService.getByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Email or password is incorrect');
    }
    return await this.generateToken(user);
  }

  async register(body: AuthRegisterDTO) {
    const newUser: CreateUserDTO = {
      name: body.name,
      email: body.email,
      password: body.password,
      role: body.role ?? Role.USER,
    };
    const user = await this.userService.create(newUser);
    return await this.generateToken(user);
  }

  async reset({ token, password }: AuthResetPasswordDTO) {
    const { valid, decoded } = await this.validateToken(token);
    if (!valid || !decoded) {
      throw new UnauthorizedException('Invalid token');
    }
    const user: User = await this.userService.update(Number(decoded.sub), {
      password,
    });
    return await this.generateToken(user);
  }

  async forgot(email: string) {
    const user = await this.userService.getByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Email not found');
    }
    const token = await this.generateToken(user, 60 * 15);

    return token;
  }

  private async validateToken(token: string): Promise<ValidateTokenDTO> {
    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
        audience: 'users',
        issuer: 'dnc_hotel',
      });
      console.log(decoded.issues);
      return { valid: true, decoded };
    } catch (error) {
      return { valid: false, message: error.message };
    }
  }
}
