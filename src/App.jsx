import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import SavingsForm from './components/SavingsForm';
import SyncModal from './components/SyncModal';
import LoadingScreen from './components/LoadingScreen';
import { Users } from 'lucide-react';
import { migrateLocalToRemote } from './lib/storage';
import './App.css';

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSyncOpen, setIsSyncOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [syncCode, setSyncCode] = useState(localStorage.getItem('sync_code') || '');
  const [isLoading, setIsLoading] = useState(!sessionStorage.getItem('has_loaded'));

  const handleLoadingFinished = () => {
    sessionStorage.setItem('has_loaded', 'true');
    setIsLoading(false);
  };

  const handleSaved = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleUpdateSyncCode = async (code) => {
    try {
      if (code) {
        await migrateLocalToRemote(code);
        localStorage.setItem('sync_code', code);
      } else {
        localStorage.removeItem('sync_code');
      }
      setSyncCode(code);
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      alert('Gagal menyinkronkan data: ' + err.message + '\n\nPastikan koneksi internet stabil atau coba gunakan kode baru.');
    }
  };

  return (
    <div className="app-shell">
      <nav className="top-nav">
        <div className="nav-left">
          <img src="logo.png" alt="Logo" className="nav-logo" />
          <h1 className="glass-title">E-Money</h1>
        </div>
        <button 
          className={`sync-trigger ${syncCode ? 'active' : ''}`} 
          onClick={() => setIsSyncOpen(true)}
        >
          <Users size={20} />
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

      {isLoading && <LoadingScreen onFinished={handleLoadingFinished} />}
      
      <div className="app-version">v4.0.0</div>
    </div>
  );
}

export default App;
