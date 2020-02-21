import React from 'react'

function SearchPhraseEntry({handleSearchTextChange, handleSearchClick, searchedText}) {
  return (
    <>
      <div className="input-field col">
        <div className="search-wrapper focused">
          <input type="text" id="phraseToSearch" value={searchedText} placeholder="搜索詞彙" onChange={handleSearchTextChange} />
        </div>
      </div>
      <div className="input-field col">
        <button className="btn waves-effect grey" onClick={handleSearchClick} ><i className="material-icons">search</i></button>
      </div>
    </>
  )
}

export default SearchPhraseEntry
