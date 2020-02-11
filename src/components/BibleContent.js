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
  //const SERVER_URL = "http://localhost:3000"

  // This useEffect is only for initializing default values for the controls
  // We will get the list of Bible book names along with the chapter numbers.
  // This should then allow the book and chapter selection dropdowns to be populated.
  // Finally it will retrieve the chapter content of the 
  // first chapter in the first book so that can be populated too.
  useEffect(() => {
    console.log("Initializing")
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
    <div id="bible-content-wrapper">
      <div className="control-wrapper">
        <select name="book" id="book" value={bookName} onChange={handleBookChange} >
          {bookNames.map(book => (
            <option key={book.bookName} value={book.bookName}>
              {book.bookName}
            </option>
          ))}
        </select>
        <span>第</span>
        <select name="chapter" id="chapter" value={chapterNo} onChange={handleChapterChange} >
          {chapterNos.map(chapterNo => (
            <option key={chapterNo} value={chapterNo}>{chapterNo}</option>
          ))}
        </select>
        <span>章</span>
        <button className="btnPrev" onClick={handlePrevChapter} disabled={prevBtnDisabled} >上一章</button>
        <button className="btnNext" onClick={handleNextChapter} disabled={nextBtnDisabled} >下一章</button>
      </div>
      <div id="bible-content">
        {Object.entries(chapterContent).map(([verseNo, verseText]) => (
          <span key={verseNo}>
            <span className="verseNo">
              {verseNo}
              <span className="verseText">{verseText}</span>
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default BibleContent;

// useEffect(() => {
//   console.log("useEffect");

//   setBookNames([{bookName:"創世紀",chapters:[1,2,3]}, {bookName:"出埃及紀",chapters:[1,2,3,4,5,6]}])

//   //getBookNames();
//   // getChapterNos(bookName, chapterNo);

//   return () => {};
// }, [bookName, chapterNo]);

// const getBookNames = () => {
//   console.log("getBookNames");

//   if (bookNames.length === 0) {
//     axios
//       .get("http://localhost:3000/api/contents/booknames")
//       .then(resp => {
//         setBookNames(resp.data);

//         console.log(resp.data.find(book => book.bookName === bookName).chapters)
//         // resp.data.find(book => book.bookName === bookName).chapters.map(chap => (
//         //   <option key={chap} value={chap}>{chap}</option>
//         // ))
//         const test = resp.data.find(book => book.bookName === bookName).chapters.map(chap => `<options> ${chap} </options>`)
//         console.log(test)

//       })
//       .catch(error => {
//         console.log(error);
//       });
//   }
// };

// // const getChapterNos = (selectedBook, selectedChapter) => {
// //   console.log(`getChapterNos for ${selectedBook}`);

// //   axios
// //     .get(`http://localhost:3000/api/contents/${selectedBook}/chapterNumbers`)
// //     .then(resp => {
// //       const fetchedChapterNos = resp.data;
// //       console.log("getChapterNos data: ", fetchedChapterNos);
// //       setChapterNos(fetchedChapterNos);

// //       if (fetchedChapterNos.indexOf(selectedChapter) === -1)
// //         selectedChapter = fetchedChapterNos[fetchedChapterNos.length - 1];

// //       getSelectedChapter(selectedBook,
// //         bookNames,
// //         selectedChapter,
// //         chapterNos
// //       );
// //     })
// //     .catch(error => {
// //       console.log(error);
// //     });
// // };

// // const getSelectedChapter = (bookName, bookNames, chapterNo, chapterNos) => {
// //   console.log("getSelectedChapter", bookName, bookNames, chapterNo, chapterNos);

// //   axios
// //     .get(`http://localhost:3000/api/contents/${bookName}/${chapterNo}`)
// //     .then(resp => {
// //       setChapterContent(resp.data);

// //       const bookIndex = bookNames.indexOf(bookName);
// //       const chapterIndex = chapterNos.indexOf(chapterNo);
// //       toggleChapterButtons(
// //         bookIndex,
// //         bookNames.length - 1,
// //         chapterIndex,
// //         chapterNo.length - 1
// //       );
// //     })
// //     .catch(error => {
// //       console.log(error);
// //     });
// // };

// // const toggleChapterButtons = (
// //   bookIndex,
// //   maxBookIndex,
// //   chapterIndex,
// //   maxChapterIndex
// // ) => {
// //   setPrevBtnDisabled(bookIndex === 0 && chapterIndex === 0);
// //   setNextBtnDisabled(
// //     bookIndex === maxBookIndex && chapterIndex === maxChapterIndex
// //   );
// // };

// const handleBookNameChange = e => {
// //   const selectedBook = e.target.value;
// //   const selectedChapter = document.getElementById("chapter").value;

// //   setBookName(selectedBook);
// //   getChapterNos(selectedBook, selectedChapter);
// };

// const handleChapterChange = e => {
// //   console.log("handleChapterChange");
// //   const selectedBook = document.getElementById("book").value;
// //   const selectedChapter = e.target.value;
// //   setChapterNo(selectedChapter);
// //   getSelectedChapter(selectedBook, bookNames, selectedChapter, chapterNos);
// };

// const handlePrevChapter = () => {
// //   console.log("handlePrevChapter");
// //   const currBookIndex = bookNames.indexOf(bookName);
// //   const currChapterNo = parseInt(chapterNo);

// //   // If we are at the first chapter of current book,
// //   // and the current book is not the firts book
// //   // then we need to go to the last chapter of previous book
// //   // otherwise we can just go to the previous chapter of current book
// //   if (currChapterNo > 1) {
// //     setChapterNo((currChapterNo - 1).toString());
// //     toggleChapterButtons();
// //   } else {
// //     if (currBookIndex > 0) {
// //       const prevBookName = bookNames[currBookIndex - 1];
// //       setBookName(prevBookName);
// //       getChapterNos(prevBookName, 999);
// //     }
// //   }
// };

// const handleNextChapter = () => {
// //   console.log("handleNextChapter");
// //   const currBookIndex = bookNames.indexOf(bookName);
// //   const currChapterNo = parseInt(chapterNo);

// //   console.log(currChapterNo, chapterNos.length);
// //   // If we are at the last chapter of current book,
// //   // and the current book is not the last book
// //   // then we need to go to the first chapter of next book
// //   // otherwise we can just go to the next chapter of current book
// //   if (currChapterNo < chapterNos.length) {
// //     setChapterNo((currChapterNo + 1).toString());
// //     toggleChapterButtons();
// //   } else {
// //     if (currBookIndex < bookNames.length - 1) {
// //       const nextBookName = bookNames[currBookIndex + 1];
// //       setBookName(nextBookName);
// //       getChapterNos(nextBookName, 1);
// //     }
// //   }
// };