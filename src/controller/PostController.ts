
import { Request, Response } from "express"

export class PostController {
  constructor(private postBusiness: PostBusiness,
    private likeDislikeBusiness: LikeDislikeBusiness) { }

  public createPost = async (req: Request, res: Response) => {

    try {

      const input = {
        content: req.body.content,
        token: req.headers.authorization
      }

      await this.postBusiness.createPost(input)

      res.sendStatus(201)

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

  public editPost = async (req: Request, res: Response) => {
    try {

      const id: string = req.params.id

      const input = {
        content: req.body.content,
        token: req.headers.authorization
      }

      await this.postBusiness.editPost(id, input)

      res.sendStatus(200)

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

  public deletePost = async (req: Request, res: Response) => {
    try {
      const input = 
        {
          id: req.params.id,
          token: req.headers.authorization as string
        }

      await this.postBusiness.deletePost(input)

      res.sendStatus(200)

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

  public getPost = async (req: Request, res: Response) => {
    try {

      const input = {
        token: req.headers.authorization
      }

      const output = await this.postBusiness.getPost(input)
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

  public likeDislike = async (req: Request, res: Response) => {

    try {
      const input ={
        id: req.params.id,
        like: req.body.like,
        token: req.headers.authorization as string
      }

      await this.likeDislikeBusiness.likeDislike(input)

      res.sendStatus(200)

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
