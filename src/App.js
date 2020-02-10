import React from "react";
import "./App.css";
import BibleContent from "./components/BibleContent";

function App() {
  return (
    <div className="App">
      <header>
        <div className="logo"><span>Conax Bible Assistant</span></div>
        <nav>
          <ul className="navigation">
            <li>One</li>
            <li>Two</li>
            <li>Three</li>
            <li>Four</li>
          </ul>
        </nav>
      </header>
      <section>
        <div className="contentCol leftPane">
          <BibleContent />
        </div>
        <div className="contentCol rightPane">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nisi fuga
          ullam, praesentium asperiores laboriosam est doloribus labore dicta
          illo quia deleniti distinctio saepe accusantium illum recusandae, unde
          debitis molestias. Consequatur?
        </div>
      </section>
      <footer>
        <div className="footerItem">
          Copyright &copy; 2020 Conax Software Development Ltd
        </div>
      </footer>
    </div>
  );
}

export default App;
