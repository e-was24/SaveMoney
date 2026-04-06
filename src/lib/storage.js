import { supabase } from './supabase';

const getDeviceId = () => {
  let id = localStorage.getItem('device_id');
  if (!id) {
    id = Date.now().toString() + Math.random().toString(36).substring(2, 7);
    localStorage.setItem('device_id', id);
  }
  return id;
};

export const getSavings = async (syncCode = '') => {
  if (syncCode) {
    const { data, error } = await supabase
      .from('savings')
      .select('*')
      .eq('sync_code', syncCode)
      .order('date', { ascending: true });
    
    if (!error && data) return data;
  }
  
  const data = localStorage.getItem('savings_records');
  return data ? JSON.parse(data) : [];
};

export const saveSaving = async (record, syncCode = '') => {
  const deviceId = getDeviceId();
  const newRecord = {
    id: Date.now().toString(),
    ...record,
    type: record.type || 'income',
    date: record.date || new Date().toISOString(),
  };

  if (syncCode) {
    // Check device limit first
    const { data: devices } = await supabase
      .from('devices')
      .select('device_id')
      .eq('sync_code', syncCode);
    
    const deviceIds = devices?.map(d => d.device_id) || [];
    if (deviceIds.length >= 3 && !deviceIds.includes(deviceId)) {
      throw new Error('Limit 3 perangkat tercapai.');
    }

    // Register device if new
    if (!deviceIds.includes(deviceId)) {
      await supabase.from('devices').insert({ sync_code: syncCode, device_id: deviceId });
    }

    const { error } = await supabase
      .from('savings')
      .insert({ ...newRecord, sync_code: syncCode });
    
    if (error) throw error;
  }

  const records = JSON.parse(localStorage.getItem('savings_records') || '[]');
  localStorage.setItem('savings_records', JSON.stringify([...records, newRecord]));
  return newRecord;
};

export const deleteSaving = async (id, syncCode = '') => {
  if (syncCode) {
    await supabase
      .from('savings')
      .delete()
      .eq('id', id)
      .eq('sync_code', syncCode);
  }

  const records = JSON.parse(localStorage.getItem('savings_records') || '[]');
  localStorage.setItem('savings_records', JSON.stringify(records.filter(r => r.id !== id)));
};
