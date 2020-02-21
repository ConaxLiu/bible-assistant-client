import React from 'react'

function SearchedText({searchedString, searchedText}) {
  const splitted = searchedString.split(new RegExp(`(${searchedText})`, 'gi'));
  
  return (
    <div>{
        splitted.map((part, idx) => 
          part.toLowerCase() === searchedText.toLowerCase() ?
          <span key={idx} className="highlight">{part}</span> : 
          <span key={idx}>{part}</span>
        )
    }</div>
  )
}

export default SearchedText
