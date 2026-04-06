export const getSavings = () => {
  const data = localStorage.getItem('savings_records');
  return data ? JSON.parse(data) : [];
};

export const saveSaving = (record) => {
  const records = getSavings();
  const newRecord = {
    id: Date.now().toString(),
    ...record,
    type: record.type || 'income', // Default to income for compatibility
    date: record.date || new Date().toISOString(),
  };
  localStorage.setItem('savings_records', JSON.stringify([...records, newRecord]));
  return newRecord;
};

export const deleteSaving = (id) => {
  const records = getSavings();
  localStorage.setItem('savings_records', JSON.stringify(records.filter(r => r.id !== id)));
};
