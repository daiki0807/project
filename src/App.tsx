import React from 'react';
import { Board } from './components/Board';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8">作戦ボード</h1>
        <Board />
      </div>
    </div>
  );
}

export default App;