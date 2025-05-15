import {z} from "zod"

export const getProjectsQuerySchema = z.object({
    include: z.array(z.enum("tasks", "user", "workspace"))
})