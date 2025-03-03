import { SetMetadata } from "@nestjs/common";
import { AuthTypeValue, ConditionGuardTypeValue } from "../constants/auth.constant";
export const AUTH_METADATA_KEY = 'auth_metadata_key';
export interface AuthDecoratorPayloadType {
    authType: AuthTypeValue[];
    options: {
        conditionGuard: ConditionGuardTypeValue;
    }
};
export const Auth = (authType: AuthTypeValue[], options: { conditionGuard: ConditionGuardTypeValue }) => {
    return SetMetadata(AUTH_METADATA_KEY, { authType, options });
}