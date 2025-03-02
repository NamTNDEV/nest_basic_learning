import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() body: { email: string, password: string }) {
        const result = await this.authService.login(body);
        return {
            message: 'User logged in successfully',
            data: { result },
        };
    }

    @Post('register')
    async register(@Body() body: { name: string, email: string, password: string, confirmPassword: string }) {
        const result = await this.authService.register(body);
        return {
            message: 'User registered successfully',
            data: { result },
        };
    }
}
