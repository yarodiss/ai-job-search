import { useEffect, useMemo, useState } from 'react'
import './App.css'

const FIT_RANK = { high: 0, medium: 1, low: 2 }

const COLUMNS = [
  { key: 'fit', label: 'Fit' },
  { key: 'title', label: 'Title' },
  { key: 'company', label: 'Company' },
  { key: 'location', label: 'Location' },
  { key: 'portal', label: 'Portal' },
  { key: 'status', label: 'Status' },
  { key: 'first_seen', label: 'First Seen' },
]

function compareValues(a, b, key) {
  if (key === 'fit') {
    return (FIT_RANK[a.fit] ?? 99) - (FIT_RANK[b.fit] ?? 99)
  }
  const av = (a[key] ?? '').toString().toLowerCase()
  const bv = (b[key] ?? '').toString().toLowerCase()
  return av < bv ? -1 : av > bv ? 1 : 0
}

function App() {
  const [jobs, setJobs] = useState(null)
  const [error, setError] = useState(null)
  const [sortKey, setSortKey] = useState('fit')
  const [sortDir, setSortDir] = useState('asc')
  const [viewedUrls, setViewedUrls] = useState(() => new Set())

  function toggleViewed(url) {
    setViewedUrls((prev) => {
      const next = new Set(prev)
      if (next.has(url)) {
        next.delete(url)
      } else {
        next.add(url)
      }
      return next
    })
  }

  useEffect(() => {
    let cancelled = false

    function load() {
      fetch('/api/seen-jobs')
        .then((res) => {
          if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
          return res.json()
        })
        .then((data) => {
          if (!cancelled) {
            setJobs(Object.values(data.seen ?? {}))
            setError(null)
          }
        })
        .catch((err) => {
          if (!cancelled) setError(err.message)
        })
    }

    load()
    // Poll for changes so a fresh /scrape run shows up without a manual reload.
    const interval = setInterval(load, 5000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  const sorted = useMemo(() => {
    if (!jobs) return []
    const rows = [...jobs]
    rows.sort((a, b) => {
      const cmp = compareValues(a, b, sortKey)
      return sortDir === 'asc' ? cmp : -cmp
    })
    return rows
  }, [jobs, sortKey, sortDir])

  function handleSort(key) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  if (error) {
    return (
      <div className="wrap">
        <p className="error">
          Couldn't load seen_jobs.json: {error}
          <br />
          Make sure <code>job_scraper/seen_jobs.json</code> exists (run{' '}
          <code>/scrape</code> at least once).
        </p>
      </div>
    )
  }

  if (!jobs) {
    return (
      <div className="wrap">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="wrap">
      <h1>Job Scraper Dashboard</h1>
      <p className="count">{jobs.length} tracked postings</p>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th key={col.key} onClick={() => handleSort(col.key)}>
                  {col.label}
                  {sortKey === col.key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((job) => (
              <tr
                key={job.url}
                className={`fit-${job.fit}${viewedUrls.has(job.url) ? ' viewed' : ''}`}
                onClick={() => toggleViewed(job.url)}
              >
                <td className="fit-cell">{job.fit}</td>
                <td>
                  <a href={job.url} target="_blank" rel="noreferrer">
                    {job.title}
                  </a>
                </td>
                <td>{job.company}</td>
                <td>{job.location ?? ''}</td>
                <td>{job.portal}</td>
                <td>{job.status}</td>
                <td>{job.first_seen}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App
