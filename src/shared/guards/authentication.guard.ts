
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AUTH_METADATA_KEY, AuthDecoratorPayloadType } from '../decorators/auth.decorator';
import { AUTH_TYPE, CONDITION_GUARD_TYPE } from '../constants/auth.constant';
import { ApiKeyGuard } from './api-key.guard';
import { AccessTokenGuard } from './access-token.guard';


@Injectable()
export class AuthenticationGuard implements CanActivate {
    private readonly authTypeGuardMap: Record<string, CanActivate> = {
        [AUTH_TYPE.API_KEY]: this.apiKeyGuard,
        [AUTH_TYPE.BEARER]: this.accessTokenGuard,
        [AUTH_TYPE.NONE]: { canActivate: () => true }
    }

    constructor(
        private readonly reflector: Reflector,
        private readonly apiKeyGuard: ApiKeyGuard,
        private readonly accessTokenGuard: AccessTokenGuard
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const authTypeValues = this.reflector.getAllAndOverride<AuthDecoratorPayloadType | undefined>(AUTH_METADATA_KEY, [
            context.getHandler(),
            context.getClass(),
        ]) ?? { authType: [AUTH_TYPE.NONE], options: { conditionGuard: 'AND' } };
        const guards = authTypeValues.authType.map(authType => this.authTypeGuardMap[authType]);
        let error = new UnauthorizedException();
        if (authTypeValues.options.conditionGuard === CONDITION_GUARD_TYPE.OR) {
            for (const instanceOfGuard of guards) {
                const canActivate = await Promise.resolve(instanceOfGuard.canActivate(context)).catch(
                    (err) => {
                        error = err;
                        return false;
                    }
                );
                if (canActivate) {
                    return true;
                }
            }
            throw error;
        } else {
            for (const instanceOfGuard of guards) {
                const canActivate = await Promise.resolve(instanceOfGuard.canActivate(context)).catch(
                    (err) => {
                        error = err;
                        return false;
                    }
                );
                if (!canActivate) {
                    throw error;
                }
            }
        }
        return true;
    }
}
