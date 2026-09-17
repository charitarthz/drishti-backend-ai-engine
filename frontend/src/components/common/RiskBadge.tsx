import React from 'react';
import type { RiskLevel } from '../../types/project';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  size = 'md',
  showDot = true
}) => {
  const getStyles = () => {
    switch (level) {
      case 'Critical':
        return {
          bg: 'bg-[#FEF2F2]',
          text: 'text-[#991B1B]',
          border: 'border-[#F87171]',
          dot: 'bg-[#DC2626]',
        };
      case 'High':
        return {
          bg: 'bg-[#FFF7ED]',
          text: 'text-[#C2410C]',
          border: 'border-[#FB923C]',
          dot: 'bg-[#EA580C]',
        };
      case 'Medium':
        return {
          bg: 'bg-[#FEFCE8]',
          text: 'text-[#854D0E]',
          border: 'border-[#FACC15]',
          dot: 'bg-[#CA8A04]',
        };
      case 'Low':
        return {
          bg: 'bg-[#F0FDF4]',
          text: 'text-[#166534]',
          border: 'border-[#86EFAC]',
          dot: 'bg-[#16A34A]',
        };
    }
  };

  const s = getStyles();
  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-xs px-2.5 py-0.5',
    lg: 'text-xs px-3 py-1 font-medium',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider rounded-xs border ${s.bg} ${s.text} ${s.border} ${sizeClasses}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />}
      <span>{level} Risk</span>
    </span>
  );
};

interface RiskScoreDisplayProps {
  score: number;
  level: RiskLevel;
  size?: 'normal' | 'hero';
}

export const RiskScoreDisplay: React.FC<RiskScoreDisplayProps> = ({
  score,
  level,
  size = 'normal'
}) => {
  if (size === 'hero') {
    return (
      <div className="flex items-baseline gap-2">
        <span className="tabular-figure text-4xl font-bold text-ink tracking-tight">
          {score}
        </span>
        <span className="text-xs font-mono text-ink-subtle">/ 100</span>
        <div className="ml-2">
          <RiskBadge level={level} size="md" />
        </div>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2">
      <span className="tabular-figure text-sm font-bold text-ink">
        {score}
      </span>
      <span className="text-[10px] font-mono text-ink-subtle">/100</span>
      <RiskBadge level={level} size="sm" />
    </div>
  );
};
