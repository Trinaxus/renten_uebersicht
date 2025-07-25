import { useState, useEffect } from 'react';
import { PensionData } from '../types/pension';

const STORAGE_KEY = 'pension-data';

export const usePensionData = () => {
  const [data, setData] = useState<PensionData[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading pension data:', error);
        setData([]);
      }
    }
  }, []);

  const saveData = (newData: PensionData[]) => {
    setData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  };

  const addEntry = (entry: Omit<PensionData, 'id' | 'createdAt'>) => {
    const newEntry: PensionData = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    const newData = [...data, newEntry].sort((a, b) => a.year - b.year);
    saveData(newData);
  };

  const deleteEntry = (id: string) => {
    const newData = data.filter(entry => entry.id !== id);
    saveData(newData);
  };

  const updateEntry = (id: string, updatedData: Partial<PensionData>) => {
    const newData = data.map(entry => 
      entry.id === id ? { ...entry, ...updatedData } : entry
    );
    saveData(newData);
  };

  const importData = (csvData: PensionData[]) => {
    const mergedData = [...data];
    csvData.forEach(newEntry => {
      const existingIndex = mergedData.findIndex(entry => entry.year === newEntry.year);
      if (existingIndex >= 0) {
        mergedData[existingIndex] = { ...newEntry, id: mergedData[existingIndex].id };
      } else {
        mergedData.push({ ...newEntry, id: crypto.randomUUID(), createdAt: new Date().toISOString() });
      }
    });
    const sortedData = mergedData.sort((a, b) => a.year - b.year);
    saveData(sortedData);
  };

  return { data, addEntry, deleteEntry, updateEntry, importData };
};