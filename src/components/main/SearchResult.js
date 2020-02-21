import React from 'react'
import { Link } from 'react-router-dom';
import SearchedText from './SearchedText'

function SearchResult({searchResult, searchedText}) {
  if(searchResult === null) return null

  if(searchResult.count === 0) {
    return (
      <div className="row" id="search-result">
        <div className="resultSummary">總共有 {searchResult.count} 節經文包含了您的搜索詞彙</div>
      </div>
    )
  }
  else {
    // const searchedTextPattern = new RegExp(searchedText, 'g')
    // console.log(searchedTextPattern, searchResult)
    // searchResult.data.forEach(result => {
    //   result.highlightedVerse = result.verse.replace(searchedTextPattern, (<span class="yellow">{searchedText}</span>))
    // })

    return (
      <div className="row" id="search-result">
        <div className="resultSummary">總共有 {searchResult.count} 節經文包含了您的搜索詞彙</div>
        
        <ul className="collection">
        {searchResult.data.map(({bookName, chapterNo, verseNo, verse}, index) => (
          <li key={index} className="collection-item">
  
            <div className="row verseLocation">
              <div className="col">{bookName} {chapterNo}:{verseNo}</div>
              <div className="col right">
                <Link to={`/?b=${bookName}&c=${chapterNo}&v=${verseNo}`}>
                  <i className="material-icons grey-text" title="Read this chapter">label_important</i>
                </Link>
              </div>
            </div>
            
            <div className="row verseText"><SearchedText searchedString={verse} searchedText={searchedText} /></div>
          </li>
        ))}
        </ul>
      </div>
    )
  }
}

export default SearchResult
