import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import './App.css';

import Header from '../header/header';
import TodosShowcase from '../todos-showcase/todos-showcase';
import BucketsShowcase from '../buckets-showcase/buckets-showcase';
import Home from '../home/home';
import Footer from '../footer/footer';

function App() {
  return (
    <div className="wrapper">
      <Header />

      <div className="content-div">
      <Router>
        <Switch>
          <Route path="/todos">
            <TodosShowcase />
          </Route>
          <Route path="/buckets">
            <BucketsShowcase />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
      </div>
      
      <Footer />
    </div>
  );
}

export default App;
