import express from 'express'
import pkg from "@prisma/client"

const { PrismaClient } = pkg

const prisma = new PrismaClient()
const app = express()



app.use(express.json())

app.get("/user", async (req, res) => {
    const users = await prisma.user.findMany()

    res.json(users)
})

app.post("/user", async (req, res) => {
    const { name, email } = req.body

    if (!name || !email) {
        return res.status(400).json({ error: "Nome e email são obrigatórios" })
    }
    const userNew = await prisma.user.create({

        data: {
            name: name,
            email: email
        }

    })


    res.status(201).json({
        mesg: "USUARIO CRIADO",
        data: userNew
    })
})


app.listen(3000, () => {
    console.log("rota localhost:3000/user ")
})