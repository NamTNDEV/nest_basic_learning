import { Body, Controller, Post, SerializeOptions } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginReqDto, RegisterReqDto, RegisterResDto } from './auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() body: LoginReqDto) {
        const result = await this.authService.login(body);
        return {
            message: 'User logged in successfully',
            data: { result },
        };
    }

    @SerializeOptions({ type: RegisterResDto })
    @Post('register')
    async register(@Body() body: RegisterReqDto) {
        const result = await this.authService.register(body);
        return result;
    }
}
