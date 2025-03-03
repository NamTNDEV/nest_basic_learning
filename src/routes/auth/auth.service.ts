import { ConflictException, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { HashService } from 'src/shared/services/hash.service';
import { PrismaService } from 'src/shared/services/prisma.service';
import { TokenService } from 'src/shared/services/token.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly hashService: HashService,
        private readonly tokenService: TokenService,
    ) { }

    async generateTokensPair(payload: { userId: number }) {
        const [accessToken, refreshToken] = await Promise.all([
            this.tokenService.signAccessToken(payload),
            this.tokenService.signRefreshToken(payload),
        ])
        const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken);
        await this.prismaService.refreshToken.create({
            data: {
                token: refreshToken,
                userId: payload.userId,
                expiresAt: new Date(decodedRefreshToken.exp * 1000),
            },
        });
        return {
            accessToken,
            refreshToken
        };
    }

    async login(payload: { email: string, password: string }) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: payload.email,
            },
        });
        if (!user) {
            throw new UnauthorizedException('Email not found');
        }

        const isPasswordValid = this.hashService.compare(payload.password, user.password);
        if (!isPasswordValid) {
            throw new UnprocessableEntityException([
                {
                    field: 'password',
                    error: 'Password is incorrect',
                },
            ]);
        }

        const tokensPair = await this.generateTokensPair({ userId: user.id })
        return tokensPair;
    }

    async register(payload: { name: string, email: string, password: string, confirmPassword: string }) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: payload.email
            }
        })
        if (user) {
            throw new UnprocessableEntityException([
                {
                    field: 'email',
                    error: 'Email is existed',
                }
            ])
        }
        const hashedPassword = this.hashService.hash(payload.password);
        try {
            const createUser = await this.prismaService.user.create({
                data: {
                    name: payload.name,
                    email: payload.email,
                    password: hashedPassword,
                },
            });
            const tokensPair = await this.generateTokensPair({ userId: createUser.id });
            return createUser;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ConflictException('Email already exists');
            }

            throw error;
        }
    }
}
