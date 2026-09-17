import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../../components/common/EditorialHeader';
import { InformationBand } from '../../components/common/InformationBand';
import { RiskBadge } from '../../components/common/RiskBadge';
import { MOCK_REPORTING_MONTH } from '../../data/mockProjects';

interface MeasurableSignal {
  id: string;
  projectId: string;
  projectName: string;
  agency: string;
  section: 'PROGRESS' | 'COST' | 'SCHEDULE' | 'MOVEMENT';
  signalName: string;
  currentValue: string;
  comparisonBaseline: string;
  riskLevel: 'Critical' | 'High' | 'Low';
  evidenceDetails: string;
}

const MEASURABLE_SIGNALS: MeasurableSignal[] = [
  // PROGRESS SIGNALS
  {
    id: "SIG-PRG-01",
    projectId: "615186",
    projectName: "Eastern Dedicated Freight Corridor (Sonnagar - Dankuni Section)",
    agency: "DFCCIL (Dedicated Freight Corridor Corp)",
    section: "PROGRESS",
    signalName: "Severe Physical Progress Stall",
    currentValue: "0.28% / month run-rate (42.4% physical)",
    comparisonBaseline: "88.0% expected target milestone (Net gap: -45.6% pts)",
    riskLevel: "Critical",
    evidenceDetails: "Field execution velocity stalled below 0.30%/month for 4 consecutive monitoring cycles on sub-grade compaction."
  },
  {
    id: "SIG-PRG-02",
    projectId: "820144",
    projectName: "AIIMS Mega Tertiary Healthcare Campus - Awantipora",
    agency: "CPWD / HSCC",
    section: "PROGRESS",
    signalName: "Pre-Winter Execution Velocity Collapse",
    currentValue: "0.35% / month run-rate (48.0% physical)",
    comparisonBaseline: "82.0% sanctioned hospital block target (-34.0% pts)",
    riskLevel: "Critical",
    evidenceDetails: "Civil concrete shuttering pace slowed significantly ahead of winter frost window; tender for 33kV electrical feeder line pending."
  },
  {
    id: "SIG-PRG-03",
    projectId: "400010",
    projectName: "Delhi-Amritsar-Katra Expressway (Pkg 1 to 4 - Haryana Section)",
    agency: "National Highways Authority of India (NHAI)",
    section: "PROGRESS",
    signalName: "Progress Deficit Below Expected Velocity",
    currentValue: "64.2% actual cumulative completion",
    comparisonBaseline: "91.0% sanctioned Q3 milestone (-26.8% pts)",
    riskLevel: "Critical",
    evidenceDetails: "Only 54.8 km of 84.5 km concrete pavement laid due to unencumbered RoW handovers and ROB structure delays."
  },
  // COST SIGNALS
  {
    id: "SIG-CST-01",
    projectId: "510924",
    projectName: "Barmer Petroleum Refinery and Petrochemical Complex (9 MMTPA)",
    agency: "HPCL Rajasthan Refinery Ltd (HRRL)",
    section: "COST",
    signalName: "Substantial Capital Outlay Escalation (>50%)",
    currentValue: "₹72,937 Cr revised outlay (+69.1%)",
    comparisonBaseline: "Original base sanction ₹43,129 Cr (+₹29,808 Cr addition)",
    riskLevel: "Critical",
    evidenceDetails: "Refinery and petrochemical unit reconfiguration added ₹29,808 Cr across two formal administrative approvals."
  },
  {
    id: "SIG-CST-02",
    projectId: "615186",
    projectName: "Eastern Dedicated Freight Corridor (Sonnagar - Dankuni Section)",
    agency: "DFCCIL",
    section: "COST",
    signalName: "Compounding Sanction Amendments Loop",
    currentValue: "₹14,220 Cr revised cost (+46.9%)",
    comparisonBaseline: "Initial baseline approval ₹9,680 Cr (3 formal revisions)",
    riskLevel: "Critical",
    evidenceDetails: "Three formal Standing Committee revisions with cumulative expenditure already at ₹11,140 Cr against 42.4% physical completion."
  },
  {
    id: "SIG-CST-03",
    projectId: "210945",
    projectName: "Vizhinjam International Deepwater Multipurpose Seaport (Phase-1)",
    agency: "VISL / Adani Ports",
    section: "COST",
    signalName: "Breakwater & Dredging Financial Variation",
    currentValue: "₹7,700 Cr revised estimate (+38.7%)",
    comparisonBaseline: "Original approved cost ₹5,552 Cr (+₹2,148 Cr variance)",
    riskLevel: "High",
    evidenceDetails: "Additional tetrapod armour placement and specialized deep-sea dredging expanded original capital commitments."
  },
  // SCHEDULE SIGNALS
  {
    id: "SIG-SCH-01",
    projectId: "615191",
    projectName: "Udhampur-Srinagar-Baramulla Rail Link (Katra-Banihal Section)",
    agency: "Northern Railway / KRCL",
    section: "SCHEDULE",
    signalName: "Historic Timeline Slippage (>15 Years)",
    currentValue: "+216 months delay past initial milestone",
    comparisonBaseline: "Sanctioned completion Dec 2007 vs Revised Dec 2025",
    riskLevel: "High",
    evidenceDetails: "7 formal deadline amendments across 23 years; residual statutory CRS safety certification pending for final commercial clearance."
  },
  {
    id: "SIG-SCH-02",
    projectId: "318920",
    projectName: "Bengaluru Metro Rail Project Phase-2 (Reach 6)",
    agency: "Bangalore Metro Rail Corporation (BMRCL)",
    section: "SCHEDULE",
    signalName: "Underground TBM Tunneling Milestone Slip",
    currentValue: "+75 months delay beyond baseline",
    comparisonBaseline: "Original planned completion Jun 2020 vs Revised Sep 2026",
    riskLevel: "High",
    evidenceDetails: "Dense urban Cantonment section tunnel boring drives holed through only 19 of 24 planned drives."
  },
  {
    id: "SIG-SCH-03",
    projectId: "611602",
    projectName: "Navi Mumbai International Airport (Phase-1)",
    agency: "CIDCO / NMIAL (Adani Airports)",
    section: "SCHEDULE",
    signalName: "Commercial Operations Date (COD) Revision",
    currentValue: "+75 months timeline revision",
    comparisonBaseline: "Initial COD target Dec 2019 vs Revised Mar 2026",
    riskLevel: "High",
    evidenceDetails: "Terminal MEP commissioning and DGCA instrument calibration flights scheduled into Q1 2026."
  },
  // RISK MOVEMENT SIGNALS
  {
    id: "SIG-MOV-01",
    projectId: "615186",
    projectName: "Eastern Dedicated Freight Corridor (Sonnagar - Dankuni Section)",
    agency: "DFCCIL",
    section: "MOVEMENT",
    signalName: "Multi-Cycle Score Acceleration (+13 pts)",
    currentValue: "Current SANKET Score: 92/100 (Critical)",
    comparisonBaseline: "Escalated continuously from 79 (May) to 92 (October 2025)",
    riskLevel: "Critical",
    evidenceDetails: "Progress stall coupled with cost revision accumulation drove composite risk into Tier 1 critical band."
  },
  {
    id: "SIG-MOV-02",
    projectId: "820144",
    projectName: "AIIMS Mega Tertiary Healthcare Campus - Awantipora",
    agency: "CPWD",
    section: "MOVEMENT",
    signalName: "Score Velocity Deterioration (+10 pts)",
    currentValue: "Current SANKET Score: 89/100 (Critical)",
    comparisonBaseline: "Increased from 79 (May) to 89 (October 2025)",
    riskLevel: "Critical",
    evidenceDetails: "Persistent monthly execution rate below 0.40% triggered high-risk probability escalation."
  },
  {
    id: "SIG-MOV-03",
    projectId: "504112",
    projectName: "Talcher Ultra-Supercritical Fertilizer & Coal Gasification Complex",
    agency: "Talcher Fertilizers Ltd (TFL)",
    section: "MOVEMENT",
    signalName: "Tier Migration to Critical (+8 pts)",
    currentValue: "Current SANKET Score: 86/100 (Critical)",
    comparisonBaseline: "Crossed critical threshold (80) in August 2025",
    riskLevel: "Critical",
    evidenceDetails: "High-pressure cryogenic piping package vendor delivery deficits widened milestone execution gap past -32.8% points."
  }
];

export const CurrentRiskSignalsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'ALL' | 'PROGRESS' | 'COST' | 'SCHEDULE' | 'MOVEMENT'>('ALL');

  const filteredSignals = MEASURABLE_SIGNALS.filter(s => activeSection === 'ALL' || s.section === activeSection);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Editorial Header */}
      <EditorialHeader
        eyebrow="Monitoring Desk • Field Warning Signals"
        title="Current Infrastructure Risk Signals"
        subtitle={`Empirical anomalies and threshold triggers extracted from the ${MOCK_REPORTING_MONTH} PAIMANA reporting return, tracking measurable execution stalls, cost variances, and schedule slips.`}
        badge="RISK SIGNALS"
      />

      {/* Information Band */}
      <InformationBand
        cells={[
          { label: 'Active Signals', value: MEASURABLE_SIGNALS.length, context: 'Across Monitored Works' },
          { label: 'Progress Signals', value: MEASURABLE_SIGNALS.filter(s => s.section === 'PROGRESS').length, context: 'Stalls & Deficits', emphasis: 'critical' },
          { label: 'Cost Signals', value: MEASURABLE_SIGNALS.filter(s => s.section === 'COST').length, context: 'Escalations > 25%', emphasis: 'high' },
          { label: 'Schedule Signals', value: MEASURABLE_SIGNALS.filter(s => s.section === 'SCHEDULE').length, context: 'Timeline Slippage', emphasis: 'high' },
          { label: 'Risk Accelerations', value: MEASURABLE_SIGNALS.filter(s => s.section === 'MOVEMENT').length, context: 'Score Drift (+5 pts)', emphasis: 'critical' },
        ]}
      />

      {/* Section Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 bg-paper-subtle p-1 border border-gov-border rounded-xs text-xs font-mono">
        {[
          { id: 'ALL', label: 'All Monitoring Signals' },
          { id: 'PROGRESS', label: 'Progress Signals' },
          { id: 'COST', label: 'Cost Signals' },
          { id: 'SCHEDULE', label: 'Schedule Signals' },
          { id: 'MOVEMENT', label: 'Risk Movement' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as any)}
            className={`px-3 py-1.5 rounded-xs transition-colors ${
              activeSection === tab.id
                ? 'bg-ink text-white font-bold'
                : 'text-ink-muted hover:text-ink hover:bg-gov-border/40'
            }`}
          >
            {tab.label} ({tab.id === 'ALL' ? MEASURABLE_SIGNALS.length : MEASURABLE_SIGNALS.filter(s => s.section === tab.id).length})
          </button>
        ))}
      </div>

      {/* Signal Dossier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSignals.map(sig => (
          <div
            key={sig.id}
            className="bg-white border border-gov-border rounded-xs p-5 space-y-3 shadow-subtle hover:border-ink/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-3 border-b border-gov-border pb-2.5">
              <div>
                <div className="flex items-center gap-2 font-mono text-[10px] text-ink-subtle">
                  <span className="font-bold text-gov-terracotta">{sig.section} SIGNAL</span>
                  <span>•</span>
                  <span>#{sig.projectId}</span>
                </div>
                <h3 className="editorial-title text-sm font-semibold text-ink mt-0.5">
                  {sig.projectName}
                </h3>
                <span className="text-[10px] font-mono text-ink-subtle">{sig.agency}</span>
              </div>
              <RiskBadge level={sig.riskLevel} size="sm" />
            </div>

            {/* Measurable Signal Box */}
            <div className="p-3 bg-paper-subtle border border-gov-border rounded-xs space-y-1.5 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-ink-subtle text-[10px] uppercase">Measurable Trigger:</span>
                <span className="font-bold text-risk-critical-solid">{sig.signalName}</span>
              </div>
              <div className="flex items-center justify-between border-t border-gov-border/50 pt-1">
                <span className="text-ink-muted text-[11px]">Current Value:</span>
                <span className="font-bold text-ink">{sig.currentValue}</span>
              </div>
              <div className="flex items-center justify-between border-t border-gov-border/50 pt-1">
                <span className="text-ink-muted text-[11px]">Comparison Baseline:</span>
                <span className="text-ink-subtle">{sig.comparisonBaseline}</span>
              </div>
            </div>

            {/* Verifiable Context */}
            <p className="text-xs text-ink-muted leading-relaxed font-sans">
              <strong className="text-ink font-medium">Field Return Finding:</strong> {sig.evidenceDetails}
            </p>

            {/* Action Footer */}
            <div className="flex items-center justify-between pt-1 border-t border-gov-border text-xs font-mono">
              <Link
                to={`/monitoring/actions?project=${sig.projectId}`}
                className="text-ink hover:text-gov-terracotta font-medium underline"
              >
                Log Review Action
              </Link>
              <Link
                to={`/project/${sig.projectId}`}
                className="text-gov-terracotta hover:underline font-bold"
              >
                View Project Intelligence →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
