import { PostDB, PostResultDB, PostUpdateDB } from "../models/Post";
import { BaseDatabase } from "./BaseDatabase";

export class PostDataBase extends BaseDatabase {

  TABLE_NAME = "posts"

  public insertPost = async (newPost: PostDB): Promise<void> => {
    await BaseDatabase.connection(this.TABLE_NAME).insert(newPost)
  }

  public updatePost = async (updatePost: PostUpdateDB, creatorId: string): Promise<void> => {
    await BaseDatabase.connection(this.TABLE_NAME)
      .update(updatePost)
      .where("id", "=", updatePost.id)
      .andWhere("creator_id", "=", creatorId)
  }

  public deletePost = async (postId: string): Promise<void> => {
    await BaseDatabase.connection(this.TABLE_NAME)
      .del().where("id", "=", postId)
  }

  public getPost = async ():Promise<PostResultDB[]> => {

    const output: PostResultDB[] =  await BaseDatabase.connection("posts as p")
      .select("p.id", "p.content", "p.likes", "p.dislikes", "p.created_at",
        "p.updated_at", "p.creator_id", "u.name as creator_name")
      .innerJoin("users as u", "p.creator_id", "u.id")
      return output
  }
}