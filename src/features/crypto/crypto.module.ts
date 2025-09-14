import { Module } from '@nestjs/common';

import { CryptoService } from '@features/crypto/crypto.service';
@Module({
  providers: [CryptoService],
  exports: [CryptoService],
})
export class CryptoModule {}
