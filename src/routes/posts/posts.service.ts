import { Injectable } from '@nestjs/common';
import configEnv from 'src/shared/config';
import { PrismaService } from 'src/shared/services/prisma.service';


@Injectable()
export class PostsService {
    constructor(private readonly prismaService: PrismaService) { }

    async getPosts() {
        const posts = await this.prismaService.post.findMany();
        return posts;
    }

    async getPostDetails(id: string) {
        const post = await this.prismaService.post.findUnique({
            where: { id: parseInt(id) }
        });
        return post;
    }

    async createPost(payload: { title: string, content: string }) {
        const userId = 1;
        const post = await this.prismaService.post.create({
            data: {
                title: payload.title,
                content: payload.content,
                authorId: userId
            }
        });
        return post;
    }

    async updatePost(payload: { id: string, body: { title: string, content: string } }) {
        const updatedPost = await this.prismaService.post.update({
            where: { id: parseInt(payload.id) },
            data: {
                title: payload.body.title,
                content: payload.body.content
            }
        });
        return updatedPost;
    }

    async deletePost(id: string) {
        const deletedPost = await this.prismaService.post.delete({
            where: { id: parseInt(id) }
        });
        return deletedPost;
    }
}
