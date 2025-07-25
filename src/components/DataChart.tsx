import React, { useMemo, Suspense } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar
} from 'recharts';
import { PensionData } from '../types/pension';
import { useTheme } from '../context/ThemeContext';

interface DataChartProps {
  data: PensionData[];
}

const DataChart: React.FC<DataChartProps> = ({ data }) => {
  const { isDark } = useTheme();

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center transition-colors duration-200">
        <p className="text-gray-500 dark:text-gray-400">
          Keine Daten für die Visualisierung verfügbar.
        </p>
      </div>
    );
  }

  const chartData = data.map(entry => ({
    Jahr: entry.year,
    'Rentenanspruch heute': entry.currentClaim,
    'Hochrechnung': entry.projection,
    'Erwerbsminderungsrente': entry.disabilityPension,
    'Entgeltpunkte': entry.entgeltpunkte * 100, // Scale for better visibility
    'Bruttoeinkommen': entry.annualGrossIncome ? entry.annualGrossIncome / 1000 : 0, // Scale to thousands
    'Gesamtbeitrag': entry.totalContribution ? entry.totalContribution / 1000 : 0 // Scale to thousands
  }));

  const axisColor = isDark ? '#9CA3AF' : '#6B7280';
  const gridColor = isDark ? '#374151' : '#E5E7EB';
  const tooltipBg = isDark ? '#1F2937' : '#FFFFFF';
  const tooltipBorder = isDark ? '#374151' : '#E5E7EB';

  // Calculate net values for different tax classes (simplified calculation)
  const calculateNetValue = (grossValue: number, taxClass: number) => {
    // Simplified tax calculation - in a real app, you might want to use a proper tax calculation library
    const taxRates = {
      1: 0.30, // 30% tax for class 1
      2: 0.28, // 28% tax for class 2
      3: 0.25, // 25% tax for class 3
      4: 0.20, // 20% tax for class 4
      5: 0.35, // 35% tax for class 5
      6: 0.42  // 42% tax for class 6
    };
    
    const taxRate = taxRates[taxClass as keyof typeof taxRates] || 0.30;
    return grossValue * (1 - taxRate);
  };

  // Get the latest year's data
  const latestYearData = useMemo(() => {
    if (data.length === 0) return null;
    
    const sortedData = [...data].sort((a, b) => b.year - a.year);
    const latest = sortedData[0];
    
    return {
      year: latest.year,
      rentenpunkte: latest.entgeltpunkte.toFixed(2),
      currentClaim: latest.currentClaim,
      projection: latest.projection,
      disabilityPension: latest.disabilityPension,
      netValues: [1, 2, 3, 4, 5, 6].map(taxClass => ({
        taxClass,
        currentClaim: calculateNetValue(latest.currentClaim, taxClass),
        projection: calculateNetValue(latest.projection, taxClass),
        disabilityPension: calculateNetValue(latest.disabilityPension, taxClass)
      }))
    };
  }, [data]);

  // Loading component for Suspense
  const ChartLoading = () => (
    <div className="h-96 flex items-center justify-center">
      <div className="animate-pulse text-gray-500">Lade Diagramm...</div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Rentenentwicklung Visualisierung
      </h2>

      <div className="h-96">
        <Suspense fallback={<ChartLoading />}>
          <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis 
              dataKey="Jahr" 
              stroke={axisColor}
              tick={{ fill: axisColor }}
            />
            <YAxis 
              stroke={axisColor}
              tick={{ fill: axisColor }}
              tickFormatter={(value: number) => {
                if (value >= 1000) {
                  return `${(value / 1000).toFixed(0)}k`;
                }
                return value.toLocaleString('de-DE');
              }}
              domain={[0, (dataMax: number) => {
                // Set a minimum height for the chart
                const maxValue = Math.max(
                  ...data.map(d => d.currentClaim || 0),
                  ...data.map(d => d.projection || 0),
                  ...data.map(d => d.disabilityPension || 0),
                  (data.map(d => d.annualGrossIncome || 0).reduce((a, b) => Math.max(a, b), 0) / 1000) || 0
                );
                // Add 20% padding to the top of the chart
                return Math.ceil(maxValue * 1.2);
              }]}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: tooltipBg,
                border: `1px solid ${tooltipBorder}`,
                borderRadius: '6px',
                color: isDark ? '#FFFFFF' : '#000000'
              }}
              formatter={(value: number, name: string) => {
                if (name === 'Entgeltpunkte') {
                  return [(value / 100).toFixed(2), name];
                } else if (name === 'Bruttoeinkommen' || name === 'Gesamtbeitrag') {
                  return [(value * 1000).toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }), name];
                }
                return [value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }), name];
              }}
            />
            <Legend 
              wrapperStyle={{ color: axisColor }}
            />
            <Line 
              type="monotone" 
              dataKey="Rentenanspruch heute" 
              stroke={isDark ? '#14B8A6' : '#3B82F6'} 
              strokeWidth={2}
              dot={{ fill: isDark ? '#14B8A6' : '#3B82F6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: isDark ? '#14B8A6' : '#3B82F6', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="Hochrechnung" 
              stroke={isDark ? '#10B981' : '#1D4ED8'} 
              strokeWidth={2}
              dot={{ fill: isDark ? '#10B981' : '#1D4ED8', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: isDark ? '#10B981' : '#1D4ED8', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="Erwerbsminderungsrente" 
              stroke={isDark ? '#F59E0B' : '#DC2626'} 
              strokeWidth={2}
              dot={{ fill: isDark ? '#F59E0B' : '#DC2626', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: isDark ? '#F59E0B' : '#DC2626', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="Bruttoeinkommen" 
              stroke={isDark ? '#8B5CF6' : '#7C3AED'} 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: isDark ? '#8B5CF6' : '#7C3AED', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: isDark ? '#8B5CF6' : '#7C3AED', strokeWidth: 2 }}
            />
          </LineChart>
          </ResponsiveContainer>
        </Suspense>
        </div>

      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p>
          * Die Visualisierung zeigt die Entwicklung Ihrer Rentenansprüche über die Jahre. 
          Bruttoeinkommen wird in Tausend Euro dargestellt (gestrichelte Linie).
          Nutzen Sie diese Daten zur langfristigen Finanzplanung.
        </p>
      </div>

      {/* Additional Information Section */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Aktuelle Renteninformationen ({latestYearData?.year})
        </h3>
        
        {latestYearData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Aktuelle Werte</h4>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Rentenpunkte:</span>{' '}
                  <span className="font-medium">{latestYearData.rentenpunkte}</span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Aktueller Rentenanspruch:</span>{' '}
                  <span className="font-medium">
                    {latestYearData.currentClaim.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Hochrechnung:</span>{' '}
                  <span className="font-medium">
                    {latestYearData.projection.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Erwerbsminderungsrente:</span>{' '}
                  <span className="font-medium">
                    {latestYearData.disabilityPension.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Monatliche Netto-Beträge nach Steuerklasse</h4>
              <div className="h-64">
                <Suspense fallback={<div className="h-full flex items-center justify-center">Lade Balkendiagramm...</div>}>
                  <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={latestYearData.netValues}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis 
                      dataKey="taxClass" 
                      label={{ value: 'Steuerklasse', position: 'insideBottom', offset: -5 }}
                      stroke={axisColor}
                      tick={{ fill: axisColor }}
                    />
                    <YAxis 
                      stroke={axisColor}
                      tick={{ fill: axisColor }}
                      tickFormatter={(value) => `${(value / 1).toFixed(0)} €`}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: tooltipBg,
                        border: `1px solid ${tooltipBorder}`,
                        borderRadius: '6px',
                        color: isDark ? '#FFFFFF' : '#000000'
                      }}
                      formatter={(value: number, name: string) => {
                        return [
                          value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }),
                          name === 'currentClaim' ? 'Aktuell' :
                          name === 'projection' ? 'Hochrechnung' : 'Erwerbsminderung'
                        ] as [string, string];
                      }}
                      labelFormatter={(label: string) => `Steuerklasse ${label}`}
                    />
                    <Bar 
                      dataKey="currentClaim" 
                      name="Aktueller Rentenanspruch"
                      fill={isDark ? '#14B8A6' : '#3B82F6'}
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="projection" 
                      name="Hochrechnung"
                      fill={isDark ? '#10B981' : '#1D4ED8'}
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="disabilityPension" 
                      name="Erwerbsminderungsrente"
                      fill={isDark ? '#F59E0B' : '#DC2626'}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                  </ResponsiveContainer>
                </Suspense>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                * Die Netto-Beträge sind Schätzungen basierend auf den durchschnittlichen Steuersätzen der jeweiligen Steuerklassen.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataChart;