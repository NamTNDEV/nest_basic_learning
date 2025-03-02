import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BASE_CONSTANTS } from 'src/constants/base.constants';


@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: BASE_CONSTANTS.ENV_FILE
        }),
    ],
})
export class EnvConfigModule { }
