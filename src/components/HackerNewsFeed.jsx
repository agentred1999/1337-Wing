import { useState, useEffect } from 'react'

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export default function HackerNewsFeed() {
  const [query, setQuery] = useState('security hacking linux pentest')
  const [inputVal, setInputVal] = useState('')
  const [sort, setSort] = useState('rel')
  const [type, setType] = useState('all')
  const [minPts, setMinPts] = useState(0)
  const [rawHits, setRawHits] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // useEffect: fetch whenever query changes
  useEffect(() => {
    const fetchHN = async () => {
      setLoading(true)
      setError(null)
      try {
        let url = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&hitsPerPage=40`
        if (type !== 'all') url += `&tags=${encodeURIComponent(type)}`
        const res = await fetch(url)
        const data = await res.json()
        setRawHits(data.hits || [])
      } catch (e) {
        setError('> error: ' + e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchHN()
  }, [query]) // re-runs when query changes

  const handleSearch = () => {
    const q = inputVal.trim()
    if (q) setQuery(q)
  }

  // Filter + sort client-side (also uses useEffect pattern via derived state)
  const filteredHits = rawHits
    .filter(h => {
      const tags = h._tags || []
      if (type === 'ask_hn') return tags.includes('ask_hn')
      if (type === 'show_hn') return tags.includes('show_hn')
      if (type === 'job') return tags.includes('job')
      if (type === 'story') return tags.includes('story') && !tags.includes('ask_hn') && !tags.includes('show_hn')
      return true
    })
    .filter(h => (h.points || 0) >= minPts)
    .sort((a, b) => {
      if (sort === 'pts') return (b.points || 0) - (a.points || 0)
      if (sort === 'new') return new Date(b.created_at) - new Date(a.created_at)
      if (sort === 'cmt') return (b.num_comments || 0) - (a.num_comments || 0)
      return 0
    })

  const getLabel = (tags) => {
    if (tags.includes('ask_hn')) return 'Ask HN'
    if (tags.includes('show_hn')) return 'Show HN'
    if (tags.includes('job')) return 'Job'
    if (tags.includes('comment')) return 'Comment'
    return 'Story'
  }

  return (
    <section id="hn-section">
      <h2>&gt; INTEL FEED — HACKER NEWS</h2>
      <div className="hn-inner">
        <p className="hn-sub">&gt; live search via hn.algolia.com api — type anything and hit search</p>

        <div className="hn-search-bar">
          <input
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="> search hacker news... e.g. linux, pentesting, security"
            autoComplete="off"
          />
          <button onClick={handleSearch}>SEARCH</button>
        </div>

        <div className="hn-filters">
          <label>SORT:</label>
          <select value={sort} onChange={e => setSort(e.target.value)}>
            <option value="rel">Relevance</option>
            <option value="pts">Points: High → Low</option>
            <option value="new">Newest First</option>
            <option value="cmt">Most Comments</option>
          </select>
          <label>TYPE:</label>
          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="all">All</option>
            <option value="story">Stories</option>
            <option value="ask_hn">Ask HN</option>
            <option value="show_hn">Show HN</option>
            <option value="job">Jobs</option>
          </select>
          <label>MIN PTS:</label>
          <select value={minPts} onChange={e => setMinPts(parseInt(e.target.value))}>
            <option value="0">Any</option>
            <option value="10">10+</option>
            <option value="50">50+</option>
            <option value="100">100+</option>
            <option value="300">300+</option>
          </select>
        </div>

        {loading && (
          <div className="hn-loading">
            <div className="spinner"></div>
            <br />&gt; fetching from hacker news api...
          </div>
        )}

        {error && <div className="hn-empty">{error}</div>}

        {!loading && !error && filteredHits.length === 0 && (
          <div className="hn-empty">&gt; no results found. try a different query.</div>
        )}

        {!loading && filteredHits.length > 0 && (
          <div className="hn-count">
            &gt; {filteredHits.length} result{filteredHits.length !== 1 ? 's' : ''} found
          </div>
        )}

        <div id="hn-grid">
          {filteredHits.map(h => {
            const tags = h._tags || []
            const label = getLabel(tags)
            const title = h.title || h.story_title || (h.comment_text || '').slice(0, 80) || '(no title)'
            const hnUrl = `https://news.ycombinator.com/item?id=${h.objectID}`
            return (
              <div key={h.objectID} className="hn-card">
                <span className="hn-tag">{label}</span>
                <h3>
                  {h.url
                    ? <a href={h.url} target="_blank" rel="noreferrer">{title}</a>
                    : title
                  }
                </h3>
                <div className="hn-meta">
                  <span className="hn-pts">▲ {h.points || 0} pts</span>
                  <span>💬 {h.num_comments || 0}</span>
                  <span>{h.created_at ? new Date(h.created_at).toLocaleDateString() : ''}</span>
                </div>
                <div className="hn-by">by {h.author || 'unknown'}</div>
                <a className="hn-link" href={hnUrl} target="_blank" rel="noreferrer">&gt; view on HN →</a>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
