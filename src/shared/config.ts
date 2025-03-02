import { plainToInstance } from 'class-transformer';
import { IsString, validateSync } from 'class-validator';
import fs from 'fs';
import path from 'path';

if (!fs.existsSync(path.resolve('.env'))) {
    throw new Error('::: 🔴 Missing .env file :::');
}

class ConfigEnvSchema {
    @IsString()
    DATABASE_URL: string;
    @IsString()
    PORT: string;
    @IsString()
    CLIENT_URL: string;
    @IsString()
    JWT_REFRESH_TOKEN_EXPIRE: string;
    @IsString()
    JWT_ACCESS_TOKEN_EXPIRE: string;
    @IsString()
    JWT_REFRESH_TOKEN_PRIVATE_KEY: string;
    @IsString()
    JWT_ACCESS_TOKEN_PRIVATE_KEY: string;
    @IsString()
    PASSWORD_SALT: string;
}

const configEnvInstance = plainToInstance(ConfigEnvSchema, process.env);
const configEnvValidation = validateSync(configEnvInstance);
if (configEnvValidation.length > 0) {
    console.error('::: 🔴 Config validation error :::');
    const errors = configEnvValidation.map((error) => {
        return {
            property: error.property,
            constraints: error.constraints,
            value: error.value
        }
    });
    throw errors;
}

const configEnv = configEnvInstance;
export default configEnv;
