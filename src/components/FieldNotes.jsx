import { useState } from 'react'
import { fieldNotes } from '../data/fieldnotes'

export default function FieldNotes() {
  const [openId, setOpenId] = useState(fieldNotes[0]?.id ?? null)

  return (
    <section className="hn-section" aria-labelledby="fn-heading">
      <h2 id="fn-heading">&gt; FIELD NOTES</h2>
      <div className="hn-inner">
        <p className="hn-sub">&gt; real writeups from building and running this site — not aggregated content</p>

        <div className="fn-list">
          {fieldNotes.map(note => {
            const isOpen = openId === note.id
            return (
              <article key={note.id} className="fn-entry">
                <button
                  className="fn-entry-header"
                  onClick={() => setOpenId(isOpen ? null : note.id)}
                  aria-expanded={isOpen}
                  aria-controls={`fn-body-${note.id}`}
                >
                  <span className="fn-date">{note.date}</span>
                  <span className="fn-title">{note.title}</span>
                  <span className="fn-toggle" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                </button>
                <p className="fn-summary">{note.summary}</p>
                {isOpen && (
                  <div id={`fn-body-${note.id}`} className="fn-body">
                    {note.body.split('\n\n').map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
