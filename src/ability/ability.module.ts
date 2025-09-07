import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AbilityFactory } from './ability.factory';

@Module({
  imports: [JwtModule],
  providers: [AbilityFactory, JwtService],
  exports: [AbilityFactory, JwtService],
})
export class AbilityModule {}
