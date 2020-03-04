import React from 'react'

function ContentNavigator({handlePrevChapter, prevBtnDisabled, handleNextChapter, nextBtnDisabled}) {
  // console.log("Rendering ContentNavigator...")

  return (
    <div className="row contentNavigator">
      <div className="input-field col">
        <button className="btn waves-effect grey" onClick={handlePrevChapter} disabled={prevBtnDisabled}><i className="material-icons">skip_previous</i></button>
      </div>
      <div className="input-field col">
        <button className="btn waves-effect grey" onClick={handleNextChapter} disabled={nextBtnDisabled}><i className="material-icons">skip_next</i></button>
      </div>
    </div>
  )
}

export default React.memo(ContentNavigator)
