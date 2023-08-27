import { UserDatabase } from "../database/UserDatabase";
import { GetUsersInputDTO, GetUsersOutputDTO } from "../dtos/users/getUsers.dto";
import { LoginInputDTO, LoginOutputDTO } from "../dtos/users/login.dto";
import { SignupInputDTO, SignupOutputDTO } from "../dtos/users/signup.dto";
import { PasswordInputDTO } from "../dtos/users/transformPassword.dto";
import { BadRequestError } from "../errors/BadRequestError";
import {  User, USER_ROLES, UserDB } from "../models/User";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/idGenerator";
import { TokenManager, TokenPayload } from "../services/tokenManager";

export class UserBusiness {
  constructor(
    private userDatabase: UserDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager,
    private hashManager: HashManager
  ) {}

  public getUsers = async (input: GetUsersInputDTO): Promise<GetUsersOutputDTO[]> => {

    const { q, token } = input

    const payload = this.tokenManager.getPayload(token)

    if (payload === null) {
      throw new BadRequestError("token inválido")
    }

    if (payload.role != USER_ROLES.ADMIN) {
      throw new BadRequestError("somente admins podem acessar esse recurso")
    }

    const resultDB: UserDB[] = await this.userDatabase.getUser(q)

    const output: GetUsersOutputDTO[] = resultDB.map((user) => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.created_at
      }
    })
    return output

  }
  
  public singUp = async (input: SignupInputDTO): Promise<SignupOutputDTO> => {
    const { name, email, password } = input;

    const id = this.idGenerator.generate();

    const hashedPassword = await this.hashManager.hash(password)

    const userDBExists = await this.userDatabase.findUserByEmail(email);

    if (userDBExists !== undefined) {
      throw new BadRequestError("'email' já cadastrado")
    }

    const newUser = new User(
      id,
      name,
      email,
      hashedPassword,
      USER_ROLES.NORMAL,
      new Date().toISOString()
    );

    const newUserDB = newUser.toDBModel();
    await this.userDatabase.insertUser(newUserDB);

    const payload: TokenPayload = {
      id: newUser.getId(),
      name: newUser.getName(),
      role: newUser.getRole(),
    };

    const token = this.tokenManager.createToken(payload);

    const output: SignupOutputDTO = {
      message:"Cadastro realizado com sucesso",
      token,
    };

    return output;
  };

  public login = async (
    input: LoginInputDTO
  ): Promise<LoginOutputDTO> => {
    const { email, password } = input

    const userDB = await this.userDatabase.findUserByEmail(email)

    if (!userDB) {
      throw new BadRequestError("e-mail e/ou senha inválido(s)")
    }

    const user = new User(
      userDB.id,
      userDB.name,
      userDB.email,
      userDB.password,
      userDB.role,
      userDB.created_at
    )

    const hashedPassword = user.getPassword()

    const isPasswordCorrect = await this.hashManager
      .compare(password, hashedPassword)

    if (!isPasswordCorrect) {
      throw new BadRequestError("e-mail e/ou senha inválido(s)")
    }

    const payload: TokenPayload = {
      id: user.getId(),
      name: user.getName(),
      role: user.getRole()
    }

    const token = this.tokenManager.createToken(payload)

    const output: LoginOutputDTO = {
      message:"login realizado com sucesso!",
      token
    }

    return output
  }  

  public passwordHash = async(
    input:PasswordInputDTO
):Promise<void>=>{

    const {email, password} = input

    const userDB = await this.userDatabase.findUserByEmail(email) 

    if(!userDB) {
        throw new BadRequestError("'email' não encontrado!")
    }
   
    if(userDB.password !== password){
        throw new BadRequestError ("'senha' inválida")
    }

    const hasPassword = await this.hashManager.hash(password)

    const newUser = new User(
        userDB.id,
        userDB.name,
        userDB.email,
        hasPassword,
        userDB.role,
        userDB.created_at
    )

    const newUserDB = newUser.toDBModel()
    await this.userDatabase.updatePassowrd(newUserDB)    
    
}
}
