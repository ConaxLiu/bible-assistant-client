import React from 'react'

function ChapterContent({chapterContent, highlightVerse}) {
  console.log("Rendering ChapterContent...", chapterContent, highlightVerse)
  console.debug()

  return (
    <div className="row" id="chapter-content">
      {Object.entries(chapterContent).map(([verseNo, verseText]) => (

        verseNo === highlightVerse ? 
        <span key={verseNo} className="highlight">
          <span className="verseNo">
            {verseNo}
            <span className="verseText">{verseText}</span>
          </span>
        </span>
        :
        <span key={verseNo}>
          <span className="verseNo">
            {verseNo}
            <span className="verseText">{verseText}</span>
          </span>
        </span>

      ))}
    </div>
  )
}

export default React.memo(ChapterContent)
