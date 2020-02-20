import React from "react";
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import "./App.css";
import HeaderContent from './components/headers/HeaderContent'
import BibleContent from './components/mains/BibleContent';
import Search from './components/mains/Search'
import FooterContent from './components/footers/FooterContent'

function App() {

  return (
    <BrowserRouter>
      <div className="App">
        <header>
          <HeaderContent />
        </header>
        
        <main>
          <Switch>
            <Route path='/' exact component={BibleContent} />
            {/* <Route path='/bible/' component={BibleContent} />
            <Route path='/index.html' component={BibleContent} /> */}
            <Route path='/search' component={Search} />
          </Switch>
        </main>

        <footer className="page-footer transparent">
          <FooterContent />
        </footer>
        
      </div>
    </BrowserRouter>
  );
}

export default App;
