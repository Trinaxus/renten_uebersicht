import React, { useRef } from 'react';
import { Download, Upload } from 'lucide-react';
import { PensionData } from '../types/pension';

interface CSVHandlerProps {
  data: PensionData[];
  onImport: (data: PensionData[]) => void;
}

const CSVHandler: React.FC<CSVHandlerProps> = ({ data, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    if (data.length === 0) {
      alert('Keine Daten zum Exportieren vorhanden.');
      return;
    }

    const headers = [
      'Jahr',
      'Entgeltpunkte',
      'Rente_jetzt',
      'Rente_hochgerechnet',
      'Erwerbsminderungsrente (€)',
      'Status',
      'Rentenbeginn_geplant',
      'Abschlaege_Monat',
      'Inflationserwartung',
      'Bruttoeinkommen',
      'Beitrag_Eigen',
      'Beitrag_Arbeitgeber',
      'Beitrag_Kassen',
      'Gesamtbeitrag',
      'Kindererziehungszeiten',
      'Ausbildungszeiten',
      'Zusatzvorsorge',
      'Zusatzvorsorge_Details',
      'Kommentar'
    ];

    const csvContent = [
      headers.join(','),
      ...data.map(entry => [
        entry.year,
        entry.entgeltpunkte,
        entry.currentClaim,
        entry.projection,
        entry.disabilityPension,
        `"${entry.status}"`,
        entry.retirementAge,
        entry.earlyRetirementDeduction || 0,
        entry.inflationExpectation || 0,
        entry.annualGrossIncome || 0,
        entry.ownContribution || 0,
        entry.employerContribution || 0,
        entry.insuranceContribution || 0,
        entry.totalContribution || 0,
        entry.childCareYears || 0,
        entry.educationYears || 0,
        entry.additionalPension ? 'Ja' : 'Nein',
        `"${entry.additionalPensionDetails || ''}"`,
        `"${entry.comment || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `renteninformation_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          alert('Die CSV-Datei enthält keine gültigen Daten.');
          return;
        }

        const headers = lines[0].split(',');
        const importedData: PensionData[] = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',');
          if (values.length >= 7) { // Mindestens die Grundfelder
            const entry: PensionData = {
              id: crypto.randomUUID(),
              year: parseInt(values[0]),
              entgeltpunkte: parseFloat(values[1]),
              currentClaim: parseFloat(values[2]),
              projection: parseFloat(values[3]),
              disabilityPension: parseFloat(values[4]),
              status: values[5].replace(/"/g, ''),
              retirementAge: values[6] ? parseInt(values[6]) : 67,
              
              // Erweiterte Felder (optional)
              earlyRetirementDeduction: values[7] ? parseFloat(values[7]) : undefined,
              inflationExpectation: values[8] ? parseFloat(values[8]) : undefined,
              annualGrossIncome: values[9] ? parseFloat(values[9]) : undefined,
              ownContribution: values[10] ? parseFloat(values[10]) : undefined,
              employerContribution: values[11] ? parseFloat(values[11]) : undefined,
              insuranceContribution: values[12] ? parseFloat(values[12]) : undefined,
              totalContribution: values[13] ? parseFloat(values[13]) : undefined,
              childCareYears: values[14] ? parseFloat(values[14]) : undefined,
              educationYears: values[15] ? parseFloat(values[15]) : undefined,
              additionalPension: values[16] === 'Ja',
              additionalPensionDetails: values[17] ? values[17].replace(/"/g, '') : undefined,
              comment: values[18] ? values[18].replace(/"/g, '') : undefined,
              
              createdAt: new Date().toISOString()
            };

            if (!isNaN(entry.year) && entry.year > 1950 && entry.year < 2100) {
              importedData.push(entry);
            }
          }
        }

        if (importedData.length > 0) {
          onImport(importedData);
          alert(`${importedData.length} Einträge erfolgreich importiert.`);
        } else {
          alert('Keine gültigen Daten in der CSV-Datei gefunden.');
        }
      } catch (error) {
        console.error('Import error:', error);
        alert('Fehler beim Importieren der CSV-Datei. Bitte überprüfen Sie das Format.');
      }
    };

    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        CSV Import/Export
      </h2>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleExport}
          disabled={data.length === 0}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <Download className="h-4 w-4 mr-2" />
          CSV Exportieren
        </button>

        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleImport}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 dark:bg-teal-600 hover:bg-blue-700 dark:hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-teal-500 transition-colors duration-200"
          >
            <Upload className="h-4 w-4 mr-2" />
            CSV Importieren
          </button>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p className="mb-2">
          <strong>CSV Format (Grundfelder):</strong> Jahr, Entgeltpunkte, Rente_jetzt, Rente_hochgerechnet, 
          Erwerbsminderungsrente, Status, Rentenbeginn_geplant
        </p>
        <p className="mb-2">
          <strong>Erweiterte Felder:</strong> Abschlaege_Monat, Inflationserwartung, Bruttoeinkommen, 
          Beitrag_Eigen, Beitrag_Arbeitgeber, Beitrag_Kassen, Gesamtbeitrag, Kindererziehungszeiten, 
          Ausbildungszeiten, Zusatzvorsorge, Zusatzvorsorge_Details, Kommentar
        </p>
        <p>
          Beim Import werden bestehende Einträge für das gleiche Jahr überschrieben.
        </p>
      </div>
    </div>
  );
};

export default CSVHandler;