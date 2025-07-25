export interface PensionData {
  id: string;
  year: number;
  entgeltpunkte: number;
  currentClaim: number;
  projection: number;
  disabilityPension: number;
  retirementAge: number;
  status: string;
  
  // Erweiterte Felder
  earlyRetirementDeduction?: number; // Abschläge pro Monat vorzeitig (%)
  inflationExpectation?: number; // Inflationserwartung p.a. (%)
  additionalPension?: boolean; // Zusatzvorsorge vorhanden
  additionalPensionDetails?: string; // Details zur Zusatzvorsorge
  annualGrossIncome?: number; // Jährliches Bruttoeinkommen
  childCareYears?: number; // Kindererziehungszeiten in Jahren
  educationYears?: number; // Schul-/Ausbildungszeiten in Jahren
  ownContribution?: number; // Beitrag Eigen
  employerContribution?: number; // Beitrag Arbeitgeber
  insuranceContribution?: number; // Beitrag Kassen
  totalContribution?: number; // Gesamtbeitrag
  comment?: string; // Kommentar
  
  createdAt: string;
}

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}