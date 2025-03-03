export const AUTH_TYPE = {
    BEARER: 'Bearer',
    API_KEY: 'ApiKey',
    NONE: 'None'
} as const;

export type AuthTypeValue = (typeof AUTH_TYPE)[keyof typeof AUTH_TYPE];

export const CONDITION_GUARD_TYPE = {
    AND: 'and',
    OR: 'or'
} as const;

export type ConditionGuardTypeValue = (typeof CONDITION_GUARD_TYPE)[keyof typeof CONDITION_GUARD_TYPE];