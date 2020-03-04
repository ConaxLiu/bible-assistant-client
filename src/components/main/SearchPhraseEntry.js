import React from 'react'

function SearchPhraseEntry({handleSearchClick}) {
  // console.log("Rendering SearchPhraseEntry...")

  return (
    <>
      <div className="input-field col">
        <div className="search-wrapper focused">
          <input type="text" id="phraseToSearch" placeholder="搜索詞彙" />
        </div>
      </div>
      <div className="input-field col">
        <button className="btn waves-effect grey" onClick={handleSearchClick} ><i className="material-icons">search</i></button>
      </div>
    </>
  )
}

export default React.memo(SearchPhraseEntry)
