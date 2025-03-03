
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { TokenService } from '../services/token.service';
import { REQUEST_CONSTANTS } from '../constants/request.constant';
import configEnv from '../config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
    constructor(private readonly tokenService: TokenService) { }
    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const apiKey = request.headers['x-api-key'];
        if (!apiKey) {
            throw new UnauthorizedException("API Key is required");
        }
        if (apiKey !== configEnv.API_KEY) {
            throw new UnauthorizedException("Invalid API Key");
        }
        return true;
    }
}
