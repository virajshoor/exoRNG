/**
 * Main App Component
 * Wraps the application with error boundary and security features
 */

import React from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import RandomNumberGenerator from './components/RandomNumberGenerator';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <div className="App">
        <RandomNumberGenerator />
      </div>
    </ErrorBoundary>
  );
}

export default App;
