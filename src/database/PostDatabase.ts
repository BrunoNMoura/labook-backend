import { LikesDislikesDB, POST_LIKE, PostDB, PostDBWithCreatorName } from "../models/Post";
import { BaseDatabase } from "./BaseDatabase";
import { UserDatabase } from "./UserDatabase";

export class PostDatabase extends BaseDatabase {
  public static TABLE_POSTS = "posts"
  public static TABLE_LIKES_DISLIKES = "likes_dislikes"

   public getPost = async (): Promise<PostDBWithCreatorName[]> => {
    const output: PostDBWithCreatorName[] = await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
      .select(
        `${PostDatabase.TABLE_POSTS}.id`,
        `${PostDatabase.TABLE_POSTS}.content`,
        `${PostDatabase.TABLE_POSTS}.likes`,
        `${PostDatabase.TABLE_POSTS}.dislikes`,
        `${PostDatabase.TABLE_POSTS}.created_at`,
        `${PostDatabase.TABLE_POSTS}.updated_at`,
        `${PostDatabase.TABLE_POSTS}.creator_id`,
        `${UserDatabase.TABLE_USERS}.name as creator_name`       
      )
      .innerJoin( `${UserDatabase.TABLE_USERS}`,
      `${PostDatabase.TABLE_POSTS}.creator_id`, 
      "=",
      `${UserDatabase.TABLE_USERS}.id`);
    return output;
  };
  public findPostById = async (
    id:string
  ) => {
    const [result] = await BaseDatabase
    .connection(PostDatabase.TABLE_POSTS)
    .select()
    .where({id})

    return result as PostDB | undefined
  }
  public insertPost = async (newPost: PostDB): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_POSTS).insert(newPost);
  };
  public updatePost = async (
    updatePost: PostDB,
  ): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
      .update(updatePost)
      .where({id: updatePost.id})
  };
  public deletePost = async (id: string): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
      .del()
      .where({id});
  };
  public findPostWithCreatorNameById =
    async (id: string): Promise<PostDBWithCreatorName | undefined> => {

    const [result] = await BaseDatabase
      .connection(PostDatabase.TABLE_POSTS)
      .select(
        `${PostDatabase.TABLE_POSTS}.id`,
        `${PostDatabase.TABLE_POSTS}.creator_id`,
        `${PostDatabase.TABLE_POSTS}.name`,
        `${PostDatabase.TABLE_POSTS}.likes`,
        `${PostDatabase.TABLE_POSTS}.dislikes`,
        `${PostDatabase.TABLE_POSTS}.created_at`,
        `${PostDatabase.TABLE_POSTS}.updated_at`,
        `${UserDatabase.TABLE_USERS}.name as creator_name`
      )
      .join(
        `${UserDatabase.TABLE_USERS}`,
        `${PostDatabase.TABLE_POSTS}.creator_id`, 
        "=",
        `${UserDatabase.TABLE_USERS}.id`
      )
      .where({ [`${PostDatabase.TABLE_POSTS}.id`]: id })
    
    return result as PostDBWithCreatorName | undefined
  }
}
