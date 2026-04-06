import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import SavingsForm from './components/SavingsForm';
import SyncModal from './components/SyncModal';
import { Share2 } from 'lucide-react';
import './App.css';

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSyncOpen, setIsSyncOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [syncCode, setSyncCode] = useState(localStorage.getItem('sync_code') || '');

  const handleSaved = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleUpdateSyncCode = (code) => {
    setSyncCode(code);
    if (code) {
      localStorage.setItem('sync_code', code);
    } else {
      localStorage.removeItem('sync_code');
    }
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="app-shell">
      <nav className="top-nav">
        <div className="nav-left">
          <img src="/logo.png" alt="Logo" className="nav-logo" />
          <h1 className="glass-title">E-Money</h1>
        </div>
        <button 
          className={`sync-trigger ${syncCode ? 'active' : ''}`} 
          onClick={() => setIsSyncOpen(true)}
        >
          <Share2 size={20} />
          {syncCode && <span className="sync-indicator"></span>}
        </button>
      </nav>
      
      <main className="content">
        <Dashboard 
          key={refreshKey} 
          onAddClick={() => setIsFormOpen(true)} 
          onDelete={handleSaved} 
          syncCode={syncCode}
        />
      </main>

      <SavingsForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSaved={handleSaved}
        syncCode={syncCode}
      />

      <SyncModal 
        isOpen={isSyncOpen}
        onClose={() => setIsSyncOpen(false)}
        syncCode={syncCode}
        onUpdateSyncCode={handleUpdateSyncCode}
      />
    </div>
  );
}

export default App;
