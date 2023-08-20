import { UserDatabase } from "../database/UserDatabase";
import { GetUsersInputDTO, GetUsersOutputDTO } from "../dtos/users/getUser.dto";
import { LoginInputDTO, LoginOutputDTO } from "../dtos/users/login.dto";
import { SignupInputDTO, SignupOutputDTO } from "../dtos/users/signup.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { User, UserDB } from "../models/User";
import { USER_ROLES } from "../models/User";
import { IdGenerator } from "../services/idGenerator";
import { TokenManager, TokenPayload } from "../services/tokenManager";

export class UserBusiness {
  constructor(
    private userDatabase: UserDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager
  ) {}

  public getUsers = async (
    input: GetUsersInputDTO
  ): Promise<GetUsersOutputDTO> => {
    const { q } = input;

    const usersDB = await this.userDatabase.findUsers(q);

    const users = usersDB.map((userDB) => {
      const user = new User(
        userDB.id,
        userDB.name,
        userDB.email,
        userDB.password,
        userDB.role,
        userDB.created_at
      );

      return user.toBusinessModel();
    });

    const output: GetUsersOutputDTO = users;

    return output;
  };

  public singUp = async (input: SignupInputDTO): Promise<SignupOutputDTO> => {
    const { name, email, password } = input;

    const id = this.idGenerator.generate();

    const userDBExists = await this.userDatabase.findUserByEmail(email);

    if (userDBExists) {
      throw new BadRequestError("'email'já existe");
    }

    const newUser = new User(
      id,
      name,
      email,
      password,
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
      message: "Cadastro realizado com sucesso!",
      token,
    };

    return output;
  };

  public login = async ( input:LoginInputDTO
    ):Promise<LoginOutputDTO> => {
    const { email, password } = input;

    const userDB = await this.userDatabase.findUserByEmail(email);

    if (!userDB) {
      throw new BadRequestError("'email' não encontrado!");
    }
    if (password !== userDB.password) {
      throw new BadRequestError("'email'ou 'password' incorretos");
    }
    const payload: TokenPayload = {
        id:userDB.id,
        name:userDB.name,
        role: userDB.role
    }

    const token = this.tokenManager.createToken(payload)

    const output: LoginOutputDTO = {
        message: "Login realizado com sucesso!",
        token
    }
    return output
  };
}
