import React, { useState } from 'react';
import { X } from 'lucide-react';
import { saveSaving } from '../lib/storage';

const SavingsForm = ({ isOpen, onClose, onSaved }) => {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount) return;

    saveSaving({
      amount: parseFloat(amount),
      note,
      date: new Date(date).toISOString(),
    });

    setAmount('');
    setNote('');
    onSaved();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content glass">
        <div className="modal-header">
          <h3>Tambah Tabungan</h3>
          <button onClick={onClose} className="close-btn"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="saving-form">
          <div className="form-group">
            <label>Jumlah (IDR)</label>
            <input 
              type="number" 
              placeholder="Contoh: 50000" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="glass-input"
            />
          </div>
          <div className="form-group">
            <label>Keterangan</label>
            <input 
              type="text" 
              placeholder="Contoh: Jajan hemat" 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="glass-input"
            />
          </div>
          <div className="form-group">
            <label>Tanggal</label>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="glass-input"
            />
          </div>
          <button type="submit" className="submit-btn bg-primary">Simpan</button>
        </form>
      </div>
    </div>
  );
};

export default SavingsForm;
