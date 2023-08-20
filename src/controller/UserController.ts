
import { Request, Response } from "express"
import { UserBusiness } from "../business/UserBusiness"
export class UserController {

  constructor(private userBusiness: UserBusiness) { }

  public getUsers = async (req: Request, res: Response): Promise<void> => {
    try {

      const input = {
        q: req.query.q,
        token: req.headers.authorization
      }

      const output = await this.userBusiness.getUsers(input)

      res.status(200).send(output)

    } catch (error) {
        if (res.statusCode === 200) {
            res.status(500);
          }
          if (error instanceof Error) {
            res.send(error.message);
          } else {
            res.status(500).send("Unknown error");
          }
    }
  }

  public singUp = async (req: Request, res: Response): Promise<void> => {

    try {
      const input ={
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      }

      const output = await this.userBusiness.singUp(input);

      res.status(201).send(output)

    } catch (error) {
        if (res.statusCode === 200) {
            res.status(500);
          }
          if (error instanceof Error) {
            res.send(error.message);
          } else {
            res.status(500).send("Unknown error");
          }
    }
  }  
}
