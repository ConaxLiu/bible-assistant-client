import React from 'react'

function BookSelect({bookNames, bookName, handleBookChange, includeAll}) {
  // console.log("Rendering BookSelect...")
  let options = []

  if(includeAll) {
    options.push(<option key={"wholeBible"} value={"wholeBible"}>全本聖經</option>)
  }

  bookNames.forEach(book => {
    options.push(<option key={book.bookName} value={book.bookName}>{book.bookName}</option>)
  })

  return (
    <div className="input-field col">
      <select className="browser-default" name="book" id="book" title="Book select" value={bookName} onChange={handleBookChange} >
        {options}
      </select>
    </div>
  )
}

export default React.memo(BookSelect)
