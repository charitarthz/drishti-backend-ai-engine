import React from 'react';

interface MetricCell {
  label: string;
  value: React.ReactNode;
  context?: string;
  emphasis?: 'default' | 'critical' | 'high' | 'positive';
}

interface InformationBandProps {
  cells: MetricCell[];
  className?: string;
}

export const InformationBand: React.FC<InformationBandProps> = ({ cells, className = '' }) => {
  return (
    <div className={`bg-white border-y border-gov-border ${className}`}>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-y md:divide-y-0 md:divide-x divide-gov-border">
        {cells.map((cell, index) => {
          const getEmphasisStyle = () => {
            switch (cell.emphasis) {
              case 'critical':
                return 'text-risk-critical-solid bg-risk-critical-bg/40';
              case 'high':
                return 'text-risk-high-solid bg-risk-high-bg/40';
              case 'positive':
                return 'text-risk-low-solid bg-risk-low-bg/40';
              default:
                return 'text-ink';
            }
          };

          return (
            <div key={index} className={`p-4 ${cell.emphasis ? getEmphasisStyle() : ''}`}>
              <div className="section-eyebrow text-ink-subtle mb-1">
                {cell.label}
              </div>
              <div className="tabular-figure text-2xl font-semibold leading-tight">
                {cell.value}
              </div>
              {cell.context && (
                <div className="text-[11px] text-ink-muted mt-1 leading-tight font-sans">
                  {cell.context}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
