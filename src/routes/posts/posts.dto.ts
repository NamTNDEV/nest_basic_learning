import { Type } from "class-transformer";
import { IsString } from "class-validator";
import { PostModel } from "src/shared/models/Post.models";
import { UserModel } from "src/shared/models/user.models";

// :::[Requests]:::
export class CreatePostReqDto {
    @IsString({ message: 'Title must be a string' })
    title: string;

    @IsString({ message: 'Content must be a string' })
    content: string;
}


// :::[Responses]:::
export class GetPostsResDto extends PostModel {
    @Type(() => UserModel)
    author: Omit<UserModel, 'password'>;

    constructor(partial: Partial<PostModel>) {
        super(partial);
        Object.assign(this, partial);
    }

}
