import { IsString } from "class-validator";

export class LoginBodyDto {
    @IsString({ message: 'Email must be a string' })
    email: string;

    @IsString({ message: 'Password must be a string' })
    password: string;
};

export class RegisterBodyDto extends LoginBodyDto {
    @IsString({ message: 'Name must be a string' })
    name: string;

    @IsString({ message: 'Confirm password must be a string' })
    confirmPassword: string;
};