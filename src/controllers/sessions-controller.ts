import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { compare } from "bcrypt";
import { Request, Response } from "express";
import z from "zod";

class SessionsController {
    async create(request: Request, response: Response) {

        const bodySchema = z.object({
            email: z.string().email(),
            password: z.string().min(6)
        })

        const { email, password } = bodySchema.parse(request.body)

        const user = await prisma.user.findFirst({ where: { email } })

        if (!user) {
            throw new AppError("Usuário e/ou senha inválidos!", 401)
        }

        const passwordMatched = compare(password, user.password)


        if (!passwordMatched) {
            throw new AppError("Usuário e/ou senha inválidos!", 401)
        }


    }
}

export { SessionsController }