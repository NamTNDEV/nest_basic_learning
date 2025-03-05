import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Auth } from 'src/shared/decorators/auth.decorator';
import { AUTH_TYPE, CONDITION_GUARD_TYPE } from 'src/shared/constants/auth.constant';
import { CreatePostReqDto } from './posts.dto';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';

@Controller('posts')
export class PostsController {
    constructor(private postsService: PostsService) { }

    @Auth([AUTH_TYPE.BEARER, AUTH_TYPE.API_KEY], { conditionGuard: CONDITION_GUARD_TYPE.AND })
    @Get('')
    async getPosts() {
        const posts = await this.postsService.getPosts();
        return {
            message: 'Posts fetched successfully',
            result: { posts }
        };
    }

    @Get(':id')
    async getPost(@Param('id') id: string) {
        const post = await this.postsService.getPostDetails(id);
        return {
            message: 'Post fetched successfully',
            result: { post }
        };
    }

    @Post('')
    @Auth([AUTH_TYPE.BEARER])
    async createPost(@Body() body: CreatePostReqDto, @ActiveUser('userId') userId: number) {
        const createdPost = await this.postsService.createPost({
            ...body,
            userId
        });
        return {
            message: 'Post created successfully',
            result: { createdPost }
        }
    }

    @Put(':id')
    async updatePost(@Param('id') id: string, @Body() body: { title: string, content: string }) {
        const updatedPost = await this.postsService.updatePost({ id, body });
        return {
            message: 'Post updated successfully',
            result: { updatedPost }
        }
    }

    @Delete(':id')
    async deletePost(@Param('id') id: string) {
        const deletedPost = await this.postsService.deletePost(id);
        return {
            message: 'Post deleted successfully',
            result: { deletedPost }
        }
    }
}
