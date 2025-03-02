import { Exclude } from "class-transformer";
import { IsString } from "class-validator";

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

export class LoginResDto { };

export class RegisterResDto {
    id: number;
    email: string;
    name: string;
    @Exclude()
    password: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(partial: Partial<RegisterResDto>) {
        Object.assign(this, partial);
    }
};