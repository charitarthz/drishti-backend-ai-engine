import React from 'react';
import type { EvidenceRecord } from '../../types/project';

interface EvidenceCitationPanelProps {
  evidence: EvidenceRecord;
}

export const EvidenceCitationPanel: React.FC<EvidenceCitationPanelProps> = ({ evidence }) => {
  return (
    <div className="bg-white border border-gov-border rounded-xs divide-y md:divide-y-0 md:divide-x divide-gov-border grid grid-cols-1 md:grid-cols-2">
      {/* Citation Metadata Block */}
      <div className="p-5 space-y-3">
        <div className="section-eyebrow text-ink-subtle">
          Traceable Audit Citation
        </div>
        <div className="space-y-1.5 text-xs">
          <div>
            <span className="text-ink-muted">Monitored Document: </span>
            <strong className="text-ink">{evidence.sourceReport}</strong>
          </div>
          <div>
            <span className="text-ink-muted">Reporting Review Period: </span>
            <span className="font-mono text-ink font-semibold">{evidence.reportingMonth}</span>
          </div>
          <div>
            <span className="text-ink-muted">Official Reference Code: </span>
            <span className="font-mono text-ink">{evidence.sourcePage}</span>
          </div>
        </div>
        <div className="pt-2 text-[11px] text-ink-subtle border-t border-paper-subtle leading-relaxed">
          Extracted from statutory progress returns submitted under Ministry of Statistics & Programme Implementation guidelines.
        </div>
      </div>

      {/* Reported Facts Verification */}
      <div className="p-5 space-y-3">
        <div className="section-eyebrow text-ink-subtle">
          Verifiable Baseline Field Milestones
        </div>
        <div className="space-y-2 text-xs">
          {evidence.verifiableFacts.map((fact, idx) => (
            <div key={idx} className="flex items-center justify-between py-1 border-b border-paper-subtle last:border-0">
              <span className="text-ink-muted">{fact.label}</span>
              <span className="tabular-figure font-medium text-ink text-right">{fact.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
