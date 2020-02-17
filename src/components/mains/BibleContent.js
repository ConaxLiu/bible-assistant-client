import React, { useState, useEffect } from "react";
import axios from "axios";
import "./BibleContent.css";

function BibleContent() {
  const [bookNames, setBookNames] = useState([]);
  const [bookName, setBookName] = useState("創世紀");
  const [chapterNos, setChapterNos] = useState([]);
  const [chapterNo, setChapterNo] = useState(1);
  const [chapterContent, setChapterContent] = useState({});
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(false);

  const SERVER_URL = "https://conaxbibleservice.azurewebsites.net"
  //const SERVER_URL = "http://10.0.0.8:3000"

  // This useEffect is only for initializing default values for the controls
  // We will get the list of Bible book names along with the chapter numbers.
  // This should then allow the book and chapter selection dropdowns to be populated.
  // Finally it will retrieve the chapter content of the 
  // first chapter in the first book so that can be populated too.
  useEffect(() => {
    console.log("Initializing")
    
    console.log(`${SERVER_URL}/api/contents/booknames`)

    axios
      .get(`${SERVER_URL}/api/contents/booknames`)
      .then(resp => {
        const data = resp.data;
        setBookNames(data);
        setChapterNos(data[0].chapters)

        axios
          .get(`${SERVER_URL}/api/contents/${data[0].bookName}/1`)
          .then(resp => {
            setChapterContent(resp.data);
            setPrevBtnDisabled(true)
            setNextBtnDisabled(false)
          })
          .catch(error => {
            console.log(error);
          });
      })
      .catch(error => {
        console.log(error);
      });
  }, [])

  // This useEffect is used when a book or chapter selection has changed
  useEffect(() => {
    axios
    .get(`${SERVER_URL}/api/contents/${bookName}/${chapterNo}`)
    .then(resp => {
      setChapterContent(resp.data);
    })
    .catch(error => {
      console.log(error);
    });
  }, [bookName, chapterNo])

  // When a book selection has changed, we need to update the chapter numbers for the new selected book
  // Also if the previous book has more chapters than the new selected book
  // and the previous selected chapter is outside the range of the current book's chapters 
  // then we need to automatically select the last chapter of the new selected book.
  const handleBookChange = (e) => {
    console.log("handleBookChange")
    const newBookName = e.target.value;
    const newChapterNos = bookNames.find(book => book.bookName === newBookName).chapters
    setBookName(newBookName)
    setChapterNos(newChapterNos)

    let newChapterNo = parseInt(document.getElementById('chapter').value)

    if(newChapterNo > newChapterNos.length) {
      newChapterNo = newChapterNos.length
      setChapterNo(newChapterNo)
    }

    toggleChapterButtons(newBookName, newChapterNo, newChapterNos.length)
  }

  const handleChapterChange = (e) => {
    console.log("handleChapterChange")
    const newChapterNo = parseInt(e.target.value)
    setChapterNo(newChapterNo)
    toggleChapterButtons(bookName, newChapterNo, chapterNos.length)
  }

  const handlePrevChapter = (e) => {
    console.log("handlePrevChapter")
    
    let newBookName = bookName
    let newChapterNos = chapterNos
    let newChapterNo = chapterNo - 1
    
    if(newChapterNo < 1) {
      const bookIndex = bookNames.findIndex(book => book.bookName === newBookName)
      newBookName = bookNames[bookIndex-1].bookName
      newChapterNos = bookNames.find(book => book.bookName === newBookName).chapters
      newChapterNo = newChapterNos.length
      setBookName(newBookName)
      setChapterNos(newChapterNos)
    }
    
    setChapterNo(newChapterNo)
    toggleChapterButtons(newBookName, newChapterNo, newChapterNos.length)
    window.scrollTo(0,0)
  }

  // When Next Chapter is clicked, try to go to the next chapter in the current book.
  // If we're already at the last chapter, we will go to the first chapter of next book.
  const handleNextChapter = (e) => {
    console.log("handleNextChapter")

    let newBookName = bookName
    let newChapterNos = chapterNos
    let newChapterNo = chapterNo + 1
    
    if(newChapterNo > chapterNos.length) {
      const bookIndex = bookNames.findIndex(book => book.bookName === newBookName)
      newBookName = bookNames[bookIndex+1].bookName
      newChapterNos = bookNames.find(book => book.bookName === newBookName).chapters
      newChapterNo = 1
      setBookName(newBookName)
      setChapterNos(newChapterNos)
    }
    
    setChapterNo(newChapterNo)
    toggleChapterButtons(newBookName, newChapterNo, newChapterNos.length)
    window.scrollTo(0,0)
  }

  // If we're at the first chapter of first book then Prev Chapter button should be disabled
  // If we're at the last chapter of last book then Next chapter button should be disabled
  const toggleChapterButtons = (newBookName, newChapterNo, maxChapterNo) => {
    const prevShouldDisable = (newBookName === bookNames[0].bookName && newChapterNo === 1)? true : false
    const nextShouldDisable = (newBookName === bookNames[bookNames.length-1].bookName && newChapterNo === maxChapterNo)? true : false

    setPrevBtnDisabled(prevShouldDisable)
    setNextBtnDisabled(nextShouldDisable)
  }

  return (
    <section className="container" id="bible-content-wrapper">
      {/* Book and Chapter selectors, top Prev and Next Chapter buttons */}
      <div className="row control-wrapper">
        <div className="input-field col">
          <select className="browser-default" name="book" id="book" value={bookName} onChange={handleBookChange} >
            {bookNames.map(book => (<option key={book.bookName} value={book.bookName}>{book.bookName}</option>))} 
          </select>
        </div>

        <div className="input-field col selectLabel">第</div>
        <div className="input-field col">
          <select className="browser-default" name="chapter" id="chapter" value={chapterNo} onChange={handleChapterChange} >
            {chapterNos.map(chapterNo => (<option key={chapterNo} value={chapterNo}>{chapterNo}</option>))}
          </select>
        </div>
        <div className="input-field col selectLabel">章</div>
        
        <div className="right">
          <div className="input-field col">
            <button className="btn waves-effect grey" onClick={handlePrevChapter} disabled={prevBtnDisabled}><i className="material-icons">skip_previous</i></button>
          </div>
          <div className="input-field col">
            <button className="btn waves-effect grey" onClick={handleNextChapter} disabled={nextBtnDisabled}><i className="material-icons">skip_next</i></button>
          </div>
        </div>
      </div>

      {/* Chapter content */}
      <div className="row" id="bible-content">
        {Object.entries(chapterContent).map(([verseNo, verseText]) => (
          <span key={verseNo}>
            <span className="verseNo">
              {verseNo}
              <span className="verseText">{verseText}</span>
            </span>
          </span>
        ))}
      </div>

      {/* Bottom Prev and Next Chapter buttons */}
      <div className="row control-wrapper">
        <div className="right">
          <div className="input-field col">
            <button className="btn waves-effect grey" onClick={handlePrevChapter} disabled={prevBtnDisabled}><i className="material-icons">skip_previous</i></button>
          </div>
          <div className="input-field col">
            <button className="btn waves-effect grey" onClick={handleNextChapter} disabled={nextBtnDisabled}><i className="material-icons">skip_next</i></button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BibleContent;
