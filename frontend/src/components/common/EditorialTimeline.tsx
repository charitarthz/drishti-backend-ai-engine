import React from 'react';
import type { ActionItem } from '../../types/project';
import { ActionStatusBadge } from './ActionStatusBadge';
import { Link } from 'react-router-dom';

interface EditorialTimelineProps {
  actions: ActionItem[];
  showProjectLink?: boolean;
}

export const EditorialTimeline: React.FC<EditorialTimelineProps> = ({
  actions,
  showProjectLink = false
}) => {
  if (actions.length === 0) {
    return (
      <div className="py-6 text-center text-xs text-ink-subtle bg-paper-subtle/50 border border-gov-border rounded-xs">
        No administrative interventions recorded in this cycle.
      </div>
    );
  }

  return (
    <div className="relative border-l border-gov-border ml-3 my-2 space-y-5">
      {actions.map((act) => (
        <div key={act.id} className="relative pl-6">
          {/* Node square */}
          <div className="absolute -left-1 top-1.5 w-2 h-2 rounded-xs bg-ink-muted border border-white" />

          <div className="bg-white border border-gov-border p-4 rounded-xs space-y-2">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-ink">
                    {act.id}
                  </span>
                  <span className="text-gov-border">•</span>
                  <span className="text-xs font-semibold text-ink">
                    {act.actionType}
                  </span>
                </div>
                {showProjectLink && (
                  <Link
                    to={`/project/${act.projectId}`}
                    className="text-xs text-gov-terracotta hover:underline block mt-0.5"
                  >
                    #{act.projectId} — {act.projectName}
                  </Link>
                )}
              </div>

              <ActionStatusBadge status={act.status} />
            </div>

            <p className="text-xs text-ink-muted leading-relaxed font-sans bg-paper-subtle/70 p-2.5 rounded-xs border border-gov-border/50">
              {act.remarks}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-ink-subtle border-t border-paper-subtle pt-2 font-mono">
              <div>
                <span className="text-ink-subtle">Assigned: </span>
                <strong className="text-ink font-sans font-medium">{act.assignedOfficer}</strong>
              </div>
              <div>
                <span>Due Date: </span>
                <span className="text-ink font-semibold">{act.dueDate}</span>
              </div>
              <div>
                <span>Recorded: </span>
                <span>{act.createdDate}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
