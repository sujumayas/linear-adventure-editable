import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Game from './components/Game';
import GameEditor from './components/GameEditor';

function App() {
  return (
    <Router>
      <div style={{padding: '20px'}}>
        <h1>Linear Adventure</h1>
        <nav>
          <ul>
            <li>
              <Link to="/">Game</Link>
            </li>
            <li>
              <Link to="/edit">Editor</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/" exact component={Game} />
          <Route path="/edit" component={GameEditor} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;