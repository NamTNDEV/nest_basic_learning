import { Global, Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { HashService } from './services/hash.service';

const SharedServices = [PrismaService, HashService];

@Global()
@Module({
    providers: SharedServices,
    exports: SharedServices
})
export class SharedModule { }
