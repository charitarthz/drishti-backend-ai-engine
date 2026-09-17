import React from 'react';
import type { ActionStatus } from '../../types/project';

interface ActionStatusBadgeProps {
  status: ActionStatus;
}

export const ActionStatusBadge: React.FC<ActionStatusBadgeProps> = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case 'Completed':
        return 'bg-risk-low-bg text-risk-low-text border-risk-low-border';
      case 'In Progress':
        return 'bg-risk-medium-bg text-risk-medium-text border-risk-medium-border';
      case 'Overdue':
        return 'bg-risk-critical-bg text-risk-critical-text border-risk-critical-border';
      case 'Open':
      default:
        return 'bg-paper-subtle text-ink-muted border-gov-border';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-xs border font-medium ${getStyles()}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      <span>{status}</span>
    </span>
  );
};
