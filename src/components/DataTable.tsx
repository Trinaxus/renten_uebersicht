import React from 'react';
import { Trash2, Eye, EyeOff, Edit, Check, X } from 'lucide-react';
import { PensionData } from '../types/pension';

interface EditableCellProps {
  value: any;
  field: string;
  onUpdate: (field: string, value: any) => void;
  type?: string;
  options?: string[];
  placeholder?: string;
}

const EditableCell: React.FC<EditableCellProps> = ({ value, field, onUpdate, type = 'text', options, placeholder = '' }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedValue, setEditedValue] = React.useState(value);

  const handleSave = () => {
    let processedValue: any = editedValue;
    if (type === 'number') {
      processedValue = parseFloat(editedValue) || 0;
    } else if (type === 'boolean') {
      processedValue = editedValue === 'true';
    }
    onUpdate(field, processedValue);
    setIsEditing(false);
  };

  if (!isEditing) {
    let displayValue = value;
    if (type === 'boolean') {
      displayValue = value ? 'Ja' : 'Nein';
    } else if (type === 'currency') {
      displayValue = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
    } else if (type === 'number') {
      // Für Jahre keine Tausendertrennzeichen anzeigen
      if (field === 'year') {
        displayValue = String(value);
      } else {
        displayValue = new Intl.NumberFormat('de-DE').format(value);
      }
    }

    return (
      <div className="flex items-center group">
        <span>{displayValue}</span>
        <button 
          onClick={() => setIsEditing(true)}
          className="ml-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-600 dark:hover:text-teal-400 transition-opacity"
          aria-label="Bearbeiten"
        >
          <Edit className="h-3 w-3" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      {type === 'select' && options ? (
        <select
          value={editedValue}
          onChange={(e) => setEditedValue(e.target.value)}
          className="text-sm border rounded px-1 py-0.5 w-full"
          autoFocus
        >
          {options.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : type === 'boolean' ? (
        <select
          value={String(editedValue)}
          onChange={(e) => setEditedValue(e.target.value)}
          className="text-sm border rounded px-1 py-0.5 w-full"
          autoFocus
        >
          <option value="true">Ja</option>
          <option value="false">Nein</option>
        </select>
      ) : (
        <input
          type={type}
          value={editedValue}
          onChange={(e) => setEditedValue(e.target.value)}
          className="text-sm border rounded px-1 py-0.5 w-full"
          autoFocus
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') setIsEditing(false);
          }}
        />
      )}
      <button 
        onClick={handleSave}
        className="text-green-600 hover:text-green-800 dark:hover:text-green-400"
        aria-label="Speichern"
      >
        <Check className="h-4 w-4" />
      </button>
      <button 
        onClick={() => {
          setEditedValue(value);
          setIsEditing(false);
        }}
        className="text-red-600 hover:text-red-800 dark:hover:text-red-400"
        aria-label="Abbrechen"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

interface DataTableProps {
  data: PensionData[];
  onDeleteEntry: (id: string) => void;
  onUpdateEntry: (id: string, updatedData: Partial<PensionData>) => void;
}

const DataTable: React.FC<DataTableProps> = ({ data, onDeleteEntry, onUpdateEntry }) => {
  const [showExtended, setShowExtended] = React.useState(false);

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center transition-colors duration-200">
        <p className="text-gray-500 dark:text-gray-400">
          Noch keine Daten vorhanden. Fügen Sie Ihre erste Renteninformation hinzu.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors duration-200">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Renteninformation Übersicht
          </h2>
          <button
            onClick={() => setShowExtended(!showExtended)}
            className="inline-flex items-center px-3 py-1 text-sm text-blue-600 dark:text-teal-400 hover:text-blue-800 dark:hover:text-teal-300 transition-colors duration-200"
          >
            {showExtended ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
            {showExtended ? 'Weniger anzeigen' : 'Alle Felder anzeigen'}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Jahr
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Entgeltpunkte
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Rentenanspruch heute
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Hochrechnung
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Erwerbsminderung
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Renteneintritt
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              {showExtended && (
                <>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Abschläge (%)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Inflation (%)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Bruttoeinkommen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Gesamtbeitrag
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Zusatzvorsorge
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Kommentar
                  </th>
                </>
              )}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((entry) => (
              <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <EditableCell 
                    value={entry.year} 
                    field="year" 
                    onUpdate={(field, value) => onUpdateEntry(entry.id, { [field]: value })} 
                    type="number"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <EditableCell 
                    value={entry.entgeltpunkte} 
                    field="entgeltpunkte" 
                    onUpdate={(field, value) => onUpdateEntry(entry.id, { [field]: value })} 
                    type="number"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <EditableCell 
                    value={entry.currentClaim} 
                    field="currentClaim" 
                    onUpdate={(field, value) => onUpdateEntry(entry.id, { [field]: value })} 
                    type="number"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <EditableCell 
                    value={entry.projection} 
                    field="projection" 
                    onUpdate={(field, value) => onUpdateEntry(entry.id, { [field]: value })} 
                    type="number"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <EditableCell 
                    value={entry.disabilityPension} 
                    field="disabilityPension" 
                    onUpdate={(field, value) => onUpdateEntry(entry.id, { [field]: value })} 
                    type="number"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <EditableCell 
                    value={entry.retirementAge} 
                    field="retirementAge" 
                    onUpdate={(field, value) => onUpdateEntry(entry.id, { [field]: value })} 
                    type="number"
                  /> Jahre
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <EditableCell 
                    value={entry.status} 
                    field="status" 
                    onUpdate={(field, value) => onUpdateEntry(entry.id, { [field]: value })}
                    type="select"
                    options={['Aktuell', 'Prognose', 'In Rente']}
                  />
                </td>
                {showExtended && (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <EditableCell 
                        value={entry.earlyRetirementDeduction || 0} 
                        field="earlyRetirementDeduction" 
                        onUpdate={(field, value) => onUpdateEntry(entry.id, { [field]: value })} 
                        type="number"
                      />%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <EditableCell 
                        value={entry.inflationExpectation || 0} 
                        field="inflationExpectation" 
                        onUpdate={(field, value) => onUpdateEntry(entry.id, { [field]: value })} 
                        type="number"
                      />%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <EditableCell 
                        value={entry.annualGrossIncome || ''} 
                        field="annualGrossIncome" 
                        onUpdate={(field, value) => onUpdateEntry(entry.id, { [field]: value })} 
                        type="number"
                        placeholder="-"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <EditableCell 
                        value={entry.totalContribution || ''} 
                        field="totalContribution" 
                        onUpdate={(field, value) => onUpdateEntry(entry.id, { [field]: value })} 
                        type="number"
                        placeholder="-"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <EditableCell 
                        value={entry.additionalPension || false} 
                        field="additionalPension" 
                        onUpdate={(field, value) => onUpdateEntry(entry.id, { [field]: value })}
                        type="boolean"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      <EditableCell 
                        value={entry.comment || ''} 
                        field="comment" 
                        onUpdate={(field, value) => onUpdateEntry(entry.id, { [field]: value })}
                        type="text"
                        placeholder="-"
                      />
                    </td>
                  </>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onDeleteEntry(entry.id)}
                    className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors duration-150"
                    aria-label="Eintrag löschen"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;