import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../../components/common/EditorialHeader';
import { InformationBand } from '../../components/common/InformationBand';
import { RiskBadge } from '../../components/common/RiskBadge';
import { ShapAttributionList } from '../../components/common/ShapAttributionList';
import { EvidenceCitationPanel } from '../../components/common/EvidenceCitationPanel';
import { MOCK_PROJECTS, MOCK_REPORTING_MONTH } from '../../data/mockProjects';

export const RiskExplanationsPage: React.FC = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('615186');

  const selectedProject = MOCK_PROJECTS.find(p => p.id === selectedProjectId) || MOCK_PROJECTS[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Editorial Header */}
      <EditorialHeader
        eyebrow="Monitoring Desk • Explainable Machine Learning"
        title="SHAP Risk Attribution & Evidence Citations"
        subtitle={`Mathematical model explainability delineating exact physical and financial feature contributions to the composite SANKET-AI risk score (${MOCK_REPORTING_MONTH}). Zero synthetic administrative attributions.`}
        badge="EXPLAINABLE AI"
      />

      {/* Information Band */}
      <InformationBand
        cells={[
          { label: 'Active Explainability Model', value: 'SHAP / XGBoost', context: 'TreeExplainer Engine' },
          { label: 'Focused Project', value: `#${selectedProject.id}`, context: selectedProject.name.slice(0, 24) + '...' },
          { label: 'Calculated Risk Index', value: `${selectedProject.riskScore}/100`, context: selectedProject.riskLevel, emphasis: selectedProject.riskScore >= 80 ? 'critical' : 'high' },
          { label: 'High-Risk Probability', value: `${selectedProject.highRiskProbability}%`, context: 'Statutory Threshold' },
          { label: 'Primary Driver', value: selectedProject.shapDrivers[0]?.feature || 'Gap', context: 'High Impact Weight' },
        ]}
      />

      {/* Interactive Project Selector Bar */}
      <div className="bg-white border border-gov-border rounded-xs p-4 shadow-subtle flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-ink-subtle uppercase text-[10px]">Select Project to Explain:</span>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="bg-paper-subtle border border-gov-border rounded-xs px-3 py-1.5 text-xs font-mono text-ink max-w-md truncate focus:outline-none focus:border-ink"
          >
            {MOCK_PROJECTS.map(p => (
              <option key={p.id} value={p.id}>
                #{p.id} — {p.name} (Score: {p.riskScore})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-ink-subtle text-[11px]">Primary Warning Signal:</span>
          <span className="bg-paper-subtle px-2 py-0.5 border border-gov-border rounded-xs font-bold text-ink">
            {selectedProject.keyWarningSignal}
          </span>
        </div>
      </div>

      {/* Core Question Headline Box */}
      <div className="bg-white border border-gov-border rounded-xs p-6 shadow-subtle space-y-4">
        <div className="border-b border-gov-border pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="section-eyebrow text-ink-subtle">
              Algorithmic Root Cause Attribution
            </div>
            <h2 className="editorial-title text-xl font-bold text-ink font-serif mt-0.5">
              Why is this project flagged?
            </h2>
            <p className="text-xs text-ink-muted mt-1">
              Project #{selectedProject.id} ({selectedProject.name}) has been classified into the <strong>{selectedProject.riskLevel} Tier</strong> with a score of <strong>{selectedProject.riskScore} / 100</strong>.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <RiskBadge level={selectedProject.riskLevel} size="md" />
            <Link
              to={`/project/${selectedProject.id}`}
              className="px-3 py-1.5 bg-ink hover:bg-ink-light text-white text-xs font-mono font-bold rounded-xs transition-colors shadow-xs"
            >
              Full Intelligence Dossier →
            </Link>
          </div>
        </div>

        {/* Model Risk Probabilities Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs pt-1">
          <div className="p-3 bg-paper-subtle border border-gov-border rounded-xs">
            <span className="text-[10px] text-ink-subtle uppercase block">High-Risk Classifier Probability</span>
            <span className="text-lg font-bold text-ink tabular-figure">{selectedProject.highRiskProbability}%</span>
            <span className="text-[10px] text-ink-muted block mt-0.5">Binary Model Confidence</span>
          </div>

          <div className="p-3 bg-paper-subtle border border-gov-border rounded-xs">
            <span className="text-[10px] text-ink-subtle uppercase block">Cost Escalation Vulnerability</span>
            <span className="text-lg font-bold text-ink tabular-figure">{selectedProject.costEscalationRisk}%</span>
            <span className="text-[10px] text-ink-muted block mt-0.5">Outlay Drift Probability</span>
          </div>

          <div className="p-3 bg-paper-subtle border border-gov-border rounded-xs">
            <span className="text-[10px] text-ink-subtle uppercase block">Deadline Slip Probability</span>
            <span className="text-lg font-bold text-ink tabular-figure">{selectedProject.deadlineSlipRisk}%</span>
            <span className="text-[10px] text-ink-muted block mt-0.5">Milestone Breach Confidence</span>
          </div>
        </div>
      </div>

      {/* Split Explanation Grid: SHAP Drivers & Verifiable Fact Citations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: SHAP Attributions (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-gov-border rounded-xs p-6 shadow-subtle space-y-4">
          <div className="border-b border-gov-border pb-3">
            <div className="section-eyebrow text-ink-subtle">Feature Importance Ranking</div>
            <h3 className="editorial-title text-base font-semibold text-ink">
              Top Quantitative Drivers (SHAP Values)
            </h3>
            <p className="text-xs text-ink-muted mt-0.5 font-sans">
              Shows measurable physical and financial inputs that pushed the risk score above the baseline.
            </p>
          </div>

          <ShapAttributionList drivers={selectedProject.shapDrivers} />
        </div>

        {/* Right: Verifiable PAIMANA Citations & Suggested Review (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <EvidenceCitationPanel evidence={selectedProject.evidence} />

          {/* Suggested Reviews */}
          {selectedProject.suggestedReviews.length > 0 && (
            <div className="bg-white border border-gov-border rounded-xs p-5 shadow-subtle space-y-3">
              <div className="border-b border-gov-border pb-2">
                <div className="section-eyebrow text-ink-subtle">Recommended Statutory Review</div>
                <h4 className="editorial-title text-sm font-semibold text-ink">
                  AI-Triggered Investigation Directive
                </h4>
              </div>

              {selectedProject.suggestedReviews.map(sr => (
                <div key={sr.id} className="p-3 bg-paper-subtle border border-gov-border rounded-xs space-y-1.5 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gov-terracotta">{sr.suggestedActionType}</span>
                    <span className="text-[10px] text-ink-subtle">Ref: {sr.id}</span>
                  </div>
                  <p className="text-ink text-[11px] font-sans">
                    <strong>Trigger:</strong> {sr.triggerSignal}
                  </p>
                  <p className="text-ink-muted text-[11px] font-sans">
                    <strong>Rationale:</strong> {sr.rationale}
                  </p>
                  <div className="pt-2 text-right">
                    <Link
                      to={`/monitoring/actions?project=${selectedProject.id}`}
                      className="inline-block px-3 py-1 bg-ink text-white font-mono text-xs rounded-xs hover:bg-ink-light transition-colors"
                    >
                      Assign Review to Officer →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
