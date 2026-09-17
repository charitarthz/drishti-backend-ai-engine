import React from 'react';
import type { ProjectIntelligence } from '../../types/project';
import { RiskScoreDisplay } from './RiskBadge';
import { Building2, MapPin, FileText } from 'lucide-react';

interface ProjectIdentityBannerProps {
  project: ProjectIntelligence;
}

export const ProjectIdentityBanner: React.FC<ProjectIdentityBannerProps> = ({ project }) => {
  return (
    <div className="bg-white border-y border-gov-border p-6 lg:p-8 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        <div className="space-y-3 max-w-4xl">
          {/* Top Identifier Row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold text-ink bg-paper-subtle px-2 py-0.5 border border-gov-border rounded-xs">
              PROJECT ID: #{project.id}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-xs font-mono font-medium bg-paper-subtle text-ink-muted border border-gov-border">
              {project.status}
            </span>
            <span className="text-xs text-gov-border">•</span>
            <span className="text-xs text-ink-subtle font-mono">
              Sanction: {project.sanctionDate}
            </span>
          </div>

          {/* Project Title */}
          <h1 className="editorial-title text-2xl sm:text-3xl lg:text-4xl text-ink leading-tight">
            {project.name}
          </h1>

          {/* Structured Metadata Row */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 pt-2 text-xs text-ink-muted">
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-ink-subtle shrink-0" />
              <span>
                <strong className="text-ink font-semibold">Ministry: </strong>
                {project.ministry}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-ink-subtle font-bold">§</span>
              <span>
                <strong className="text-ink font-semibold">Sector: </strong>
                {project.sector}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-ink-subtle shrink-0" />
              <span>
                <strong className="text-ink font-semibold">Location: </strong>
                {project.state} {project.district ? `(${project.district})` : ''}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-ink-subtle shrink-0" />
              <span>
                <strong className="text-ink font-semibold">Agency: </strong>
                {project.implementingAgency}
              </span>
            </div>
          </div>
        </div>

        {/* Intelligence Summary Stamp */}
        <div className="shrink-0 bg-paper-subtle p-5 border border-gov-border rounded-xs text-right min-w-[220px]">
          <div className="section-eyebrow text-ink-subtle mb-1.5">
            SANKET Composite Risk
          </div>
          <div className="flex justify-end">
            <RiskScoreDisplay score={project.riskScore} level={project.riskLevel} size="hero" />
          </div>
          <div className="mt-3 pt-2.5 border-t border-gov-border text-[11px] text-ink-muted font-mono leading-tight">
            Key Signal: <strong className="text-ink font-semibold">{project.keyWarningSignal}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
