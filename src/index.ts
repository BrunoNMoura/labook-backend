import express from 'express'
import cors from 'cors'
import { userRouter } from './router/userRouter'
import dotenv from 'dotenv'
import { postRouter } from './router/postRouter'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.listen(Number(process.env.PORT|| 3003), () => {
    console.log(`Server running on port ${process.env.PORT}`)
})

app.use("/users", userRouter)
app.use("/posts", postRouter)
