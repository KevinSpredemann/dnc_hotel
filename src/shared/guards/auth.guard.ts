import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../../modules/auth/auth.service';
import { UserService } from '../../modules/users/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const { authorization } = request.headers;

    if (!authorization || !authorization.startsWith('Bearer '))
      throw new UnauthorizedException('No token provided');

    const token = authorization.split(' ')[1];

    const { valid, decoded } = await this.authService.validateToken(token);
    if (!valid) throw new UnauthorizedException('Invalid token');

    const user = await this.userService.getByid(Number(decoded.sub));

    if (!user) throw new UnauthorizedException('User not found');

    request.user = user;
    return true;
  }
}
