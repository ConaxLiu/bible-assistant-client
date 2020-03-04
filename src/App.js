import React from "react";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import "./App.css";
import Header from './components/header/Header'
import BibleContent from './components/main/BibleContent';
import Search from './components/main/Search'
import Footer from './components/footer/Footer'

function App() {
  const SERVER_URL = "https://conaxbibleservice.azurewebsites.net"
  //const SERVER_URL = "http://10.0.0.8:3000"

return (
    <Router>
      <div className="App container">
        <Header />
        
        <main>
          <Switch>
            <Route path='/' exact render={(props) => <BibleContent {...props} serverUrl={SERVER_URL} />} />
            <Route path='/index.html' exact render={(props) => <BibleContent {...props} serverUrl={SERVER_URL} />} />
            <Route path='/search' exact render={(props) => <Search {...props} serverUrl={SERVER_URL} />} />
          </Switch>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
