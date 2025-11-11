import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../../modules/auth/auth.service';
import { FindOneHotelService } from '../../modules/hotels/domain/services/findOneHotel.service';

@Injectable()
export class OwnerHotelGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly hotelService: FindOneHotelService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const hotelId = Number(request.params.id);

    const user = request.user;
    if (!user) return false;

    const hotel = await this.hotelService.execute(hotelId);

    if(!hotel) return false;

    return hotel.ownerId === user.id;
  }
}
