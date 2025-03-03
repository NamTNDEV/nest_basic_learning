import { Body, Controller, HttpCode, HttpStatus, Post, SerializeOptions } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginReqDto, LoginResDto, RefreshTokenResDto, RegisterReqDto, RegisterResDto } from './auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() body: LoginReqDto) {
        const result = await this.authService.login(body);
        return new LoginResDto(result);
    }

    // @SerializeOptions({ type: RegisterResDto })
    @Post('register')
    async register(@Body() body: RegisterReqDto) {
        const result = await this.authService.register(body);
        return new RegisterResDto(result);
    }

    @Post('refresh-token')
    @HttpCode(HttpStatus.OK)
    async refreshToken(@Body() body: { refreshToken: string }) {
        const result = await this.authService.refreshToken(body.refreshToken);
        return new RefreshTokenResDto(result);
    }
}
