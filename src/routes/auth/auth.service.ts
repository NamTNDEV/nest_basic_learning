import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { HashService } from 'src/shared/services/hash.service';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly hashService: HashService,
    ) { }

    async login(payload: { email: string, password: string }) {
        return payload;
    }

    async register(payload: { name: string, email: string, password: string, confirmPassword: string }) {
        const hashedPassword = this.hashService.hash(payload.password);
        try {
            const createUser = await this.prismaService.user.create({
                data: {
                    name: payload.name,
                    email: payload.email,
                    password: hashedPassword,
                },
            });
            return createUser;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ConflictException('Email already exists');
            }

            throw error;
        }
    }
}
