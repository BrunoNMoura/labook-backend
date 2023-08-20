import { PostDatabase } from "../database/PostDatabase"
import { NotFoundError } from "../errors/NotFoundError"
import { PostDB, PostUpdateDB } from "../models/Post"


export class PostBusiness {
  constructor(
    private postDataBase: PostDatabase) { }

  public createPost = async (input: any) : Promise<void>=> {

    const { content, id, creatorId } = input

    
    const newPost: PostDB = {
      id,
      creator_id: creatorId,
      content,
      likes: 0,
      dislikes: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    await this.postDataBase.insertPost(newPost)
  }

  public editPost = async (id: string, input: any)=> {

    const { content } = input

   
    const updatePost: PostUpdateDB = {
      id,
      content,
      updated_at: new Date().toISOString()
    }

    const [resultPost] = await this.postDataBase.getPost()

    if ( !resultPost) {
      throw new NotFoundError("'id' não encontrado")
    }
    
    
    await this.postDataBase.updatePost(updatePost, id)
  }


  public deletePost = async (input:any)=> {
    const { id} = input

      
    const [resultPost]:PostDB[] = await this.postDataBase.getPost()

    if ( !resultPost) {
      throw new NotFoundError("'id' não encontrado")
    }
     
    await this.postDataBase.deletePost(id)
  }

  public getPost = async (input:any) => {

    const { token } = input 
    
    const resultDB = await this.postDataBase.getPost()

    const output= resultDB.map( post => {
      const postNew={
        id: post.id,
        content: post.content,
        likes: post.likes,
        dislikes: post.dislikes,
        createdAt: post.created_at,
        updatedAt: post.updated_at,
        creator: {
          id: post.creator_id,
          name: post.creator_name
        }
      }      
      return postNew
    }) 
     return output
  }  
}