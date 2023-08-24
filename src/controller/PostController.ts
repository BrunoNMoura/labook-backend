import { Request, Response } from "express";
import { PostBusiness } from "../business/PostBusiness";
import { CreatePostSchema } from "../dtos/posts/createPost.dto";
import { UpdatePostSchema } from "../dtos/posts/updataPost.dto";
import { DeletePostSchema } from "../dtos/posts/deletePost.dto";
import { GetPostShema } from "../dtos/posts/getPost.dto";

export class PostController {
  constructor(private postBusiness: PostBusiness) {}

  public getPost = async (req: Request, res: Response) => {
    try {
      const input = GetPostShema.parse({
        q: req.query.q,
        token: req.headers.authorization,
      });

      const output = await this.postBusiness.getPost(input);
      res.status(200).send(output);
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
  };
  public createPost = async (req: Request, res: Response) => {
    try {
      const input = CreatePostSchema.parse({
        content: req.body.content,
        token: req.headers.authorization,
      });

      await this.postBusiness.createPost(input);

      res.sendStatus(201);
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
  };
  public editPost = async (req: Request, res: Response) => {
    try {
      const id: string = req.params.id;

      const input = UpdatePostSchema.parse({
        content: req.body.content,
        token: req.headers.authorization,
      });

      await this.postBusiness.editPost(id, input);

      res.sendStatus(200);
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
  };
  public deletePost = async (req: Request, res: Response) => {
    try {
      const input = DeletePostSchema.parse({
        id: req.params.id,
        token: req.headers.authorization as string,
      });

      await this.postBusiness.deletePost(input);

      res.sendStatus(200);
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
  };
}
