import { UserDatabase } from "../database/UserDatabase"
import { BadRequestError } from "../errors/BadRequestError";
import { User, UserDB } from "../models/User";
import { USER_ROLES} from "../models/User";

export class UserBusiness{
    constructor(
        private userDatabase:  UserDatabase
    ){}

    public getUsers = async (input: any) => {

        const { q, token } = input   
        
    
        const resultDB: UserDB[] = await this.userDatabase.findUsers(q)
    
        const output = resultDB.map((user) => {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.created_at
          }
        })
        return output    
    
    };

    public singUp = async (input: any)=> {

        const { id,name, email, password } = input    
       
        const newUserDB: UserDB = {
          id,
          name,
          email,
          password,
          role: USER_ROLES.NORMAL,
          created_at: new Date().toISOString()
        }
        // verifica se o email já está em uso
        const userExist = await this.userDatabase.findUserByEmail(email)
        if (userExist != undefined) {
          throw new BadRequestError("'email' já cadastrado")
        }
    
        const output= await this.userDatabase.insertUser(newUserDB)   
            
    
        return (output)
    
      }
    
      public login = async (input: any) => {
    
        const { email, password} = input

        const userDB = await this.userDatabase.findUserByEmail(email)

        if(!userDB) {
            throw new BadRequestError("'email' não encontrado!")
        }
        if(password !== userDB.password) {
            throw new BadRequestError ("'email'ou 'password' incorretos")
        }         
    
      }

}

  

