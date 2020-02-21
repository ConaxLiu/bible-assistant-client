import React, { useState, useEffect } from "react";
import axios from "axios";
import './Search.css'
import BookSelect from './BookSelect'
import ChapterSelect from './ChapterSelect'
import SearchPhraseEntry from './SearchPhraseEntry'
import SearchResult from './SearchResult'

function Search() {
  const [bookNames, setBookNames] = useState([]);
  const [bookName, setBookName] = useState("wholeBible");
  const [chapterNos, setChapterNos] = useState([]);
  const [chapterNo, setChapterNo] = useState("wholeBook");
  const [searchedText, setSearchedText] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const SERVER_URL = "https://conaxbibleservice.azurewebsites.net"
  //const SERVER_URL = "http://10.0.0.8:3000"

  // This useEffect is only for initializing default values for the controls.
  // We will fetch the list of Bible book names along with the chapter numbers.
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

  // If a book is selected, we need to update the chapter numbers selection for the selected book.
  // Otherwise we will select 'wholeBook' for the chapter selection box.
  const handleBookChange = (e) => {
    console.log("handleBookChange")
    const newBookName = e.target.value;
    let newChapterNo = 'wholeBook'
    
    setBookName(newBookName)

    if(newBookName === 'wholeBible') {
      setChapterNos([])
      setChapterNo('wholeBook')
    }
    else {
      const newChapterNos = bookNames.find(book => book.bookName === newBookName).chapters
      setChapterNos(newChapterNos)
      
      if(document.getElementById('chapter'))
        newChapterNo = parseInt(document.getElementById('chapter').value)

      if(newChapterNo > newChapterNos.length) {
        newChapterNo = newChapterNos.length
        setChapterNo(newChapterNo)
      }
    }
  }

  const handleChapterChange = (e) => {
    console.log("handleChapterChange")
    const newChapterNo = parseInt(e.target.value)
    setChapterNo(newChapterNo)
  }

  const handleSearchTextChange = (e) => {
    setSearchedText(e.target.value)
  }

  const handleSearchClick = () => {
    // If user did not enter a search phrase, just exit without perform a search.
    const selectedPhrase = document.getElementById('phraseToSearch').value.trim();
    if(selectedPhrase === '') return 
    setSearchedText(selectedPhrase)

    const selectedBook = document.getElementById('book').value;
    let selectedChapter = 'wholeBook'

    // The chapter selection will not exist if user has selected to search the whole Bible
    // so we need to test its existence before using its value
    if(document.getElementById('chapter'))
      selectedChapter = document.getElementById('chapter').value;

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
        setSearchResult(resp.data);
      })
      .catch(error => {
        console.log(error);
      });
  }

  return (
    <section className="container" id="bible-content-wrapper">
      {/* Book, Chapter selectors, and search phrase entry field */}
      <div className="row control-wrapper">
        <BookSelect bookNames={bookNames} bookName={bookName} handleBookChange={handleBookChange} includeAll={true} />
        <ChapterSelect chapterNos={chapterNos} chapterNo={chapterNo} handleChapterChange={handleChapterChange} includeAll={true} />
        <SearchPhraseEntry handleSearchTextChange={handleSearchTextChange} handleSearchClick={handleSearchClick} searchedText={searchedText} />
      </div>

      {/* Search result */}
      <SearchResult searchResult={searchResult} searchedText={searchedText} />
    </section>
  );
}

export default Search;
