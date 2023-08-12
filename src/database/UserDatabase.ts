import { UserDB } from "../models/User"
import { BaseDatabase } from "./BaseDatabase"

export class UserDataBase extends BaseDatabase{

  TABLE_NAME = "users"

  public insertUser = async (newUser:UserDB):Promise<void>=>{

    await BaseDatabase.connection(this.TABLE_NAME).insert(newUser)

  }

  public findUser = async (email:string):Promise<UserDB> =>{
    const [result]:UserDB[] = await BaseDatabase.connection("users").where({email})
    return result
  } 

  public getUser = async (q:string):Promise<UserDB[]> =>{
    let resultDB: UserDB[]
    if(q){
      resultDB = await this.findByName(q)
    } else {
      resultDB = await this.findAll()
    }
        
    return resultDB
  } 
}