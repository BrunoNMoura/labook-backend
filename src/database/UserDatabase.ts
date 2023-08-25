import { UserDB } from "../models/User"
import { BaseDatabase } from "./BaseDatabase"

export class UserDatabase extends BaseDatabase{

    public static TABLE_USERS = "users"

  public async findUsers(
    q:string|undefined
): Promise<UserDB[]> {
    let userDB

    if(q){
        const result: UserDB[] = await BaseDatabase
        .connection(UserDatabase.TABLE_USERS)
        .where("name","LIKE",`%${q}%`)
        userDB = result
    }else{
        const result: UserDB[] = await BaseDatabase
        .connection(UserDatabase.TABLE_USERS)
        userDB = result
    }

    return userDB
}

public async findUserByEmail(
    email:string
){
    const [userDB]:UserDB[] | undefined[] = await BaseDatabase
    .connection(UserDatabase.TABLE_USERS)
    .where({email})

    return userDB   
}

public async insertUser(
    newUserDB: UserDB
) {
    await BaseDatabase
    .connection(UserDatabase.TABLE_USERS)
    .insert(newUserDB)
}
}