import { PostDatabase } from "../database/PostDatabase"
import { PostDB, PostUpdateDB } from "../models/Post"
import { USER_ROLES } from "../models/User"


export class PostBusiness {
  constructor(
    private postDataBase: PostDatabase) { }

  public createPost = async (input: any): Promise<void> => {

    const { content, id,creatorId } = input   

    // aqui cria o objeto com os dados do novo post
    const newPost: PostDB = {
      id,
      creator_id: creatorId,
      content,
      likes: 0,
      dislikes: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    // enviando para ser salvo no banco de dados
    await this.postDataBase.insertPost(newPost)
  }

  public editPost = async (id: string, input: any): Promise<void> => {

    const { content } = input
   
    
    const updatePost: PostUpdateDB = {
      id,
      content,
      updated_at: new Date().toISOString()
    }

    const [resultPost] = await this.postDataBase.findPost(id)

    if ( !resultPost) {
      throw new Error("'id' não encontrado")
    }
    
    //checar se o usuário pode editar o post 
    if (resultPost.creator_id != creatorId) {
      throw new Error("Recurso negado")
    }
    await this.postDataBase.updatePost(updatePost, creatorId)
  }


  //============= DELETE POST
  public deletePost = async (input:any): Promise<void> => {
    const { id } = input
    
    // pagar o id do usuário
    const { id: creatorId, role } = payLoad

     // pesquisa o post 
    const [resultPost]:PostDB[] = await this.postDataBase.findPost(id)

    if ( !resultPost) {
      throw new Error("'id' não encontrado")
    }
     //checar se o usuário pode deletar o post 
    if (resultPost.creator_id != creatorId && role != USER_ROLES.ADMIN) {
      throw new Error("Recurso negado")
    }
    await this.postDataBase.deletePost(id)
  }

  //============ GET POSTS
  public getPost = async (input:any):Promise<{
    id: string;
    content: string;
    likes: number;
    dislikes: number;
    createdAt: string;
    updatedAt: string;
    creator: {
        id: string;
        name: string;
    };
}[]>=> {

    const { token } = input 
    // validar o token
    const payLoad = this.tokenManager.getPayload(token)
    if (payLoad == undefined) {
      throw new Error("token inválido")
    }

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