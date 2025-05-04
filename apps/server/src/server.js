import { serve } from '@hono/node-server'
import { config } from "@/configs/app"
import { connectToDB } from "@/configs/db"
import { logger } from '@/configs/logger'

import { app } from "@/app"

serve({
  fetch: app.fetch,
  port: config.PORT
}, (info) => {
  logger.info(`Server is running on http://localhost:${info.port}`)
  connectToDB()
})
