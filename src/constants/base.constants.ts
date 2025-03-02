export const BASE_CONSTANTS = {
    ENV_FILE: `.env${!process.env.NODE_ENV ? '' : `.${process.env.NODE_ENV}`}`,
};