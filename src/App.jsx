import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import SavingsForm from './components/SavingsForm';
import './App.css';

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSaved = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="app-shell">
      <nav className="top-nav">
        <h1 className="glass-title">SaveMoney</h1>
      </nav>
      
      <main className="content">
        <Dashboard 
          key={refreshKey} 
          onAddClick={() => setIsFormOpen(true)} 
          onDelete={handleSaved} 
        />
      </main>

      <SavingsForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSaved={handleSaved}
      />
    </div>
  );
}

export default App;
