import { UserDB } from "../models/User"
import { BaseDatabase } from "./BaseDatabase"

export class UserDatabase extends BaseDatabase{

    public static TABLE_USERS = "users"


public async findUserByEmail(
    email:string
): Promise<UserDB | undefined>{
    const [userDB]:UserDB[] | undefined[] = await BaseDatabase
    .connection(UserDatabase.TABLE_USERS)
    .where({email})

    return userDB   
}
public async findById(id: string): Promise<any> {
    return await BaseDatabase.connection(UserDatabase.TABLE_USERS).where({ id })
}
public async insertUser(
    newUserDB: UserDB
): Promise<void> {
    await BaseDatabase
    .connection(UserDatabase.TABLE_USERS)
    .insert(newUserDB)
}
public getUser = async (q:string):Promise<UserDB[]> =>{
    let resultDB: UserDB[]
    if(q){
      resultDB = await BaseDatabase
      .connection(UserDatabase.TABLE_USERS).where("name", "like", `%${q}%`)
    } else {
      resultDB = await BaseDatabase
      .connection(UserDatabase.TABLE_USERS)
    }
        
    return resultDB
  } 
}