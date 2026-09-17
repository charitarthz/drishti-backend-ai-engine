export type UserRole = 'POLICYMAKER' | 'ADMINISTRATOR' | 'MONITORING_OFFICER';

export type RiskLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export type ProjectStatus = 'Ongoing' | 'Delayed' | 'Critical Delay' | 'Completed';

export type ActionType = 
  | 'Physical Progress Verification'
  | 'Ground Verification Audit'
  | 'Schedule Review'
  | 'Cost Review'
  | 'Constraint Review'
  | 'Critical Constraint Remediation';

export type ActionStatus = 'Open' | 'In Progress' | 'Completed' | 'Overdue';

export interface CostHealth {
  originalApprovedCost: number; // ₹ Crores
  revisedCost: number; // ₹ Crores
  costOverrunPercent: number; // %
  cumulativeExpenditure: number; // ₹ Crores
  costRevisionCount: number;
}

export interface ProgressHealth {
  physicalProgress: number; // %
  expectedProgress: number; // %
  progressGap: number; // % points (negative = lagging)
  progressRate: number; // % per month
  progressStall: boolean;
}

export interface ScheduleHealth {
  plannedCompletion: string;
  revisedCompletion: string;
  timeOverrun: number; // in months
  deadlineRevision: number; // count
}

export interface ShapDriver {
  feature: string;
  impact: 'HIGH IMPACT' | 'MEDIUM IMPACT' | 'LOW IMPACT';
  shapValue: number; // normalized contribution
  direction: 'increases_risk' | 'decreases_risk';
  evidence: string;
}

export interface EvidenceRecord {
  reportingMonth: string;
  sourceReport: string;
  sourcePage: string;
  verifiableFacts: {
    label: string;
    value: string;
  }[];
}

export interface SuggestedReview {
  id: string;
  triggerSignal: string;
  suggestedActionType: ActionType;
  rationale: string;
}

export interface ActionItem {
  id: string;
  projectId: string;
  projectName: string;
  actionType: ActionType;
  assignedOfficer: string;
  assignedOfficerRole: string;
  dueDate: string;
  status: ActionStatus;
  remarks: string;
  createdDate: string;
  completedDate?: string;
}

export interface RiskTrendPoint {
  month: string;
  score: number;
  level: RiskLevel;
}

export interface ProjectIntelligence {
  id: string; // e.g. "615186"
  name: string;
  ministry: string;
  sector: string;
  implementingAgency: string;
  state: string;
  district?: string;
  status: ProjectStatus;
  sanctionDate: string;

  // 3-Pillar Health
  cost: CostHealth;
  progress: ProgressHealth;
  schedule: ScheduleHealth;

  // SANKET-AI Intelligence Layer
  riskScore: number; // 0-100
  riskLevel: RiskLevel;
  highRiskProbability: number; // %
  costEscalationRisk: number; // %
  deadlineSlipRisk: number; // %

  // SHAP Explainability & Evidence
  shapDrivers: ShapDriver[];
  evidence: EvidenceRecord;
  suggestedReviews: SuggestedReview[];

  // Trajectory
  trendDirection: 'Increasing' | 'Stable' | 'Decreasing';
  riskHistory: RiskTrendPoint[];

  // Primary warning signal for tables/priority
  keyWarningSignal: 'Progress Below Expected' | 'Progress Stall' | 'Time Overrun' | 'Cost Overrun';
}

export interface CurrentRiskSignal {
  id: string;
  projectId: string;
  projectName: string;
  ministry: string;
  signalType: 'Progress Below Expected' | 'Progress Stall' | 'Time Overrun' | 'Cost Overrun';
  severity: RiskLevel;
  summary: string;
  timestamp: string;
}

export interface OperationalAlert {
  id: string;
  projectId: string;
  projectName: string;
  alertType: 'New High Risk' | 'Risk Increased' | 'Cost Risk Signal' | 'Deadline Risk Signal' | 'Progress Risk Signal' | 'Critical Risk';
  severity: RiskLevel;
  whatHappened: string;
  whyCare: string;
  timestamp: string;
}

export interface FilterState {
  ministry: string;
  sector: string;
  state: string;
  agency: string;
  status: string;
  riskLevel: string;
  reportingMonth: string;
}
