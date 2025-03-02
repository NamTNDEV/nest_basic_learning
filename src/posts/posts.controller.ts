import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
    constructor(private postsService: PostsService) { }

    @Get('')
    getPosts() {
        const posts = this.postsService.getPosts();
        if (posts.length === 0) {
            return {
                message: 'No posts found',
                result: {
                    posts: []
                }
            };
        }
        return {
            message: 'Posts fetched successfully',
            result: { posts }
        };
    }

    @Get(':id')
    getPost(@Param('id') id: string) {
        const post = this.postsService.getPostDetails(id);
        if (post) {
            return {
                message: 'Post fetched successfully',
                result: { post }
            };
        }
        return {
            message: 'Post not found',
            result: null
        };
    }

    @Post('')
    createPost(@Body() body: { id: string, title: string, content: string }) {
        const createdPost = this.postsService.createPost(body);
        if (!createdPost) {
            return {
                message: 'Post already exists',
                result: null
            }
        }
        return {
            message: 'Post created successfully',
            result: { createdPost }
        }
    }

    @Put(':id')
    updatePost(@Param('id') id: string, @Body() body: { title: string, content: string }) {
        const updatedPost = this.postsService.updatePost({ id, body });
        if (!updatedPost) {
            return {
                message: 'Post not found',
                result: null
            }
        }
        return {
            message: 'Post updated successfully',
            result: { updatedPost }
        }
    }

    @Delete(':id')
    deletePost(@Param('id') id: string) {
        const deletedPost = this.postsService.deletePost(id);
        if (!deletedPost) {
            return {
                message: 'Post not found',
                result: null
            }
        }
        return {
            message: 'Post deleted successfully',
            result: { deletedPost }
        }
    }
}
