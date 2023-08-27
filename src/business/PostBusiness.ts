import { PostDatabase } from "../database/PostDatabase";
import { CreatePostInputDTO } from "../dtos/posts/createPost.dto";
import {
  DeletePostInputDTO,
  DeletePostOutputDTO,
} from "../dtos/posts/deletePost.dto";
import { GetPostInputDTO, GetPostOutputDTO } from "../dtos/posts/getPost.dto";
import { LikeOrDislikeInputDTO, LikeOrDislikeOutputDTO } from "../dtos/posts/likeOrDislike.dto";
import {
  UpdatePostInputDTO,
  UpdatePostOutputDTO,
} from "../dtos/posts/updataPost.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { ForbiddenError } from "../errors/ForbiddenError";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { LikesDislikesDB, POST_LIKE, Post, PostDB } from "../models/Post";
import { USER_ROLES } from "../models/User";
import { IdGenerator } from "../services/idGenerator";
import { TokenManager } from "../services/tokenManager";

export class PostBusiness {
  constructor(
    private postDataBase: PostDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager
  ) {}

  public getPost = async (
    input: GetPostInputDTO
  ): Promise<GetPostOutputDTO> => {
    const { token } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const resultDB = await this.postDataBase.getPost();

    const posts = resultDB.map((post) => {
      const postNew = new Post(
        post.id,
        post.content,
        post.likes,
        post.dislikes,
        post.created_at,
        post.updated_at,
        post.creator_id,
        post.creator_name
      );
      return postNew.toBusinessModel();
    });
    const output: GetPostOutputDTO = posts;

    return output;
  };
  public createPost = async (input: CreatePostInputDTO):Promise<{
    message: string;
}> => {
    const { content, token } = input;

    const payLoad = this.tokenManager.getPayload(token);

    if (payLoad == undefined) {
      throw new BadRequestError("invalid token");
    }

    const { id: creatorId } = payLoad;

    const id = this.idGenerator.generate();

    const newPost: PostDB = {
      id,
      creator_id: creatorId,
      content,
      likes: 0,
      dislikes: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
     await this.postDataBase.insertPost(newPost);
    const output = {
      message:"post created successfully!"
    }
    return output
  };
  public editPost = async (
    input: UpdatePostInputDTO
  ): Promise<UpdatePostOutputDTO> => {
    const { content, token, idToEdit } = input;

    const payLoad = this.tokenManager.getPayload(token);
    if (!payLoad) {
      throw new UnauthorizedError();
    }
    const postDB = await this.postDataBase.findPostById(idToEdit);

    if (!postDB) {
      throw new NotFoundError("post with that id does not exist");
    }

    if (payLoad.id !== postDB.creator_id) {
      throw new ForbiddenError("only the person who created the post can edit it");
    }
    const post = new Post(
      postDB.id,
      postDB.content,
      postDB.likes,
      postDB.dislikes,
      postDB.created_at,
      postDB.updated_at,
      postDB.creator_id,
      payLoad.name
    );

    post.setContent(content);

    const updatedPosttDB = post.toDBModel();
    await this.postDataBase.updatePost(updatedPosttDB);

    const output: UpdatePostOutputDTO = {
      message:"post changed successfully!"
    };

    return output;
  };
  public deletePost = async (
    input: DeletePostInputDTO
  ): Promise<DeletePostOutputDTO> => {
    const { idToDelete, token } = input;

    const payLoad = this.tokenManager.getPayload(token);
    if (!payLoad) {
      throw new UnauthorizedError();
    }
    const postDB = await this.postDataBase.findPostById(idToDelete);

    if (!postDB) {
      throw new NotFoundError("post with this id does not exist");
    }

    if (payLoad.role !== USER_ROLES.ADMIN) {
      if (payLoad.id !== postDB.creator_id) {
        throw new ForbiddenError("only the person who created the post can delete it");
      }
    }

    await this.postDataBase.deletePost(idToDelete);

    const output: DeletePostOutputDTO = {
      message:"Post successfully deleted!"
    };

    return output;
  };
  public likeOrDislikePost = async (
    input: LikeOrDislikeInputDTO
  ): Promise<LikeOrDislikeOutputDTO> => {
    const { token, like, postId } = input

    const payload = this.tokenManager.getPayload(token)

    if (!payload) {
      throw new UnauthorizedError()
    }

    const postDBWithCreatorName =
      await this.postDataBase.findPostWithCreatorNameById(postId)

    if (!postDBWithCreatorName) {
      throw new NotFoundError("Post with this id does not exist")
    }

    const post = new Post(
      postDBWithCreatorName.id,
      postDBWithCreatorName.content,
      postDBWithCreatorName.likes,
      postDBWithCreatorName.dislikes,
      postDBWithCreatorName.created_at,
      postDBWithCreatorName.updated_at,
      postDBWithCreatorName.creator_id,
      postDBWithCreatorName.creator_name
    )

    const likeSQlite = like ? 1 : 0

    const likeDislikeDB: LikesDislikesDB = {
      user_id: payload.id,
      post_id: postId,
      like: likeSQlite
    }

    const likeDislikeExists =
      await this.postDataBase.findLikeDislike(likeDislikeDB)

    if (likeDislikeExists === POST_LIKE.ALREADY_LIKED) {
      if (like) {
        await this.postDataBase.removeLikeDislike(likeDislikeDB)
        post.removeLike()
      } else {
        await this.postDataBase.updateLikeDislike(likeDislikeDB)
        post.removeLike()
        post.addDislike()
      }

    } else if (likeDislikeExists === POST_LIKE.ALREADY_DISLIKED) {
      if (like === false) {
        await this.postDataBase.removeLikeDislike(likeDislikeDB)
        post.removeDislike()
      } else {
        await this.postDataBase.updateLikeDislike(likeDislikeDB)
        post.removeDislike()
        post.addLike()
      }

    } else {
      await this.postDataBase.insertLikeDislike(likeDislikeDB)
      like ? post.addLike() : post.addDislike()
    }

    const updatedPostDB = post.toDBModel()
    await this.postDataBase.updatePost(updatedPostDB)

    const output: LikeOrDislikeOutputDTO = {
      message:"like or dislike successfully updated!"
    }

    return output
  }
}
