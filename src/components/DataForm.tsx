import React, { useState } from 'react';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { PensionData } from '../types/pension';

interface DataFormProps {
  onAddEntry: (entry: Omit<PensionData, 'id' | 'createdAt'>) => void;
}

const statusOptions = [
  'Angestellt',
  'Arbeitslos',
  'Ausbildung',
  'Kindererziehungszeit',
  'Selbstständig',
  'Rentner',
  'Student',
  'Krank',
  'Elternzeit',
  'Sonstiges'
];

const DataForm: React.FC<DataFormProps> = ({ onAddEntry }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    entgeltpunkte: 0,
    currentClaim: 0,
    projection: 0,
    disabilityPension: 0,
    retirementAge: 67,
    status: 'Angestellt',
    
    // Erweiterte Felder
    earlyRetirementDeduction: 0.3,
    inflationExpectation: 2.0,
    additionalPension: false,
    additionalPensionDetails: '',
    annualGrossIncome: 0,
    childCareYears: 0,
    educationYears: 0,
    ownContribution: 0,
    employerContribution: 0,
    insuranceContribution: 0,
    totalContribution: 0,
    comment: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddEntry(formData);
    setFormData({
      year: formData.year + 1,
      entgeltpunkte: 0,
      currentClaim: 0,
      projection: 0,
      disabilityPension: 0,
      retirementAge: 67,
      status: 'Angestellt',
      earlyRetirementDeduction: 0.3,
      inflationExpectation: 2.0,
      additionalPension: false,
      additionalPensionDetails: '',
      annualGrossIncome: 0,
      childCareYears: 0,
      educationYears: 0,
      ownContribution: 0,
      employerContribution: 0,
      insuranceContribution: 0,
      totalContribution: 0,
      comment: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? Number(value) : value
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Neue Renteninformation hinzufügen
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Grundlegende Felder */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Grunddaten
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Jahr *
              </label>
              <input
                type="number"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                min="1950"
                max="2100"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
              />
            </div>

            <div>
              <label htmlFor="entgeltpunkte" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Entgeltpunkte *
              </label>
              <input
                type="number"
                id="entgeltpunkte"
                name="entgeltpunkte"
                value={formData.entgeltpunkte}
                onChange={handleInputChange}
                step="0.0001"
                min="0"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status *
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
              >
                {statusOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Renteninformationen */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Renteninformationen
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">


            <div>
              <label htmlFor="disabilityPension" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Erwerbsminderungsrente (€) *
              </label>
              <input
                type="number"
                id="disabilityPension"
                name="disabilityPension"
                value={formData.disabilityPension}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
              />
            </div>
            <div>
              <label htmlFor="currentClaim" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Rentenanspruch heute (€) *
              </label>
              <input
                type="number"
                id="currentClaim"
                name="currentClaim"
                value={formData.currentClaim}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
              />
            </div>

            <div>
              <label htmlFor="projection" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Hochrechnung (€) *
              </label>
              <input
                type="number"
                id="projection"
                name="projection"
                value={formData.projection}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
              />
            </div>



            <div>
              <label htmlFor="retirementAge" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Geplantes Renteneintrittsalter *
              </label>
              <input
                type="number"
                id="retirementAge"
                name="retirementAge"
                value={formData.retirementAge}
                onChange={handleInputChange}
                min="60"
                max="70"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
              />
            </div>

            <div>
              <label htmlFor="earlyRetirementDeduction" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Abschläge pro Monat vorzeitig (%)
              </label>
              <input
                type="number"
                id="earlyRetirementDeduction"
                name="earlyRetirementDeduction"
                value={formData.earlyRetirementDeduction}
                onChange={handleInputChange}
                step="0.1"
                min="0"
                max="10"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
              />
            </div>

            <div>
              <label htmlFor="inflationExpectation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Inflationserwartung p.a. (%)
              </label>
              <input
                type="number"
                id="inflationExpectation"
                name="inflationExpectation"
                value={formData.inflationExpectation}
                onChange={handleInputChange}
                step="0.1"
                min="0"
                max="10"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
              />
            </div>
          </div>
        </div>

        {/* Erweiterte Felder Toggle */}
        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center text-blue-600 dark:text-teal-400 hover:text-blue-800 dark:hover:text-teal-300 transition-colors duration-200"
          >
            {showAdvanced ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
            Erweiterte Felder {showAdvanced ? 'ausblenden' : 'anzeigen'}
          </button>
        </div>

        {/* Erweiterte Felder */}
        {showAdvanced && (
          <div className="space-y-6 border-t border-gray-200 dark:border-gray-700 pt-6">
            {/* Zeiten */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Zeiten & Einkommen
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="childCareYears" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Kindererziehungszeiten (Jahre)
                  </label>
                  <input
                    type="number"
                    id="childCareYears"
                    name="childCareYears"
                    value={formData.childCareYears}
                    onChange={handleInputChange}
                    min="0"
                    max="20"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="educationYears" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Schul-/Ausbildungszeiten (Jahre)
                  </label>
                  <input
                    type="number"
                    id="educationYears"
                    name="educationYears"
                    value={formData.educationYears}
                    onChange={handleInputChange}
                    min="0"
                    max="20"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="annualGrossIncome" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Jährliches Bruttoeinkommen (€)
                  </label>
                  <input
                    type="number"
                    id="annualGrossIncome"
                    name="annualGrossIncome"
                    value={formData.annualGrossIncome}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Beiträge */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Beiträge
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="ownContribution" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Beitrag Eigen (€)
                  </label>
                  <input
                    type="number"
                    id="ownContribution"
                    name="ownContribution"
                    value={formData.ownContribution}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="employerContribution" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Beitrag Arbeitgeber (€)
                  </label>
                  <input
                    type="number"
                    id="employerContribution"
                    name="employerContribution"
                    value={formData.employerContribution}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="insuranceContribution" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Beitrag Kassen (€)
                  </label>
                  <input
                    type="number"
                    id="insuranceContribution"
                    name="insuranceContribution"
                    value={formData.insuranceContribution}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="totalContribution" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Gesamtbeitrag (€)
                  </label>
                  <input
                    type="number"
                    id="totalContribution"
                    name="totalContribution"
                    value={formData.totalContribution}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Zusatzvorsorge */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Zusatzvorsorge
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="additionalPension"
                    name="additionalPension"
                    checked={formData.additionalPension}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 dark:text-teal-500 focus:ring-blue-500 dark:focus:ring-teal-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                  />
                  <label htmlFor="additionalPension" className="ml-2 block text-sm text-gray-900 dark:text-white">
                    Zusatzvorsorge vorhanden
                  </label>
                </div>

                {formData.additionalPension && (
                  <div>
                    <label htmlFor="additionalPensionDetails" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Details zur Zusatzvorsorge
                    </label>
                    <input
                      type="text"
                      id="additionalPensionDetails"
                      name="additionalPensionDetails"
                      value={formData.additionalPensionDetails}
                      onChange={handleInputChange}
                      placeholder="z.B. Riester-Rente, Betriebsrente, private Rentenversicherung"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Kommentar */}
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Kommentar
              </label>
              <textarea
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={handleInputChange}
                rows={3}
                placeholder="Notizen zu diesem Jahr..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 dark:bg-teal-600 hover:bg-blue-700 dark:hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-teal-500 transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Eintrag hinzufügen
          </button>
        </div>
      </form>
    </div>
  );
};

export default DataForm;