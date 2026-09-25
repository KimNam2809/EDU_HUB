import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import chatHandler from './api/chat.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  Object.assign(process.env, env)

  return {
    plugins: [
      react(),
      {
        name: 'vercel-serverless-api-dev',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url?.startsWith('/api/chat')) {
              let body = ''
              req.on('data', chunk => { body += chunk })
              req.on('end', async () => {
                try {
                  req.body = body ? JSON.parse(body) : {}
                } catch {
                  req.body = {}
                }

                res.status = (code) => {
                  res.statusCode = code
                  return res
                }
                res.json = (data) => {
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify(data))
                  return res
                }

                try {
                  await chatHandler(req, res)
                } catch (err) {
                  console.error('Local /api/chat error:', err)
                  res.statusCode = 500
                  res.end(JSON.stringify({ error: err.message }))
                }
              })
              return
            }
            next()
          })
        }
      }
    ],
  }
})
