import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginBodyDto, RegisterBodyDto } from './auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() body: LoginBodyDto) {
        const result = await this.authService.login(body);
        return {
            message: 'User logged in successfully',
            data: { result },
        };
    }

    @Post('register')
    async register(@Body() body: RegisterBodyDto) {
        const result = await this.authService.register(body);
        return {
            message: 'User registered successfully',
            data: { result },
        };
    }
}
