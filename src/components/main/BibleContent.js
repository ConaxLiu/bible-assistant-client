import React, { useState, useEffect } from "react";
import axios from "axios";
import queryString from 'query-string'
import "./BibleContent.css";
import BookSelect from './BookSelect'
import ChapterSelect from './ChapterSelect'
import ChapterContent from './ChapterContent'
import ContentNavigator from './ContentNavigator'

function BibleContent(props) {
  const [bookNames, setBookNames] = useState([]);
  const [bookName, setBookName] = useState("創世紀");
  const [chapterNos, setChapterNos] = useState([]);
  const [chapterNo, setChapterNo] = useState(1);
  const [highlightVerse, setHighlightVerse] = useState(0);
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
    console.log("useEffect Initializing")
    console.log("Props", props)
    const queryStringValues = queryString.parse(props.location.search)
    const {b: qBookName, c: qChapterNo, v: qVerseNo} = queryStringValues
    console.log("qBookName", qBookName)
    
    // Default book name and chapter number if not specified in query string
    let newBookName = "創世紀"
    let newChapterNos = []
    let newChapterNo = 1
    let newVerseNo = 0

    axios
      .get(`${SERVER_URL}/api/contents/booknames`)
      .then(resp => {
        const data = resp.data;
        setBookNames(data);
        setChapterNos(data[0].chapters)
        console.log("BookNames Data", data)
        
        // Check if a valid book name is passed in via query string
        if(qBookName) {
          const foundBook = data.find(book => book.bookName === qBookName)
          if(foundBook)
            newChapterNos = foundBook.chapters

          // If we found the chapter numbers, that means the book name is valid
          // So we can update the bookName and chapterNos states
          if(newChapterNos) {
            newBookName = qBookName
            setBookName(qBookName)
            setChapterNos(newChapterNos)
          }

          // Now check if a valid chapter number is passed in via query string
          if(qChapterNo && !isNaN(qChapterNo) && qChapterNo <= newChapterNos.length) {
            newChapterNo = qChapterNo
            setChapterNo(newChapterNo)
          }
        }

        // Now fetch the content of the selected book and chapter
        axios
          .get(`${SERVER_URL}/api/contents/${newBookName}/${newChapterNo}`)
          .then(resp => {
            setChapterContent(resp.data);
            setPrevBtnDisabled(true)
            setNextBtnDisabled(false)
            console.log("Number of verses", Object.keys(resp.data).length)
            // Now check if a valid verse number is passed in via query string
            if(qVerseNo && !isNaN(qVerseNo) && qVerseNo <= Object.keys(resp.data).length) {
              newVerseNo = qVerseNo
              setHighlightVerse(newVerseNo)
            }
          })
          .catch(error => {
            console.log(error);
          });
      })
      .catch(error => {
        console.log(error);
      });
  }, [props])

  // This useEffect is used when a book or chapter selection has changed
  useEffect(() => {
    console.log("useEffect Updating")

    axios
    .get(`${SERVER_URL}/api/contents/${bookName}/${chapterNo}`)
    .then(resp => {
      console.log("DATA IS", resp)
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
    setHighlightVerse(0)

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
    setHighlightVerse(0)
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
    setHighlightVerse(0)
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
    setHighlightVerse(0)
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
        <BookSelect
          bookNames={bookNames}
          bookName={bookName}
          handleBookChange={handleBookChange}
        />

        <ChapterSelect
          chapterNos={chapterNos}
          chapterNo={chapterNo}
          handleChapterChange={handleChapterChange}
        />

        <div className="right">
          <ContentNavigator
            handlePrevChapter={handlePrevChapter}
            prevBtnDisabled={prevBtnDisabled}
            handleNextChapter={handleNextChapter}
            nextBtnDisabled={nextBtnDisabled}
          />
        </div>
      </div>

      {/* Chapter content */}
      <ChapterContent chapterContent={chapterContent} highlightVerse={highlightVerse} />

      {/* Bottom Prev and Next Chapter buttons */}
      <div className="row control-wrapper">
        <div className="right">
          <ContentNavigator
            handlePrevChapter={handlePrevChapter}
            prevBtnDisabled={prevBtnDisabled}
            handleNextChapter={handleNextChapter}
            nextBtnDisabled={nextBtnDisabled}
          />
        </div>
      </div>
    </section>
  );
}

export default BibleContent;
