import { Injectable } from '@nestjs/common';

const mockPosts: { id: string, title: string, content: string }[] = []

@Injectable()
export class PostsService {
    getPosts() {
        return mockPosts;
    }

    getPostDetails(id: string) {
        const post = mockPosts.find(post => post.id === id);
        if (post) {
            return post;
        }
        return null;
    }

    createPost(payload: { id: string, title: string, content: string }) {
        const isPostExists = mockPosts.some(post => post.id === payload.id);
        if (isPostExists) {
            return null;
        }
        mockPosts.push(payload);
        return {
            id: payload.id,
            title: payload.title,
            content: payload.content
        };
    }

    updatePost(payload: { id: string, body: { title: string, content: string } }) {
        const updatedPost = mockPosts.find(post => post.id === payload.id);
        if (!updatedPost) {
            return null;
        }
        updatedPost.title = payload.body.title;
        updatedPost.content = payload.body.content;
        return updatedPost;
    }

    deletePost(id: string) {
        const deletedPost = mockPosts.find(post => post.id === id);
        if (!deletedPost) {
            return null;
        }
        mockPosts.splice(mockPosts.indexOf(deletedPost), 1);
        return deletedPost;
    }
}
