import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const seenJobsPath = fileURLToPath(new URL('../job_scraper/seen_jobs.json', import.meta.url))

// Serves job_scraper/seen_jobs.json fresh on every request (read from disk each
// time, no caching) so the dashboard always reflects the latest /scrape run
// without a build/copy step.
function seenJobsApi() {
  return {
    name: 'seen-jobs-api',
    configureServer(server) {
      server.middlewares.use('/api/seen-jobs', (req, res) => {
        try {
          const data = readFileSync(seenJobsPath, 'utf-8')
          res.setHeader('Content-Type', 'application/json')
          res.end(data)
        } catch (err) {
          res.statusCode = 404
          res.end(JSON.stringify({ error: 'seen_jobs.json not found or unreadable', detail: String(err) }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), seenJobsApi()],
})
