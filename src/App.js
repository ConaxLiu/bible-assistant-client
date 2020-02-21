import React from "react";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import "./App.css";
import Header from './components/header/Header'
import BibleContent from './components/main/BibleContent';
import Search from './components/main/Search'
import Footer from './components/footer/Footer'

function App() {

  return (
    <Router>
      <div className="App container">
        <Header />
        
        <main>
          <Switch>
            <Route path='/' exact component={BibleContent} />
            <Route path='/search' component={Search} />
          </Switch>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
