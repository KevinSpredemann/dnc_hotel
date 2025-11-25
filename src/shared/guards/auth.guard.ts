import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../../modules/auth/auth.service';
import { GetByIdUserService } from '../../modules/users/services/getByIdUser.service';
import { REPOSITORY_TOKEN_USER } from '../../modules/users/utils/usersTokens';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly getByIdUserService: GetByIdUserService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const { authorization } = request.headers;

    if (!authorization || !authorization.startsWith('Bearer '))
      throw new UnauthorizedException('No token provided');

    const token = authorization.split(' ')[1];

    const { valid, decoded } = await this.authService.validateToken(token);
    if (!valid) throw new UnauthorizedException('Invalid token');

    const user = await this.getByIdUserService.execute(Number(decoded.sub));

    if (!user) throw new UnauthorizedException('User not found');

    request.user = user;
    return true;
  }
}
