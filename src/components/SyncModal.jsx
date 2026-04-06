import React, { useState } from 'react';
import { Share2, Copy, Check, X, Smartphone } from 'lucide-react';

const SyncModal = ({ isOpen, onClose, syncCode, onUpdateSyncCode }) => {
  const [inputCode, setInputCode] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(syncCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnect = () => {
    if (inputCode.length === 6) {
      onUpdateSyncCode(inputCode.toUpperCase());
      setInputCode('');
    }
  };

  const generateNewCode = () => {
    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    onUpdateSyncCode(newCode);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass">
        <div className="modal-header">
          <div className="header-with-icon">
            <Share2 size={24} className="text-primary" />
            <h3>Tautkan Perangkat</h3>
          </div>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="sync-body">
          {syncCode ? (
            <div className="active-sync-card glass">
              <span className="sync-label">Kode Sinkronisasi Anda:</span>
              <div className="code-display">
                <span className="the-code">{syncCode}</span>
                <button className="icon-btn" onClick={handleCopy}>
                  {copied ? <Check size={18} className="text-income" /> : <Copy size={18} />}
                </button>
              </div>
              <p className="sync-hint">Bagikan kode ini ke perangkat lain (Maks 3).</p>
              <button className="text-btn danger" onClick={() => onUpdateSyncCode('')}>
                Putuskan Sambungan
              </button>
            </div>
          ) : (
            <div className="setup-sync">
              <div className="input-group">
                <label>Masukkan Kode dari Perangkat Lain:</label>
                <div className="input-with-btn">
                  <input 
                    type="text" 
                    placeholder="Contoh: AB12CD" 
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                    maxLength={6}
                    className="glass-input"
                  />
                  <button 
                    className="submit-btn mini" 
                    disabled={inputCode.length !== 6}
                    onClick={handleConnect}
                  >Hubungkan</button>
                </div>
              </div>

              <div className="divider"><span>ATAU</span></div>

              <button className="submit-btn outline" onClick={generateNewCode}>
                Buat Kode Baru
              </button>
              <p className="sync-note">Gunakan ini jika ingin memulai sinkronisasi baru.</p>
            </div>
          )}

          <div className="device-info">
            <div className="info-header">
              <Smartphone size={16} />
              <span>Status Perangkat</span>
            </div>
            <div className="device-limit-msg">
              Bisa menautkan hingga 3 perangkat secara real-time.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyncModal;
