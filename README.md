# labook-backend
![Labook](./assets/Showing.png)
Construction of API for creating new users or logging in those already registered, in addition to creating, editing, deleting posts and giving like or dislike to posts (created by other users).
<br><br>
For posts, the API allows (for users with valid token) to add new posts and get all posts.
<br><br>
Edit and delete the post by its ID (with the creator's token only).
For users, the API allows adding a new user, getting all users, or searching for one by name (with Admin token only).
<br><br>
Edit a user's information and delete a user by their ID (with the creator's token only).

## Índice
- <a href="#-Layout">Layout</a>
- <a href="#-Requests">Requests (Paths)</a>
- <a href="#-Example-of-Requests">Example of Requests</a>
- <a href="#-How-to-run-this-project">How to run this project</a>
- <a href="#-Technologies-used">Technologies used</a>
- <a href="#-Demonstration">Demonstration</a>
- <a href="#-Documentation">Documentation</a>
- <a href="#-Developer">Developer</a>
- <a href="#-Next steps">Next steps</a>

## 📸Layout
- Folder structure

![folder-structure](./assets/Layout-Vscode.png)

### Users Requests
- /users
### User Requests Signup
- /users/signup
### User Requests Login
- /users/login
### Posts Requests
- /posts
### Posts by id
- /posts/:id
### Posts like or deslike
- /posts/:id/like

## Example of Requests

### GET/users
- returns all users
```
[
    {
        "id": "u001",
        "name": "Bruno",
        "email": "bruno@email.com",
        "role": "ADMIN",
        "createdAt": "2023-08-04 21:54:18"
    },
    {
        "id": "u002",
        "name": "Danielle",
        "email": "danielle@email.com",
        "role": "NORMAL",
        "createdAt": "2023-08-04 21:54:18"
    },
    {
        "id": "u003",
        "name": "Heitor",
        "email": "heitor@email.com",
        "role": "NORMAL",
        "createdAt": "2023-08-04 21:54:18"
    },
    {
        "id": "u004",
        "name": "Arthur",
        "email": "arthur@email.com",
        "role": "NORMAL",
        "createdAt": "2023-08-04 21:54:18"
    },
    {
        "id": "4e86a10a-f18d-4821-ae72-e3dfb7862287",
        "name": "fulano",
        "email": "fulano@email.com",
        "role": "NORMAL",
        "createdAt": "2023-08-27T13:16:20.114Z"
    }
]
```
### POST/Signup

- body:
```
{
    "name":"beltrano",
    "email":"beltrano@email.com",
    "password":"beltrano123"
}
```
- return:
```
{
    "message": "Registration done successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFiODk2ZDhmLWY2Y2MtNGE5ZC1hYWVkLTI4OTc2NDBjMWMwYyIsIm5hbWUiOiJiZWx0cmFubyIsInJvbGUiOiJOT1JNQUwiLCJpYXQiOjE2OTMxNjc1MjYsImV4cCI6MTY5Mzc3MjMyNn0.nzmrlTOY0HfDBtx4R7jt4L0dpiWI07ztVvXkFHPrFFg"
}
```
### POST/Login

- body:
```
{
    "email":"fulano@email.com",
    "password":"fulano123"
}
```
- return:
```
{
    "message": "Login successful!",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRlODZhMTBhLWYxOGQtNDgyMS1hZTcyLWUzZGZiNzg2MjI4NyIsIm5hbWUiOiJmdWxhbm8iLCJyb2xlIjoiTk9STUFMIiwiaWF0IjoxNjkzMTU3MTYzLCJleHAiOjE2OTM3NjE5NjN9.nJCufbZumrd_O7jogJ996_qCmS4NCCOEoSUKJuO65-M"
}
```
### GET/posts

- insert token in authorization in header

![authorization](./assets/authorization.png)

- return all posts
```
[
    {
        "id": "p001",
        "content": "Fala galera, quem diria que ia comprender um pouco de programação!Estou aprandendo cada dia mais!",
        "likes": 0,
        "dislikes": 0,
        "createdAt": "2023-08-04 23:07:13",
        "updatedAt": "2023-08-04 23:07:13",
        "creator": {
            "id": "u001",
            "name": "Bruno"
        }
    },
    {
        "id": "p002",
        "content": "Fala galera, quem diria que ia ver o Bruno aprendendo alguma coisa de programção.kkkk",
        "likes": 1,
        "dislikes": 0,
        "createdAt": "2023-08-04 23:07:13",
        "updatedAt": "2023-08-04 23:07:13",
        "creator": {
            "id": "u002",
            "name": "Danielle"
        }
    },
    {
        "id": "p003",
        "content": "Fala familia, Meu pai esta aprendendo e gosto de ver o que ele consegui produzir. E quando é de pokemon é melhor ainda.kkkkk",
        "likes": 0,
        "dislikes": 0,
        "createdAt": "2023-08-04 23:07:13",
        "updatedAt": "2023-08-04 23:07:13",
        "creator": {
            "id": "u003",
            "name": "Heitor"
        }
    },
    {
        "id": "p004",
        "content": "Fala pessoal, cansei de ver meu pai no computador, quero que ele fique sempre comigo.",
        "likes": 0,
        "dislikes": 0,
        "createdAt": "2023-08-04 23:07:13",
        "updatedAt": "2023-08-04 23:07:13",
        "creator": {
            "id": "u004",
            "name": "Arthur"
        }
    },
    {
        "id": "53354958-e7ac-4c0b-809a-cc53fb833013",
        "content": "Rumo ao últimos detalhes do projeto!",
        "likes": 0,
        "dislikes": 0,
        "createdAt": "2023-08-27T14:07:50.301Z",
        "updatedAt": "2023-08-27T14:07:50.301Z",
        "creator": {
            "id": "u001",
            "name": "Bruno"
        }
    },
    {
        "id": "4808b5a2-4b36-4457-aded-3d8aa4248e6e",
        "content": "Esse Bruno é complicado, deixando tudo para última hora!",
        "likes": 0,
        "dislikes": 0,
        "createdAt": "2023-08-27T14:40:34.613Z",
        "updatedAt": "2023-08-27T14:40:34.613Z",
        "creator": {
            "id": "4e86a10a-f18d-4821-ae72-e3dfb7862287",
            "name": "fulano"
        }
    },
    {
        "id": "5f61c236-8f37-41ac-923e-4372894dba99",
        "content": "Estou na reta final do projeto!!!!!",
        "likes": 0,
        "dislikes": 0,
        "createdAt": "2023-08-27T17:35:27.416Z",
        "updatedAt": "2023-08-27T17:35:27.416Z",
        "creator": {
            "id": "u001",
            "name": "Bruno"
        }
    }
]
```
### POST/post

- insert token in authorization in header

![authorization](./assets/authorization.png)

- body:
```
{
    "content":"Estou na reta final do projeto!!!!!"
}
```
- retunr:
```
{
    "message": "post created successfully!"
}
```
### PUT/post

- insert postId in query

![PostId](./assets/Id.png)

- insert token in authorization in header

![authorization](./assets/authorization.png)

- body:
```
{
    "content":"Rumo ao últimos detalhes do projeto!"
}
```
- return:
```
{
    "message": "post changed successfully!"
}
```
### DELETE/post
- insert postId in query

![PostId](./assets/Id.png)

- insert token in authorization in header

![authorization](./assets/authorization.png)

- return:
```
{
    "message": "Post successfully deleted!"
}
```
### PUT/like or deslike

- insert postId in query

![PostId](./assets/Id.png)

- insert token in authorization in header

![authorization](./assets/authorization.png)

- body:
```
{
    "like":true
}
```
- return:
```
{
    "message": "like or dislike successfully updated!"
}
```
## 💻 How to run this project
- If you want to download and install this project on your computer, you need to have git and node installed.
### Links: 
✅[Node](https://nodejs.org/en)
<br><br>
✅[Git](https://git-scm.com/)
- After installation, follow the steps below:
```bash
# Copy the link below

https://github.com/BrunoNMoura/labook-backend

# Open a terminal and type the following command

git clone (paste the url here)

# access the created page

cd labook-backend

# install the dependencies

npm install
or
yarn install

# Executing the Project

npm run start
or 
yarn start
```

## 🛠 Technologies used
✅[Node.js](https://nodejs.org/en)
<br>
✅[TypeScript](https://www.typescriptlang.org/)
<br>
✅[Express](https://expressjs.com/pt-br/)
<br>
✅[SQL](https://learn.microsoft.com/pt-br/sql/?view=sql-server-ver16)
<br>
✅[SQLite](https://www.sqlite.org/docs.html)
<br>
✅[Knex.js](https://knexjs.org/guide/)
<br>
✅[ZOD](https://www.npmjs.com/package/zod)
<br>
✅[UUID Generator](https://www.uuidgenerator.net/)
<br>
✅[JWT](https://jwt.io/)

## 📺  Demonstration

## 📚 Documentation
[View Postman-Labook-Backend](https://documenter.getpostman.com/view/26570541/2s9Y5YShoH)

## 🏆 Developer
![BrunoMoura](./assets/Bruno.jpg)
<br>
Bruno Nascimento Moura
<br>
[Linkedin](https://www.linkedin.com/in/bruno-moura-dev/)

## 🪜 Next steps
- Expand the database
- Implement the API in a frontend application