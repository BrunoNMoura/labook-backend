import { PostDatabase } from "../database/PostDatabase";
import { CreatePostInputDTO } from "../dtos/posts/createPost.dto";
import { DeletePostInputDTO } from "../dtos/posts/deletePost.dto";
import { GetPostInputDTO, GetPostOutputDTO } from "../dtos/posts/getPost.dto";
import { UpdatePostInputDTO } from "../dtos/posts/updataPost.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { PostDB, PostUpdateDB } from "../models/Post";
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
  ): Promise<GetPostOutputDTO[]> => {
    const { token } = input;

    const payLoad = this.tokenManager.getPayload(token);

    if (payLoad == undefined) {
      throw new BadRequestError("token inválido");
    }

    const resultDB = await this.postDataBase.getPost();

    const output: GetPostOutputDTO[] = resultDB.map((post) => {
      const postNew = {
        id: post.id,
        content: post.content,
        likes: post.likes,
        dislikes: post.dislikes,
        createdAt: post.created_at,
        updatedAt: post.updated_at,
        creator: {
          id: post.creator_id,
          name: post.creator_name,
        },
      };
      return postNew;
    });
    return output;
  };
  public createPost = async (input: CreatePostInputDTO): Promise<void> => {
    const { content, token } = input;

    const payLoad = this.tokenManager.getPayload(token);

    if (payLoad == undefined) {
      throw new BadRequestError("token inválido");
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
  };
  public editPost = async (
    id: string,
    input: UpdatePostInputDTO
  ): Promise<void> => {
    const { content, token } = input;

    const payLoad = this.tokenManager.getPayload(token);
    if (payLoad == undefined) {
      throw new BadRequestError("token inválido");
    }
    const { id: creatorId } = payLoad;

    const updatePost: PostUpdateDB = {
      id,
      content,
      updated_at: new Date().toISOString(),
    };

    const [resultPost] = await this.postDataBase.getPost();

    if (!resultPost) {
      throw new NotFoundError("'id' não encontrado");
    }

    if (resultPost.creator_id != creatorId) {
      throw new BadRequestError("Recurso negado");
    }
    await this.postDataBase.updatePost(updatePost, creatorId);
  };
  public deletePost = async (input: DeletePostInputDTO): Promise<void> => {
    const { id, token } = input;

    const payLoad = this.tokenManager.getPayload(token);
    if (payLoad == undefined) {
      throw new BadRequestError("token inválido");
    }
    const { id: creatorId, role } = payLoad;

    const [resultPost]: PostDB[] = await this.postDataBase.getPost();

    if (!resultPost) {
      throw new NotFoundError("'id' não encontrado");
    }
    if (resultPost.creator_id != creatorId && role != USER_ROLES.ADMIN) {
      throw new BadRequestError("Recurso negado");
    }
    await this.postDataBase.deletePost(id);
  };
}
