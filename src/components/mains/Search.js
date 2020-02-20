import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import './Search.css'

function Search(props) {
  const [bookNames, setBookNames] = useState([]);
  const [bookName, setBookName] = useState("wholeBible");
  const [chapterNos, setChapterNos] = useState([]);
  const [chapterNo, setChapterNo] = useState("wholeBook");
  const [searchResult, setSearchResult] = useState({count:0, data:[]});
  const [chapterSelectClass, setChapterSelectClass] = useState('hide');
  const [searchResultClass, setSearchResultClass] = useState('row hide');

  //const SERVER_URL = "https://conaxbibleservice.azurewebsites.net"
  const SERVER_URL = "http://10.0.0.8:3000"

  // This useEffect is only for initializing default values for the controls
  // We will get the list of Bible book names along with the chapter numbers.
  // This should then allow the book and chapter selection dropdowns to be populated.
  useEffect(() => {
    console.log("Initializing")
    console.log(`${SERVER_URL}/api/contents/booknames`)

    axios
      .get(`${SERVER_URL}/api/contents/booknames`)
      .then(resp => {
        const data = resp.data;
        setBookNames(data);
      })
      .catch(error => {
        console.log(error);
      });
  }, [])

  // If a book is selected, we need to update the chapter numbers for the selected book.
  // Otherwise we will select 'Whole Book' for the chapter selection box.
  const handleBookChange = (e) => {
    console.log("handleBookChange")
    const newBookName = e.target.value;
    
    setBookName(newBookName)

    if(newBookName === 'wholeBible') {
      setChapterNos([])
      setChapterNo('wholeBook')
      setChapterSelectClass('hide')
    }
    else {
      const newChapterNos = bookNames.find(book => book.bookName === newBookName).chapters
      setChapterNos(newChapterNos)
      let newChapterNo = parseInt(document.getElementById('chapter').value)

      if(newChapterNo > newChapterNos.length) {
        newChapterNo = newChapterNos.length
        setChapterNo(newChapterNo)
      }
      setChapterSelectClass('')
    }
  }

  const handleChapterChange = (e) => {
    console.log("handleChapterChange")
    const newChapterNo = parseInt(e.target.value)
    setChapterNo(newChapterNo)
  }

  const handleSearchClick = () => {
    const selectedBook = document.getElementById('book').value;
    const selectedChapter = document.getElementById('chapter').value;
    const selectedPhrase = document.getElementById('phraseToSearch').value.trim();

    // No search phrase entered, just exit
    if(selectedPhrase === '') return 

    // Build up search URL
    let searchUrl = `${SERVER_URL}/api/search/`;

    if(selectedBook === 'wholeBible') {
      searchUrl += `bible/${selectedPhrase}`
    }
    else  {
      if (selectedChapter === 'wholeBook') {
        searchUrl += `book/${selectedBook}/${selectedPhrase}`
      }
      else {
        searchUrl += `chapter/${selectedBook}/${selectedChapter}/${selectedPhrase}`
      }
    }

    console.log(searchUrl)

    // Fetch the search result from server
    axios
      .get(searchUrl)
      .then(resp => {
        console.log("Search Result",resp.data)
        setSearchResult(resp.data);
        setSearchResultClass('row')
      })
      .catch(error => {
        console.log(error);
      });
  }

  return (
    <section className="container" id="bible-content-wrapper">
      {/* Book and Chapter selectors, top Prev and Next Chapter buttons */}
      <div className="row control-wrapper">
        <div className="input-field col">
          <select className="browser-default" name="book" id="book" value={bookName} onChange={handleBookChange} >
            <option key={"wholeBible"} value={"wholeBible"}>全本聖經</option>
            {bookNames.map(book => (<option key={book.bookName} value={book.bookName}>{book.bookName}</option>))} 
          </select>
        </div>

        <div className={chapterSelectClass}>
          <div className="input-field col selectLabel">第</div>
          <div className="input-field col">
            <select className="browser-default" name="chapter" id="chapter" value={chapterNo} onChange={handleChapterChange} >
              <option key={"wholeBook"} value={"wholeBook"}>全本書</option>
              {chapterNos.map(chapterNo => (<option key={chapterNo} value={chapterNo}>{chapterNo}</option>))}
            </select>
          </div>
          <div className="input-field col selectLabel">章</div>
        </div>
        
        <div className="input-field col">
          <div className="search-wrapper focused">
            <input type="text" id="phraseToSearch" placeholder="搜索詞彙" />
          </div>
        </div>

        <div className="input-field col">
          <button className="btn waves-effect grey" onClick={handleSearchClick} ><i className="material-icons">search</i></button>
        </div>

      </div>

      {/* Search result */}
      <div className={searchResultClass} id="search-result">
        <div className="resultSummary">總共有 {searchResult.count} 節經文包含了您的搜索詞彙</div>

        <ul className="collection">
        {searchResult.data.map(({bookName, chapterNo, verseNo, verse}, index) => (
          <li key={index} className="collection-item">

            <div className="row verseLocation">
              <div className="col">{bookName} {chapterNo}:{verseNo}</div>
              <div className="col right"><Link to=""><i className="material-icons">label_important</i></Link></div>
            </div>
            
            <div className="row verseText">{verse}</div>
          </li>
        ))}
        </ul>
      </div>

    </section>
  );
}

export default Search;
