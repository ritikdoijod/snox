import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { config } from "@/configs/app"
import { connectToDB } from "@/configs/db"
import { format } from '@/middlewares/format'

// routes
import auth from "@/auth/auth.route"
import users from "@/users/users.route"

const app = new Hono()

app.use(async (c, next) => {
  const start = Date.now()
  await next()
  const end = Date.now()
  c.res.headers.set('X-Response-Time', `${end - start}`)
})

app.onError((error, c) => {
  return c.json.error(error)
})

app.use(format({ apiVersion: "0.0.1" }));

app.route('/auth', auth);
app.route("/users", users);

serve({
  fetch: app.fetch,
  port: config.PORT
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
  connectToDB()
})
