import React from 'react'

function ChapterSelect({chapterNos, chapterNo, handleChapterChange, includeAll}) {
  // console.log("Rendering ChapterSelect...")

  if(chapterNos.length === 0) return null
  
  let options = []

  if(includeAll) {
    options.push(<option key={"wholeBook"} value={"wholeBook"}>全本書</option>)
  }
  
  chapterNos.forEach(no => {
    options.push(<option key={no} value={no}>{no}</option>)
  })

  return (
    <>
      {/* <div className="input-field col selectLabel">第</div> */}

      <div className="input-field col">
        <select className="browser-default" name="chapter" id="chapter" title="Chapter select" value={chapterNo} onChange={handleChapterChange} >
          {options}
        </select>
      </div>

      {/* <div className="input-field col selectLabel">章</div> */}
    </>
  )
}

export default React.memo(ChapterSelect)
