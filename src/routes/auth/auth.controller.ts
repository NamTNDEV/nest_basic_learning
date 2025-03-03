import { Body, Controller, HttpCode, HttpStatus, Post, SerializeOptions, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginReqDto, LoginResDto, LogoutResDto, RefreshTokenReqDto, RefreshTokenResDto, RegisterReqDto, RegisterResDto } from './auth.dto';
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard';
import { ApiKeyGuard } from 'src/shared/guards/api-key.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
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
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async refreshToken(@Body() body: RefreshTokenReqDto) {
        const result = await this.authService.refreshToken(body.refreshToken);
        return new RefreshTokenResDto(result);
    }

    @Post('logout')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async logout(@Body() body: { refreshToken: string }) {
        const message = await this.authService.logout(body.refreshToken);
        return new LogoutResDto({ message });
    }
}
