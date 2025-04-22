import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // ✅ Export PrismaService so other modules can use it
})
export class PrismaModule {}
