import { Request, Response } from "express";
import { hash } from "bcrypt";
import z from "zod";

import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";

export class UsersController {
    async create(request: Request, response: Response) {

        const bodySchema = z.object({
            name: z.string().trim().min(2),
            email: z.string().email(),
            password: z.string().min(6)
        })

        const { name, email, password } = bodySchema.parse(request.body)

        const userWithSameEmail = await prisma.user.findFirst({ where: { email } })

        if (userWithSameEmail) {
            throw new AppError("Email já está cadastrado em nosso banco de dados!")
        }

        const hashedPassword = await hash(password, 8)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            }
        })


        const { password: _, ...userWithoutPassword } = user



        return response.status(201).json(userWithoutPassword)
    }
}