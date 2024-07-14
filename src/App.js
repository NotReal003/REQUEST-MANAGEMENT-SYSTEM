// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ReportForm from './pages/ReportForm';
import Support from './pages/Support';
import Apply from './pages/Apply';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container mx-auto p-4">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/report" component={ReportForm} />
            <Route path="/support" component={Support} />
            <Route path="/apply" component={Apply} />
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;
