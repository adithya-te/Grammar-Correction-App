/**
 * Main React App Component
 * Entry point for the grammar correction application
 */

import React from 'react';
import GrammarChecker from './components/GrammarChecker';
import './App.css';

function App() {
  return (
    <div className="App">
      <GrammarChecker />
    </div>
  );
}

export default App;