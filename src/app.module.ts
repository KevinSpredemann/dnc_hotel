import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { MailerModule } from '@nestjs-modules/mailer';
import { UserModule } from './modules/users/user.module';
import { HotelsModule } from './modules/hotels/hotels.module';
import { ReservationsModule } from './modules/reservations/reservations.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthModule,
    ThrottlerModule.forRoot([
      {
        ttl: 5000,
        limit: 20,
      },
    ]),
    MailerModule.forRoot({
      transport: process.env.SMTP,
      defaults: {
        from: `"Dnc_Hotel" <${process.env.EMAIL_USER}>`,
      },
    }),
    HotelsModule,
    ReservationsModule,
  ],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
