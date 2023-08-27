import { LikesDislikesDB, POST_LIKE, PostDB, PostDBWithCreatorName } from "../models/Post";
import { BaseDatabase } from "./BaseDatabase";
import { UserDatabase } from "./UserDatabase";

export class PostDatabase extends BaseDatabase {
  public static TABLE_POSTS = "posts"
  public static TABLE_LIKES_DISLIKES = "likes_deslikes"

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
        `${PostDatabase.TABLE_POSTS}.content`,
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
   public findLikeDislike = async (
    likeDislikeDB: LikesDislikesDB
  ): Promise< POST_LIKE | undefined> => {

    const [result]: Array<LikesDislikesDB | undefined> = await BaseDatabase
      .connection(PostDatabase.TABLE_LIKES_DISLIKES)
      .select()
      .where({
        user_id: likeDislikeDB.user_id,
        post_id: likeDislikeDB.post_id
      })

    if (result === undefined) {
      return undefined

    } else if (result.like === 1) {
      return POST_LIKE.ALREADY_LIKED
      
    } else {
      return POST_LIKE.ALREADY_DISLIKED
    }
  }
  public removeLikeDislike = async (
    likeDislikeDB: LikesDislikesDB
  ): Promise<void> => {
    await BaseDatabase
      .connection(PostDatabase.TABLE_LIKES_DISLIKES)
      .delete()
      .where({
        user_id: likeDislikeDB.user_id,
        post_id: likeDislikeDB.post_id
      })
  }
  public updateLikeDislike = async (
    likeDislikeDB: LikesDislikesDB
  ): Promise<void> => {
    await BaseDatabase
      .connection(PostDatabase.TABLE_LIKES_DISLIKES)
      .update(likeDislikeDB)
      .where({
        user_id: likeDislikeDB.user_id,
        post_id: likeDislikeDB.post_id
      })
  }
  public insertLikeDislike = async (
    likeDislikeDB: LikesDislikesDB
  ): Promise<void> => {
    await BaseDatabase
      .connection(PostDatabase.TABLE_LIKES_DISLIKES)
      .insert(likeDislikeDB)
  }
}
