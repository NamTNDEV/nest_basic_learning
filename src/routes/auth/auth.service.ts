import { ConflictException, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { isNotFoundPrismaError, usUniqueConstraintPrismaError } from 'src/shared/helpers';
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
            return tokensPair;
        } catch (error) {
            if (usUniqueConstraintPrismaError(error)) {
                throw new ConflictException('Email already exists');
            }

            throw error;
        }
    }

    async refreshToken(refreshToken: string) {
        try {
            const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken);
            await this.prismaService.refreshToken.findUniqueOrThrow({
                where: {
                    token: refreshToken,
                },
            });
            await this.prismaService.refreshToken.delete({
                where: {
                    token: refreshToken,
                },
            });
            const tokensPair = await this.generateTokensPair({ userId: decodedRefreshToken.userId });
            return tokensPair;
        } catch (error) {
            if (isNotFoundPrismaError(error)) {
                throw new UnauthorizedException('Refresh token has been revoked');
            }

            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    async logout(refreshToken: string) {
        try {
            await this.prismaService.refreshToken.findUniqueOrThrow({
                where: {
                    token: refreshToken,
                },
            });
            await this.prismaService.refreshToken.delete({
                where: {
                    token: refreshToken,
                },
            });
            return 'Logout successfully';
        } catch (error) {
            if (isNotFoundPrismaError(error)) {
                throw new UnauthorizedException('Refresh token has been revoked');
            }

            throw new UnauthorizedException('Invalid refresh token');
        }
    }
}
