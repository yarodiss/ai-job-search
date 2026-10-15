# Search Queries for Job Scraper

<!-- SETUP: Customize these queries based on your skills, target roles, and location -->

## Installed portal CLIs (primary for `/scrape`)

`/scrape` discovers every portal skill under `.agents/skills/*/SKILL.md` and runs its CLI first. Shipped country-agnostic CLIs include `linkedin-search` and `freehire-search`; Danish demos and any skill you add with `/add-portal` are included the same way. You do **not** need a matching `site:` line below for those CLIs to run.

The `site:` query templates in this file are the **WebSearch fallback** — for portals without a CLI, company career pages, or when a CLI fails.

**Language scope:** write every query category in every language listed in your CLAUDE.md Languages table (typically 1-2, sometimes more). A posting requiring a language you have *not* declared, as a job condition, is excluded before scoring; a posting requiring a *higher level* than you declared in a language you *do* work in is flagged for your own judgment, not excluded — see `04-job-evaluation.md`'s Language Gate, the single source of truth for this rule. Translate each category's keywords rather than machine-translating word-for-word (e.g. "Frontend Developer" -> "Desarrollador Frontend", not a literal word-for-word translation) if you work in more than one language.

## Search Sites

Primary (installed CLI tools):
- **linkedin.com/jobs** - LinkedIn job listings, scoped to Latin America (see Location Filter below); covered by `linkedin-search` CLI. LinkedIn's `--location` takes a place string, not a region facet, so run it per-country/city (e.g. `"Mexico City, Mexico"`, `"Bogota, Colombia"`, `"Sao Paulo, Brazil"`, `"Santo Domingo, Dominican Republic"`, `"San Jose, Costa Rica"`, `"Buenos Aires, Argentina"`) or `"Remote"` combined with a manual location check against the Location Filter below, rather than relying on `"remote"` alone to imply Latin America.
- **freehire-search** CLI - use `--region latam` (not `latam,global,none`) to scope directly to Latin America-eligible postings; no `site:` line needed.

Secondary (WebSearch fallback, company career pages):
- indeed.com, glassdoor.com - general boards useful for remote/LATAM roles outside the CLIs above
- Direct Google searches with `site:` filters for known target companies

## Query Categories

Queries are grouped by priority. Write **each category in every language from your Languages table** (see Language scope above). Combine each query with your location terms (e.g. your city, region, or metro area) where the site supports it.

**Organize by function, not job title.** The same underlying work carries different titles across companies and markets (a "Data Scientist" role at one employer may be posted as "Insights Analyst" or "Data Consultant" at another). Name each priority category after the function it covers, and list several plausible job titles as query variants within that category rather than betting an entire priority tier on one exact title string.

### Priority 1: Full Stack / Backend Engineer (JavaScript/TypeScript)

These match Yarodis's strongest and most desired career direction.

```
site:linkedin.com/jobs "Full Stack Engineer" remote
site:linkedin.com/jobs "Backend Engineer" Node.js remote
site:linkedin.com/jobs "Node.js Engineer" remote
site:linkedin.com/jobs "Software Engineer" TypeScript remote Latin America
```

### Priority 2: Technical Leadership

These match his technical leadership / mentoring experience (BairesDev, Halo Media).

```
site:linkedin.com/jobs "Technical Lead" Node.js remote
site:linkedin.com/jobs "Engineering Team Lead" remote
site:linkedin.com/jobs "Staff Software Engineer" TypeScript remote
```

### Priority 3: Frontend / Angular (adjacent)

Adjacent roles leaning on his Angular/frontend experience.

```
site:linkedin.com/jobs "Frontend Engineer" Angular remote
site:linkedin.com/jobs "Angular Developer" remote Latin America
```

### Priority 4: Broader Technical / Consulting

Wider net for general technical roles.

```
site:linkedin.com/jobs "JavaScript Developer" remote
site:linkedin.com/jobs "TypeScript Developer" remote
site:linkedin.com/jobs "technical consultant" Node.js remote
```

## Location Filter

Scoped to Latin America only (updated 2026-08-18 - narrowed from an initial worldwide/remote scope). Tiers:
- **Ideal:** Remote roles explicitly open to Latin America (region/country facet `latam`, or posting text naming LatAm countries/"LATAM")
- **Acceptable:** On-site or hybrid roles based in a Latin American country
- **Excluded:** Remote roles not open to Latin America (e.g. "Remote - US only", "Remote - EU only"), and on-site roles outside Latin America
- When a posting's remote eligibility is ambiguous (e.g. "Remote" with no region named), treat it as excluded rather than assuming it covers Latin America - `freehire-search`'s `--region latam` facet or explicit posting text should confirm it.

## Language Filter

Your working languages and levels are in CLAUDE.md's Languages table. When filtering scraped results, apply `04-job-evaluation.md`'s Language Gate: a posting requiring a language you haven't declared at all is excluded; a posting requiring a higher level than you declared in a language you do work in is not excluded, flag it clearly instead (see `job-scraper/SKILL.md`'s Step 3 "Quick Fit Assessment" for how the flag surfaces in `/scrape` output). Postings simply *written* in a language you don't work in, that don't require it on the job, are fine.

## Date Filter

Only include jobs posted within the last 14 days, or with an application deadline that has not yet passed. If a posting date cannot be determined, include it but flag as "date unknown".

## Adapting Queries

If the user specifies a focus area, select queries from the matching category and also generate 2-3 custom queries for that focus. For example:
- "/scrape [focus_area]" -> relevant category queries + custom focus-specific queries
