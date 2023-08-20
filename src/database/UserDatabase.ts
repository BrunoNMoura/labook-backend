import { UserDB } from "../models/User"
import { BaseDatabase } from "./BaseDatabase"

export class UserDatabase extends BaseDatabase{

  TABLE_NAME = "users"

  public async findUsers(
    q:string|undefined
): Promise<UserDB[]> {
    let userDB

    if(q){
        const result: UserDB[] = await BaseDatabase
        .connection(this.TABLE_NAME)
        .where("name","LIKE",`%${q}%`)
        userDB = result
    }else{
        const result: UserDB[] = await BaseDatabase
        .connection(this.TABLE_NAME)
        userDB = result
    }

    return userDB
}

public async findUserByEmail(
    email:string
){
    const [userDB]:UserDB[] | undefined[] = await BaseDatabase
    .connection(this.TABLE_NAME)
    .where({email})

    return userDB   
}

public async insertUser(
    newUserDB: UserDB
) {
    await BaseDatabase
    .connection(this.TABLE_NAME)
    .insert(newUserDB)
}
}