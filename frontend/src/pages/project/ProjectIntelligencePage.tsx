import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MOCK_PROJECTS, MOCK_REPORTING_MONTH } from '../../data/mockProjects';
import type { ActionType, ActionStatus, ProjectIntelligence } from '../../types/project';
import { useActions } from '../../context/ActionContext';
import { RiskBadge } from '../../components/common/RiskBadge';
import { ActionStatusBadge } from '../../components/common/ActionStatusBadge';
import {
  ArrowLeft,
  Info,
  TrendingUp,
  TrendingDown,
  Minus,
  Building2,
  MapPin,
  Calendar,
  CheckCircle2,
  FileText,
  ChevronDown,
  Send,
  HelpCircle,
  FileCheck
} from 'lucide-react';

export const ProjectIntelligencePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getActionsByProjectId, addAction, updateActionStatus } = useActions();

  // Selected project or fallback to first
  const project: ProjectIntelligence = MOCK_PROJECTS.find(p => p.id === id) || MOCK_PROJECTS[0];
  const projectActions = getActionsByProjectId(project.id);

  // Form State for Section 7: Action / Intervention
  const [actionType, setActionType] = useState<ActionType>('Physical Progress Verification');
  const [assignedOfficer, setAssignedOfficer] = useState('Dr. S. K. Verma, Principal Advisor');
  const [dueDate, setDueDate] = useState('2025-11-15');
  const [actionStatus, setActionStatus] = useState<ActionStatus>('Open');
  const [remarks, setRemarks] = useState(
    `Statutory physical verification required to confirm progress stall vs reported contractor billing gap.`
  );
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Quick officer presets
  const officerSuggestions = [
    'Dr. S. K. Verma, Principal Advisor (MoSPI)',
    'Rajesh Malhotra, Chief Project Manager',
    'P. C. Gupta, Executive Director (Works)',
    'Anita Roy, Joint Secretary (Infrastructure)'
  ];

  // Handler to adopt suggested review directly into form
  const handleAdoptReview = (suggestedType: ActionType, rationale: string) => {
    setActionType(suggestedType);
    setRemarks(`Adopted from SANKET-AI Recommendation: ${rationale}`);
    const actionFormElem = document.getElementById('section-action-form');
    if (actionFormElem) {
      actionFormElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handler for creating a new action
  const handleCreateAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remarks.trim() || !assignedOfficer.trim()) return;

    addAction({
      projectId: project.id,
      projectName: project.name,
      actionType,
      assignedOfficer,
      assignedOfficerRole: 'Project Monitoring Directorate',
      dueDate,
      status: actionStatus,
      remarks
    });

    setActionSuccessMessage(`Statutory Action recorded under ID for ${project.id}. Updated live in portfolio tracking ledger.`);
    setTimeout(() => setActionSuccessMessage(null), 5000);
  };

  // SVG Chart Dimensions for Historical Risk Trend
  const chartHeight = 160;
  const chartWidth = 600;
  const padding = 40;
  const minScore = 0;
  const maxScore = 100;
  const history = project.riskHistory;

  // Calculate coordinates for risk history
  const points = history.map((pt, index) => {
    const x = padding + (index / (history.length - 1)) * (chartWidth - 2 * padding);
    const y = chartHeight - padding - ((pt.score - minScore) / (maxScore - minScore)) * (chartHeight - 2 * padding);
    return { x, y, ...pt };
  });

  const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');
  const areaPoints = `${points[0].x},${chartHeight - padding} ${polylinePoints} ${points[points.length - 1].x},${chartHeight - padding}`;
  const thresholdY = chartHeight - padding - ((70 - minScore) / (maxScore - minScore)) * (chartHeight - 2 * padding);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Top Navigation & Project Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gov-border pb-4">
        <div className="flex items-center gap-3">
          <Link
            to={-1 as unknown as string}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-ink-muted hover:text-ink transition-colors px-2 py-1 bg-white border border-gov-border rounded-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return</span>
          </Link>
          <span className="text-xs font-mono text-ink-subtle">|</span>
          <span className="text-xs font-mono text-ink-subtle">
            Showcase: <strong className="text-ink">Project Intelligence Dossier</strong>
          </span>
        </div>

        {/* Project Switcher for Quick Inspection */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-ink-subtle hidden md:inline">Inspect Project:</span>
          <div className="relative">
            <select
              value={project.id}
              onChange={(e) => navigate(`/project/${e.target.value}`)}
              className="text-xs font-mono bg-white border border-gov-border rounded-xs px-3 py-1.5 text-ink pr-8 focus:outline-none focus:ring-1 focus:ring-gov-terracotta"
            >
              {MOCK_PROJECTS.map(p => (
                <option key={p.id} value={p.id}>
                  #{p.id} — {p.name.slice(0, 38)}... ({p.riskLevel} - {p.riskScore})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-ink-subtle absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* SANKET-AI Innovation Sequence Ribbon */}
      <div className="bg-paper-subtle p-3 rounded-xs border border-gov-border overflow-x-auto">
        <div className="flex items-center justify-between min-w-[760px] text-[11px] font-mono">
          <span className="text-ink-subtle uppercase tracking-wider font-semibold">Innovation Workflow:</span>
          <span className="text-ink font-bold">1. PROJECT</span>
          <span className="text-ink-subtle">→</span>
          <span className="text-ink font-bold">2. HEALTH</span>
          <span className="text-ink-subtle">→</span>
          <span className="text-gov-terracotta font-bold">3. RISK</span>
          <span className="text-ink-subtle">→</span>
          <span className="text-gov-terracotta font-bold">4. WHY? (SHAP)</span>
          <span className="text-ink-subtle">→</span>
          <span className="text-ink font-bold">5. EVIDENCE</span>
          <span className="text-ink-subtle">→</span>
          <span className="text-gov-saffron font-bold">6. REVIEW</span>
          <span className="text-ink-subtle">→</span>
          <span className="text-gov-teal font-bold">7. ACTION</span>
          <span className="text-ink-subtle">→</span>
          <span className="text-ink font-bold">8. TRACK</span>
        </div>
      </div>

      {/* Paradigm Shift: Traditional Monitoring vs SANKET-AI */}
      <div className="bg-white border border-gov-border rounded-xs divide-y md:divide-y-0 md:divide-x divide-gov-border grid grid-cols-1 md:grid-cols-2 text-xs shadow-xs">
        <div className="p-4 bg-paper-subtle/50 space-y-1">
          <div className="flex items-center gap-1.5 text-ink-muted font-mono font-semibold text-[11px] uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-ink-subtle"></span>
            <span>Traditional Monitoring Focus</span>
          </div>
          <p className="text-ink font-bold text-sm">"What happened in the past?"</p>
          <p className="text-ink-muted text-[11px] leading-relaxed">
            Historical accounting, static delay tallies, retroactive post-mortems, and passive quarterly document filings.
          </p>
        </div>

        <div className="p-4 bg-white space-y-1 border-l-2 md:border-l-0 border-l-gov-terracotta">
          <div className="flex items-center gap-1.5 text-gov-terracotta font-mono font-semibold text-[11px] uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-gov-terracotta"></span>
            <span>SANKET-AI Intelligence Paradigm</span>
          </div>
          <p className="text-gov-terracotta font-bold text-sm">
            "What is showing risk? Why? Which needs attention? What to review? What action was taken?"
          </p>
          <p className="text-ink-muted text-[11px] leading-relaxed">
            Predictive risk ensemble, mathematical SHAP explainability, evidence audit trail, suggested reviews, and closed-loop statutory action tracking.
          </p>
        </div>
      </div>

      {/* ==================================================
          SECTION 1 — PROJECT IDENTITY
          ================================================== */}
      <section id="section-identity" className="bg-white border border-gov-border rounded-xs p-6 lg:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-ink bg-paper-subtle px-2.5 py-1 border border-gov-border rounded-xs">
                PROJECT ID: #{project.id}
              </span>
              <span className={`text-xs px-2.5 py-1 rounded-xs font-mono font-semibold border ${
                project.status === 'Critical Delay' ? 'bg-risk-critical-bg text-risk-critical-text border-risk-critical-border' :
                project.status === 'Delayed' ? 'bg-risk-high-bg text-risk-high-text border-risk-high-border' :
                'bg-paper-subtle text-ink-muted border-gov-border'
              }`}>
                STATUS: {project.status.toUpperCase()}
              </span>
              <span className="text-xs text-gov-border">•</span>
              <span className="text-xs text-ink-subtle font-mono">
                Sanctioned: <strong>{project.sanctionDate}</strong>
              </span>
            </div>

            <h1 className="editorial-title text-2xl sm:text-3xl lg:text-4xl text-ink leading-tight">
              {project.name}
            </h1>

            {/* Structured Metadata Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-paper-subtle text-xs">
              <div className="space-y-1">
                <span className="section-eyebrow text-ink-subtle">Ministry</span>
                <div className="flex items-center gap-1.5 font-medium text-ink">
                  <Building2 className="w-3.5 h-3.5 text-ink-subtle shrink-0" />
                  <span>{project.ministry}</span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="section-eyebrow text-ink-subtle">Sector</span>
                <div className="flex items-center gap-1.5 font-medium text-ink">
                  <span className="text-ink-subtle font-bold">§</span>
                  <span>{project.sector}</span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="section-eyebrow text-ink-subtle">Implementing Agency</span>
                <div className="flex items-center gap-1.5 font-medium text-ink">
                  <FileText className="w-3.5 h-3.5 text-ink-subtle shrink-0" />
                  <span>{project.implementingAgency}</span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="section-eyebrow text-ink-subtle">State / UT</span>
                <div className="flex items-center gap-1.5 font-medium text-ink">
                  <MapPin className="w-3.5 h-3.5 text-ink-subtle shrink-0" />
                  <span>{project.state} {project.district ? `(${project.district})` : ''}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Source & Reporting Month Context Stamp */}
          <div className="shrink-0 bg-paper-subtle p-5 border border-gov-border rounded-xs text-right min-w-[240px] space-y-3">
            <div>
              <span className="section-eyebrow text-ink-subtle block mb-1">Reporting Cycle</span>
              <div className="text-sm font-bold font-mono text-ink flex items-center justify-end gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gov-terracotta" />
                <span>{MOCK_REPORTING_MONTH}</span>
              </div>
              <span className="text-[11px] text-ink-subtle block mt-0.5">Statutory Level-3 Return</span>
            </div>

            <div className="pt-2.5 border-t border-gov-border">
              <span className="section-eyebrow text-ink-subtle block mb-1">Source Framework</span>
              <div className="text-xs font-mono text-ink">
                PAIMANA Monthly Flash Report
              </div>
              <span className="text-[10px] text-ink-subtle font-mono block">Citation: {project.evidence.sourcePage}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 2 — PROJECT HEALTH (THREE PILLARS)
          ================================================== */}
      <section id="section-health" className="space-y-4">
        <div className="flex items-center justify-between border-b border-gov-border pb-2">
          <div>
            <span className="section-eyebrow text-ink-subtle">Section 02</span>
            <h2 className="editorial-title text-xl text-ink">
              Project Health Baseline (Three-Pillar Structured Comparison)
            </h2>
          </div>
          <span className="text-xs font-mono text-ink-subtle hidden sm:inline">
            Non-uniform comparison layout • Physical & Financial Pillars
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* PILLAR A: COST */}
          <div className="bg-white border border-gov-border rounded-xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-gov-border pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-xs bg-gov-saffron"></div>
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-ink">
                  Cost Pillar
                </h3>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 bg-paper-subtle border border-gov-border text-ink-muted">
                {project.cost.costRevisionCount} Sanction Revisions
              </span>
            </div>

            {/* Approved vs Revised Comparison */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline text-xs">
                <span className="text-ink-muted">Original Sanctioned:</span>
                <span className="font-mono font-semibold text-ink">₹{project.cost.originalApprovedCost.toLocaleString()} Cr</span>
              </div>
              <div className="flex justify-between items-baseline text-xs">
                <span className="text-ink-muted">Revised Approved Cost:</span>
                <span className="font-mono font-bold text-ink">₹{project.cost.revisedCost.toLocaleString()} Cr</span>
              </div>

              {/* Cost Delta Indicator */}
              <div className="bg-paper-subtle p-2.5 rounded-xs border border-gov-border space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-ink-muted">Cost Overrun:</span>
                  <span className={`font-bold ${project.cost.costOverrunPercent > 15 ? 'text-risk-critical-solid' : 'text-ink'}`}>
                    +{project.cost.costOverrunPercent}% (+₹{(project.cost.revisedCost - project.cost.originalApprovedCost).toLocaleString()} Cr)
                  </span>
                </div>
                {/* Cost Overrun Meter */}
                <div className="w-full bg-gov-border h-2 rounded-xs overflow-hidden">
                  <div
                    className={`h-full ${project.cost.costOverrunPercent > 20 ? 'bg-risk-critical-solid' : 'bg-gov-saffron'}`}
                    style={{ width: `${Math.min(100, Math.max(10, project.cost.costOverrunPercent))}%` }}
                  />
                </div>
              </div>

              {/* Cumulative Expenditure */}
              <div className="pt-2 border-t border-paper-subtle flex justify-between items-baseline text-xs">
                <span className="text-ink-muted">Cumulative Expenditure:</span>
                <div className="text-right">
                  <span className="font-mono font-bold text-ink">₹{project.cost.cumulativeExpenditure.toLocaleString()} Cr</span>
                  <span className="text-[10px] text-ink-subtle font-mono block">
                    ({((project.cost.cumulativeExpenditure / project.cost.revisedCost) * 100).toFixed(1)}% of revised sanction)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* PILLAR B: PROGRESS */}
          <div className="bg-white border border-gov-border rounded-xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-gov-border pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-xs bg-gov-teal"></div>
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-ink">
                  Progress Pillar
                </h3>
              </div>
              {project.progress.progressStall ? (
                <span className="text-[10px] font-mono px-2 py-0.5 bg-risk-critical-bg text-risk-critical-text border border-risk-critical-border font-bold animate-pulse">
                  STALL DETECTED
                </span>
              ) : (
                <span className="text-[10px] font-mono px-2 py-0.5 bg-risk-low-bg text-risk-low-text border border-risk-low-border font-semibold">
                  ACTIVE ADVANCEMENT
                </span>
              )}
            </div>

            {/* Physical vs Expected Comparison */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline text-xs">
                <span className="text-ink-muted">Reported Physical Progress:</span>
                <span className="font-mono font-bold text-base text-ink">{project.progress.physicalProgress}%</span>
              </div>
              <div className="flex justify-between items-baseline text-xs">
                <span className="text-ink-muted">Expected Target Progress:</span>
                <span className="font-mono font-semibold text-ink">{project.progress.expectedProgress}%</span>
              </div>

              {/* Progress Gap Indicator */}
              <div className="bg-paper-subtle p-2.5 rounded-xs border border-gov-border space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-ink-muted">Progress Execution Gap:</span>
                  <span className={`font-bold ${project.progress.progressGap < -15 ? 'text-risk-critical-solid' : 'text-ink'}`}>
                    {project.progress.progressGap}% pts
                  </span>
                </div>
                {/* Progress Comparison Visual */}
                <div className="w-full bg-gov-border h-2 rounded-xs overflow-hidden relative">
                  <div
                    className="absolute top-0 bottom-0 bg-gov-teal rounded-xs"
                    style={{ width: `${project.progress.physicalProgress}%` }}
                  />
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-ink border-l border-white"
                    style={{ left: `${project.progress.expectedProgress}%` }}
                    title={`Target: ${project.progress.expectedProgress}%`}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-ink-subtle">
                  <span>Actual: {project.progress.physicalProgress}%</span>
                  <span>Target: {project.progress.expectedProgress}%</span>
                </div>
              </div>

              {/* Progress Rate */}
              <div className="pt-2 border-t border-paper-subtle flex justify-between items-baseline text-xs">
                <span className="text-ink-muted">Current Progress Rate:</span>
                <span className="font-mono font-semibold text-ink">{project.progress.progressRate}% / month</span>
              </div>
            </div>
          </div>

          {/* PILLAR C: SCHEDULE */}
          <div className="bg-white border border-gov-border rounded-xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-gov-border pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-xs bg-ink-muted"></div>
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-ink">
                  Schedule Pillar
                </h3>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 bg-paper-subtle border border-gov-border text-ink-muted">
                {project.schedule.deadlineRevision} Target Shifts
              </span>
            </div>

            {/* Planned vs Revised Timeline */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline text-xs">
                <span className="text-ink-muted">Planned Commissioning:</span>
                <span className="font-mono font-semibold text-ink">{project.schedule.plannedCompletion}</span>
              </div>
              <div className="flex justify-between items-baseline text-xs">
                <span className="text-ink-muted">Revised Target Date:</span>
                <span className="font-mono font-bold text-ink">{project.schedule.revisedCompletion}</span>
              </div>

              {/* Time Overrun Indicator */}
              <div className="bg-paper-subtle p-2.5 rounded-xs border border-gov-border space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-ink-muted">Cumulative Time Overrun:</span>
                  <span className={`font-bold ${project.schedule.timeOverrun > 18 ? 'text-risk-critical-solid' : 'text-ink'}`}>
                    +{project.schedule.timeOverrun} Months
                  </span>
                </div>
                {/* Time Slippage Visual */}
                <div className="w-full bg-gov-border h-2 rounded-xs overflow-hidden">
                  <div
                    className={`h-full ${project.schedule.timeOverrun > 24 ? 'bg-risk-critical-solid' : 'bg-gov-saffron'}`}
                    style={{ width: `${Math.min(100, (project.schedule.timeOverrun / 72) * 100)}%` }}
                  />
                </div>
                <div className="text-[10px] font-mono text-ink-subtle text-right">
                  Timeline Extension: {((project.schedule.timeOverrun / 12)).toFixed(1)} years
                </div>
              </div>

              {/* Deadline Revision Count */}
              <div className="pt-2 border-t border-paper-subtle flex justify-between items-baseline text-xs">
                <span className="text-ink-muted">Deadline Amendments:</span>
                <span className="font-mono font-semibold text-ink">{project.schedule.deadlineRevision} revisions logged</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ==================================================
          SECTION 3 — AI RISK (PROMINENT ASSESSMENT LAYER)
          ================================================== */}
      <section id="section-risk" className="space-y-4">
        <div className="flex items-center justify-between border-b border-gov-border pb-2">
          <div>
            <span className="section-eyebrow text-gov-terracotta">Section 03 • AI Assessment</span>
            <h2 className="editorial-title text-xl text-ink">
              SANKET-AI Predictive Risk Layer
            </h2>
          </div>
          <span className="text-xs font-mono text-ink-subtle">
            Ensemble Decision-Support Model
          </span>
        </div>

        {/* Prominent Risk Banner Box */}
        <div className="bg-white border-2 border-gov-border rounded-xs shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gov-border">
            
            {/* Primary SANKET Score Box */}
            <div className="p-6 bg-paper-subtle/50 flex flex-col justify-between space-y-3">
              <div>
                <span className="section-eyebrow text-ink-subtle block mb-1">SANKET Risk Score</span>
                <div className="flex items-baseline gap-2">
                  <span className="tabular-figure text-5xl font-black text-ink">
                    {project.riskScore}
                  </span>
                  <span className="text-xs font-mono text-ink-subtle">/ 100</span>
                </div>
              </div>
              <div>
                <RiskBadge level={project.riskLevel} size="md" />
              </div>
            </div>

            {/* High-Risk Probability */}
            <div className="p-6 space-y-2 flex flex-col justify-between">
              <div>
                <span className="section-eyebrow text-gov-terracotta block">High-Risk Probability</span>
                <div className="tabular-figure text-4xl font-bold text-gov-terracotta mt-1">
                  {project.highRiskProbability}%
                </div>
              </div>
              <p className="text-xs text-ink-muted leading-tight">
                Statistical likelihood of project encountering acute delivery paralysis or critical milestone failure.
              </p>
            </div>

            {/* Cost Escalation Risk */}
            <div className="p-6 space-y-2 flex flex-col justify-between">
              <div>
                <span className="section-eyebrow text-gov-saffron block">Cost Escalation Risk</span>
                <div className="tabular-figure text-4xl font-bold text-gov-saffron mt-1">
                  {project.costEscalationRisk}%
                </div>
              </div>
              <p className="text-xs text-ink-muted leading-tight">
                Probability of requiring further financial sanction enhancement beyond current revised approved cost.
              </p>
            </div>

            {/* Deadline Slip Risk */}
            <div className="p-6 space-y-2 flex flex-col justify-between">
              <div>
                <span className="section-eyebrow text-risk-critical-solid block">Deadline Slip Risk</span>
                <div className="tabular-figure text-4xl font-bold text-risk-critical-solid mt-1">
                  {project.deadlineSlipRisk}%
                </div>
              </div>
              <p className="text-xs text-ink-muted leading-tight">
                Probability of missing the currently reported target commissioning date ({project.schedule.revisedCompletion}).
              </p>
            </div>

          </div>

          {/* Institutional Prototype Caveat */}
          <div className="bg-paper-subtle p-3.5 border-t border-gov-border flex items-start gap-2.5 text-xs text-ink-muted">
            <Info className="w-4 h-4 text-gov-terracotta shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-ink font-semibold">Statutory Decision Support Caveat: </strong>
              SANKET-AI risk scores and probabilities are generated by gradient-boosted machine learning models trained on historical infrastructure milestone trends. They represent decision-support guidance for prioritizing administrative inspections and do not constitute an automated legal determination or claim of 100% predictive certainty.
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 4 — WHY IS THIS PROJECT FLAGGED? (SHAP)
          ================================================== */}
      <section id="section-why" className="space-y-4">
        <div className="flex items-center justify-between border-b border-gov-border pb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="section-eyebrow text-gov-terracotta">Section 04 • Core Innovation</span>
              <span className="text-[10px] font-mono px-2 py-0.2 bg-gov-terracotta/10 text-gov-terracotta border border-gov-terracotta/30 font-semibold rounded-xs">
                EXPLAINABLE AI
              </span>
            </div>
            <h2 className="editorial-title text-xl text-ink">
              Why is this project flagged? (Top SHAP Feature Attribution)
            </h2>
          </div>
          <span className="text-xs font-mono text-ink-subtle hidden sm:inline">
            Quantified Feature Weights • No Speculative Root Causes
          </span>
        </div>

        <div className="bg-paper-subtle/70 p-4 border border-gov-border rounded-xs text-xs text-ink-muted leading-relaxed max-w-4xl">
          Unlike black-box AI systems, SANKET-AI isolates the mathematical drivers behind every risk score using <strong>Shapley Additive Explanations (SHAP)</strong>. Every factor below represents a measurable physical or financial parameter verified against statutory project returns.
        </div>

        {/* SHAP Attribution Cards */}
        <div className="bg-white border border-gov-border rounded-xs divide-y divide-gov-border">
          {project.shapDrivers.map((driver, idx) => {
            const isHigh = driver.impact === 'HIGH IMPACT';
            const isMedium = driver.impact === 'MEDIUM IMPACT';
            const barWidth = `${Math.min(100, Math.round(Math.abs(driver.shapValue) * 180))}%`;

            return (
              <div key={idx} className="p-5 hover:bg-paper-subtle/40 transition-colors space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-ink-subtle">
                      0{idx + 1}.
                    </span>
                    <h3 className="text-sm font-bold text-ink font-sans">
                      {driver.feature}
                    </h3>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-xs font-bold ${
                        isHigh
                          ? 'bg-risk-critical-bg text-risk-critical-text border border-risk-critical-border'
                          : isMedium
                            ? 'bg-risk-high-bg text-risk-high-text border border-risk-high-border'
                            : 'bg-risk-low-bg text-risk-low-text border border-risk-low-border'
                      }`}
                    >
                      {driver.impact}
                    </span>
                  </div>

                  <div className="text-xs font-mono text-ink-subtle">
                    Mathematical Contribution: <strong className="text-ink">{driver.shapValue > 0 ? `+${driver.shapValue.toFixed(2)}` : driver.shapValue.toFixed(2)}</strong>
                  </div>
                </div>

                {/* Relative Weight Bar */}
                <div className="w-full bg-gov-border/60 h-2 rounded-xs overflow-hidden">
                  <div
                    className={`h-full ${
                      driver.shapValue > 0
                        ? isHigh
                          ? 'bg-risk-critical-solid'
                          : 'bg-risk-high-solid'
                        : 'bg-risk-low-solid'
                    }`}
                    style={{ width: barWidth }}
                  />
                </div>

                {/* Officer Explanation */}
                <div className="bg-paper-subtle p-3 rounded-xs border border-gov-border text-xs flex items-start gap-2">
                  <span className="font-mono font-bold text-ink text-[11px] uppercase tracking-wider shrink-0 mt-0.5">
                    Measurable Signal:
                  </span>
                  <span className="text-ink-muted leading-relaxed font-sans">
                    {driver.evidence}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================================================
          SECTION 5 — EVIDENCE (MEASURABLE DATA TRACEABILITY)
          ================================================== */}
      <section id="section-evidence" className="space-y-4">
        <div className="flex items-center justify-between border-b border-gov-border pb-2">
          <div>
            <span className="section-eyebrow text-ink-subtle">Section 05 • Verification</span>
            <h2 className="editorial-title text-xl text-ink">
              Measurable Evidence & Document Citation
            </h2>
          </div>
          <span className="text-xs font-mono text-ink-subtle">
            Statutory Data Audit Trail
          </span>
        </div>

        <div className="bg-white border border-gov-border rounded-xs divide-y lg:divide-y-0 lg:divide-x divide-gov-border grid grid-cols-1 lg:grid-cols-2">
          
          {/* Concrete Measurable Data Matrix */}
          <div className="p-6 space-y-4">
            <div className="section-eyebrow text-ink-subtle">
              Verified Physical & Financial Measurements
            </div>
            
            <div className="divide-y divide-paper-subtle text-xs">
              <div className="flex items-center justify-between py-2">
                <span className="text-ink-muted">Physical Progress Reported:</span>
                <span className="font-mono font-bold text-ink text-sm">{project.progress.physicalProgress}%</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-ink-muted">Expected Progress Target:</span>
                <span className="font-mono font-medium text-ink">{project.progress.expectedProgress}%</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-ink-muted">Progress Execution Gap:</span>
                <span className={`font-mono font-bold ${project.progress.progressGap < -10 ? 'text-risk-critical-solid' : 'text-ink'}`}>
                  {project.progress.progressGap}% pts
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-ink-muted">Cumulative Time Overrun:</span>
                <span className="font-mono font-bold text-risk-critical-solid">+{project.schedule.timeOverrun} Months</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-ink-muted">Progress Stall Status:</span>
                <span className="font-mono font-bold text-risk-critical-solid">
                  {project.progress.progressStall ? 'DETECTED (Consecutive 3-mo velocity < 0.3%)' : 'None Detected'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-ink-muted">Expenditure vs Sanction:</span>
                <span className="font-mono font-medium text-ink">
                  ₹{project.cost.cumulativeExpenditure.toLocaleString()} Cr / ₹{project.cost.revisedCost.toLocaleString()} Cr
                </span>
              </div>
            </div>
          </div>

          {/* Document Citation & Audit Reference */}
          <div className="p-6 space-y-4 bg-paper-subtle/30">
            <div className="section-eyebrow text-ink-subtle">
              Statutory Source Citation & Audit Record
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-white p-3.5 border border-gov-border rounded-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-ink-muted font-mono">Document:</span>
                  <strong className="text-ink font-sans">{project.evidence.sourceReport}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted font-mono">Reporting Month:</span>
                  <span className="font-mono font-semibold text-ink">{project.evidence.reportingMonth}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted font-mono">Citation Reference:</span>
                  <span className="font-mono text-gov-terracotta font-semibold">{project.evidence.sourcePage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted font-mono">Data Validation Level:</span>
                  <span className="font-mono text-ink">Level-3 Statutory Return</span>
                </div>
              </div>

              <div className="text-[11px] text-ink-muted leading-relaxed font-sans border-l-2 border-gov-terracotta pl-3">
                <strong>Traceability Principle:</strong> SANKET-AI links all predictions to statutory flash reporting data. Review officers can directly cross-verify each metric against the official MoSPI/PAIMANA page citation.
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ==================================================
          SECTION 6 — SUGGESTED REVIEW
          ================================================== */}
      <section id="section-review" className="space-y-4">
        <div className="flex items-center justify-between border-b border-gov-border pb-2">
          <div>
            <span className="section-eyebrow text-gov-saffron">Section 06 • Decision Support</span>
            <h2 className="editorial-title text-xl text-ink">
              Suggested Administrative Review Areas
            </h2>
          </div>
          <span className="text-xs font-mono text-ink-subtle">
            Signal-Triggered Administrative Guidance
          </span>
        </div>

        <div className="bg-paper-subtle p-3 rounded-xs border border-gov-border text-xs text-ink-muted flex items-start gap-2">
          <HelpCircle className="w-4 h-4 text-gov-saffron shrink-0 mt-0.5" />
          <span>
            <strong>Administrative Advisory Only:</strong> SANKET-AI maps measurable anomaly patterns to suggested review procedures. These are actionable prompts for senior officers, not automatic administrative mandates.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {project.suggestedReviews.map(rev => (
            <div key={rev.id} className="bg-white border border-gov-border rounded-xs p-5 space-y-3 flex flex-col justify-between hover:border-gov-saffron transition-colors">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="section-eyebrow text-gov-terracotta">
                    Signal Trigger: {rev.triggerSignal}
                  </span>
                  <span className="text-[10px] font-mono text-ink-subtle">ID: {rev.id}</span>
                </div>
                <h3 className="text-sm font-bold text-ink font-sans flex items-center gap-1.5">
                  <span>→ Suggested Review:</span>
                  <span className="text-gov-saffron font-mono">{rev.suggestedActionType}</span>
                </h3>
                <p className="text-xs text-ink-muted leading-relaxed">
                  {rev.rationale}
                </p>
              </div>

              <div className="pt-3 border-t border-paper-subtle flex justify-end">
                <button
                  type="button"
                  onClick={() => handleAdoptReview(rev.suggestedActionType, rev.rationale)}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-gov-terracotta hover:text-ink px-3 py-1.5 bg-paper-subtle border border-gov-border rounded-xs hover:bg-white transition-colors"
                >
                  <span>Adopt as Action Directive ↓</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================
          SECTION 7 — ACTION / INTERVENTION (CREATE ACTION)
          ================================================== */}
      <section id="section-action-form" className="space-y-4 scroll-mt-6">
        <div className="flex items-center justify-between border-b border-gov-border pb-2">
          <div>
            <span className="section-eyebrow text-gov-teal">Section 07 • Administrative Follow-Through</span>
            <h2 className="editorial-title text-xl text-ink">
              Create Statutory Action / Intervention
            </h2>
          </div>
          <span className="text-xs font-mono text-ink-subtle">
            Formal Administrative Directive
          </span>
        </div>

        {actionSuccessMessage && (
          <div className="bg-risk-low-bg border border-risk-low-border p-3 rounded-xs text-xs text-risk-low-text flex items-center gap-2 font-mono">
            <CheckCircle2 className="w-4 h-4 text-risk-low-solid shrink-0" />
            <span>{actionSuccessMessage}</span>
          </div>
        )}

        <form onSubmit={handleCreateAction} className="bg-white border border-gov-border rounded-xs p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            
            {/* Field 1: Action Type */}
            <div className="space-y-1.5">
              <label className="section-eyebrow text-ink block">
                Action Type <span className="text-risk-critical-solid">*</span>
              </label>
              <select
                value={actionType}
                onChange={(e) => setActionType(e.target.value as ActionType)}
                className="w-full bg-paper-subtle border border-gov-border rounded-xs px-3 py-2 text-xs font-medium text-ink focus:outline-none focus:ring-1 focus:ring-gov-terracotta"
              >
                <option value="Physical Progress Verification">Physical Progress Verification</option>
                <option value="Ground Verification Audit">Ground Verification Audit</option>
                <option value="Schedule Review">Schedule Review</option>
                <option value="Cost Review">Cost Review</option>
                <option value="Constraint Review">Constraint Review</option>
                <option value="Critical Constraint Remediation">Critical Constraint Remediation</option>
              </select>
            </div>

            {/* Field 2: Assigned Officer */}
            <div className="space-y-1.5">
              <label className="section-eyebrow text-ink block">
                Assigned Officer <span className="text-risk-critical-solid">*</span>
              </label>
              <input
                type="text"
                value={assignedOfficer}
                onChange={(e) => setAssignedOfficer(e.target.value)}
                placeholder="Name & Designation"
                className="w-full bg-paper-subtle border border-gov-border rounded-xs px-3 py-2 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-gov-terracotta"
                required
              />
            </div>

            {/* Field 3: Due Date */}
            <div className="space-y-1.5">
              <label className="section-eyebrow text-ink block">
                Statutory Due Date <span className="text-risk-critical-solid">*</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-paper-subtle border border-gov-border rounded-xs px-3 py-2 text-xs font-mono text-ink focus:outline-none focus:ring-1 focus:ring-gov-terracotta"
                required
              />
            </div>

            {/* Field 4: Status */}
            <div className="space-y-1.5">
              <label className="section-eyebrow text-ink block">
                Initial Status <span className="text-risk-critical-solid">*</span>
              </label>
              <select
                value={actionStatus}
                onChange={(e) => setActionStatus(e.target.value as ActionStatus)}
                className="w-full bg-paper-subtle border border-gov-border rounded-xs px-3 py-2 text-xs font-mono font-medium text-ink focus:outline-none focus:ring-1 focus:ring-gov-terracotta"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>

          {/* Quick Officer Chips */}
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <span className="text-ink-subtle font-mono">Quick Assign:</span>
            {officerSuggestions.map((off, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setAssignedOfficer(off)}
                className="px-2 py-0.5 bg-paper-subtle hover:bg-gov-border/40 text-ink-muted border border-gov-border rounded-xs transition-colors"
              >
                {off.split(',')[0]}
              </button>
            ))}
          </div>

          {/* Field 5: Remarks / Terms of Reference */}
          <div className="space-y-1.5">
            <label className="section-eyebrow text-ink block">
              Directive Remarks / Terms of Reference <span className="text-risk-critical-solid">*</span>
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={3}
              placeholder="Enter precise operational directives, physical site coordinates, or review instructions..."
              className="w-full bg-paper-subtle border border-gov-border rounded-xs p-3 text-xs text-ink leading-relaxed focus:outline-none focus:ring-1 focus:ring-gov-terracotta"
              required
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-paper-subtle">
            <span className="text-[11px] text-ink-subtle font-mono">
              Action will be logged to the Central Action Repository and assigned officer's queue.
            </span>
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-ink hover:bg-ink-muted text-white text-xs font-mono font-bold px-5 py-2.5 rounded-xs transition-colors shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Record Statutory Action</span>
            </button>
          </div>
        </form>
      </section>

      {/* ==================================================
          SECTION 8 — ACTION HISTORY (TRACKING & TIMELINE)
          ================================================== */}
      <section id="section-action-history" className="space-y-4">
        <div className="flex items-center justify-between border-b border-gov-border pb-2">
          <div>
            <span className="section-eyebrow text-ink-subtle">Section 08 • Audit Trail</span>
            <h2 className="editorial-title text-xl text-ink">
              Action History & Statutory Follow-Up
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-ink-subtle">Logged Actions:</span>
            <span className="font-bold text-ink">{projectActions.length}</span>
          </div>
        </div>

        {projectActions.length === 0 ? (
          <div className="py-8 text-center text-xs text-ink-subtle bg-paper-subtle/50 border border-gov-border rounded-xs">
            No administrative actions recorded for this project yet. Use Section 07 above to issue an intervention directive.
          </div>
        ) : (
          <div className="space-y-3">
            {projectActions.map((action) => (
              <div
                key={action.id}
                className="bg-white border border-gov-border rounded-xs p-4 space-y-3 hover:border-gov-border transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-ink bg-paper-subtle px-2 py-0.5 border border-gov-border rounded-xs">
                      {action.id}
                    </span>
                    <span className="text-xs font-bold text-ink font-sans">
                      {action.actionType}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <ActionStatusBadge status={action.status} />
                    {/* Interactive 1-click status switcher for live demonstration */}
                    <select
                      value={action.status}
                      onChange={(e) => updateActionStatus(action.id, e.target.value as ActionStatus)}
                      className="text-[11px] font-mono bg-paper-subtle border border-gov-border rounded-xs px-2 py-0.5 text-ink focus:outline-none"
                      title="Update status"
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                  </div>
                </div>

                <p className="text-xs text-ink-muted leading-relaxed font-sans bg-paper-subtle/50 p-3 rounded-xs border border-gov-border/60">
                  {action.remarks}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-paper-subtle text-[11px] font-mono text-ink-subtle">
                  <div>
                    <span className="text-ink-subtle">Assigned: </span>
                    <strong className="text-ink font-sans">{action.assignedOfficer}</strong>
                  </div>
                  <div>
                    <span>Due Date: </span>
                    <strong className="text-ink">{action.dueDate}</strong>
                  </div>
                  <div>
                    <span>Recorded: </span>
                    <span>{action.createdDate}</span>
                  </div>
                  <div className="text-right">
                    {action.status === 'Completed' ? (
                      <span className="text-risk-low-solid font-semibold">✓ Closed {action.completedDate || 'Recently'}</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => updateActionStatus(action.id, 'Completed')}
                        className="text-gov-teal hover:underline font-semibold"
                      >
                        Mark Completed ✓
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ==================================================
          SECTION 9 — RISK TREND (HISTORICAL TRAJECTORY)
          ================================================== */}
      <section id="section-trend" className="space-y-4">
        <div className="flex items-center justify-between border-b border-gov-border pb-2">
          <div>
            <span className="section-eyebrow text-ink-subtle">Section 09 • Retrospective Trajectory</span>
            <h2 className="editorial-title text-xl text-ink">
              Historical Risk Movement (Past 6 Monitoring Cycles)
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-ink-subtle">Directional Trend:</span>
            <span className={`font-semibold flex items-center gap-1 ${
              project.trendDirection === 'Increasing' ? 'text-risk-critical-solid' :
              project.trendDirection === 'Decreasing' ? 'text-risk-low-solid' : 'text-ink'
            }`}>
              {project.trendDirection === 'Increasing' && <TrendingUp className="w-4 h-4" />}
              {project.trendDirection === 'Decreasing' && <TrendingDown className="w-4 h-4" />}
              {project.trendDirection === 'Stable' && <Minus className="w-4 h-4" />}
              {project.trendDirection.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="bg-white border border-gov-border rounded-xs p-6 space-y-6">
          
          {/* SVG Risk Trajectory Chart */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-ink-subtle">
              <span>Risk Score History (May 2025 → October 2025)</span>
              <span className="flex items-center gap-2">
                <span className="inline-block w-3 h-0.5 bg-risk-critical-solid"></span>
                <span>Critical Threshold (Score ≥ 70)</span>
              </span>
            </div>

            <div className="w-full overflow-x-auto">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-44 overflow-visible font-mono">
                {/* Horizontal reference lines */}
                <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="#E5E5DF" strokeDasharray="3 3" />
                <line x1={padding} y1={thresholdY} x2={chartWidth - padding} y2={thresholdY} stroke="#C84B31" strokeDasharray="4 4" strokeWidth="1.5" />
                <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="#D4D4CE" strokeWidth="1" />

                <text x={padding - 8} y={padding + 4} textAnchor="end" className="text-[9px] fill-ink-subtle">100</text>
                <text x={padding - 8} y={thresholdY + 3} textAnchor="end" className="text-[9px] fill-risk-critical-solid font-bold">70</text>
                <text x={padding - 8} y={chartHeight - padding + 3} textAnchor="end" className="text-[9px] fill-ink-subtle">0</text>

                {/* Shaded Area */}
                <polygon
                  points={areaPoints}
                  fill={project.trendDirection === 'Increasing' ? 'rgba(200, 75, 49, 0.08)' : 'rgba(33, 90, 80, 0.08)'}
                />

                {/* Trajectory Polyline */}
                <polyline
                  fill="none"
                  stroke={project.trendDirection === 'Increasing' ? '#C84B31' : project.trendDirection === 'Decreasing' ? '#215A50' : '#2A2E33'}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={polylinePoints}
                />

                {/* Data Points */}
                {points.map((pt, i) => (
                  <g key={i}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="4.5"
                      className="fill-white stroke-2"
                      stroke={pt.score >= 70 ? '#C84B31' : '#2A2E33'}
                    />
                    <text
                      x={pt.x}
                      y={pt.y - 10}
                      textAnchor="middle"
                      className="text-[10px] font-bold fill-ink"
                    >
                      {pt.score}
                    </text>
                    <text
                      x={pt.x}
                      y={chartHeight - padding + 15}
                      textAnchor="middle"
                      className="text-[10px] fill-ink-muted"
                    >
                      {pt.month}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Historical Data Matrix Strip */}
          <div className="bg-paper-subtle border border-gov-border rounded-xs divide-y sm:divide-y-0 sm:divide-x divide-gov-border grid grid-cols-2 sm:grid-cols-6 text-center">
            {project.riskHistory.map((point, idx) => (
              <div key={idx} className="p-3.5 space-y-1">
                <span className="text-[10px] font-mono text-ink-subtle block">{point.month}</span>
                <span className="tabular-figure text-lg font-bold text-ink block">{point.score}</span>
                <RiskBadge level={point.level} size="sm" showDot={false} />
              </div>
            ))}
          </div>

          <div className="text-[11px] text-ink-subtle font-mono text-center">
            * Purely empirical retrospective observations from past 6 cycles. SANKET-AI strictly does not generate synthetic future projections without statutory ground-truth data.
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 10 — SOURCE & STATUTORY ATTESTATION
          ================================================== */}
      <section id="section-source" className="space-y-4">
        <div className="flex items-center justify-between border-b border-gov-border pb-2">
          <div>
            <span className="section-eyebrow text-ink-subtle">Section 10 • Citation & Governance</span>
            <h2 className="editorial-title text-xl text-ink">
              Statutory Source Context & Prototype Attestation
            </h2>
          </div>
          <span className="text-xs font-mono text-ink-subtle">
            SIH 2026 Evaluation Standards
          </span>
        </div>

        <div className="bg-white border border-gov-border rounded-xs p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1 p-3.5 bg-paper-subtle rounded-xs border border-gov-border">
              <span className="section-eyebrow text-ink-subtle">Source Framework</span>
              <div className="font-bold text-ink">PAIMANA Flash Report</div>
              <p className="text-[11px] text-ink-muted">Programme and Project Monitoring Automation System</p>
            </div>

            <div className="space-y-1 p-3.5 bg-paper-subtle rounded-xs border border-gov-border">
              <span className="section-eyebrow text-ink-subtle">Reporting Month</span>
              <div className="font-bold font-mono text-ink">{MOCK_REPORTING_MONTH}</div>
              <p className="text-[11px] text-ink-muted">Reference period for all baseline physical & financial data</p>
            </div>

            <div className="space-y-1 p-3.5 bg-paper-subtle rounded-xs border border-gov-border">
              <span className="section-eyebrow text-ink-subtle">Document Citation</span>
              <div className="font-bold font-mono text-gov-terracotta">{project.evidence.sourcePage}</div>
              <p className="text-[11px] text-ink-muted">Volume 42, Central Sector Infrastructure Monitoring Division</p>
            </div>
          </div>

          <div className="bg-paper-subtle/80 p-4 border border-gov-border rounded-xs text-xs text-ink-muted space-y-2 leading-relaxed">
            <div className="flex items-center gap-2 text-ink font-semibold">
              <FileCheck className="w-4 h-4 text-gov-teal" />
              <span>Statutory Compliance & Prototype Disclosure</span>
            </div>
            <p>
              This intelligence dossier is prepared for evaluation under the <strong>Smart India Hackathon 2026 (Problem Statement SIH26103)</strong>. All project data, officer names, cost figures, and milestone returns presented are representative demonstration mock records structured strictly in accordance with official Ministry of Statistics and Programme Implementation (MoSPI) PAIMANA reporting norms.
            </p>
            <p className="text-[11px] text-ink-subtle font-mono">
              Notice: This prototype does not claim live production API access to Government of India databases.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
