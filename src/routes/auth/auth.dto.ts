import { Exclude } from "class-transformer";
import { IsString } from "class-validator";

// ::: REQUEST :::
export class LoginReqDto {
    @IsString({ message: 'Email must be a string' })
    email: string;

    @IsString({ message: 'Password must be a string' })
    password: string;
};

export class RegisterReqDto extends LoginReqDto {
    @IsString({ message: 'Name must be a string' })
    name: string;

    @IsString({ message: 'Confirm password must be a string' })
    confirmPassword: string;
};

export class RefreshTokenReqDto {
    @IsString({ message: 'Refresh token must be a string' })
    refreshToken: string;
}


// ::: RESPONSE :::
export class LoginResDto {
    accessToken: string;
    refreshToken: string;

    constructor(partial: Partial<LoginResDto>) {
        Object.assign(this, partial);
    }
};

export class RegisterResDto extends LoginResDto { };

export class RefreshTokenResDto extends LoginResDto { }