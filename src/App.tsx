import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { usePensionData } from './hooks/usePensionData';
import Header from './components/Header';
import DataForm from './components/DataForm';
import DataTable from './components/DataTable';
import DataChart from './components/DataChart';
import CSVHandler from './components/CSVHandler';
import { BarChart3, Table, FileText, Settings } from 'lucide-react';

const AppContent: React.FC = () => {
  const { data, addEntry, deleteEntry, updateEntry, importData } = usePensionData();
  const [activeTab, setActiveTab] = useState<'form' | 'table' | 'chart' | 'csv'>('form');

  const tabs = [
    { id: 'form' as const, label: 'Eingabe', icon: FileText },
    { id: 'table' as const, label: 'Tabelle', icon: Table },
    { id: 'chart' as const, label: 'Diagramm', icon: BarChart3 },
    { id: 'csv' as const, label: 'Import/Export', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-500 dark:bg-teal-500 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'form' && (
            <DataForm onAddEntry={addEntry} />
          )}

          {activeTab === 'table' && (
            <DataTable 
              data={data} 
              onDeleteEntry={deleteEntry} 
              onUpdateEntry={updateEntry}
            />
          )}

          {activeTab === 'chart' && (
            <DataChart data={data} />
          )}

          {activeTab === 'csv' && (
            <CSVHandler data={data} onImport={importData} />
          )}
        </div>

        {/* Statistics */}
        {data.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Gesamte Einträge
              </h3>
              <p className="text-3xl font-bold text-blue-600 dark:text-teal-500">
                {data.length}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Höchste Hochrechnung
              </h3>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {Math.max(...data.map(d => d.projection)).toLocaleString('de-DE', { 
                  style: 'currency', 
                  currency: 'EUR',
                  maximumFractionDigits: 0
                })}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Zeitspanne
              </h3>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {Math.min(...data.map(d => d.year))} - {Math.max(...data.map(d => d.year))}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;