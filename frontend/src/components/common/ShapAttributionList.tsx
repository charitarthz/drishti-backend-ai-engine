import React from 'react';
import type { ShapDriver } from '../../types/project';

interface ShapAttributionListProps {
  drivers: ShapDriver[];
}

export const ShapAttributionList: React.FC<ShapAttributionListProps> = ({ drivers }) => {
  return (
    <div className="bg-white border border-gov-border rounded-xs divide-y divide-gov-border">
      {drivers.map((d, index) => {
        const isHigh = d.impact === 'HIGH IMPACT';
        const isMedium = d.impact === 'MEDIUM IMPACT';
        const barWidth = `${Math.min(100, Math.round(Math.abs(d.shapValue) * 180))}%`;

        return (
          <div key={index} className="p-4 hover:bg-paper-subtle/50 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-ink font-sans">
                  {d.feature}
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-xs font-semibold ${
                    isHigh
                      ? 'bg-risk-critical-bg text-risk-critical-text border border-risk-critical-border'
                      : isMedium
                        ? 'bg-risk-high-bg text-risk-high-text border border-risk-high-border'
                        : 'bg-risk-low-bg text-risk-low-text border border-risk-low-border'
                  }`}
                >
                  {d.impact}
                </span>
              </div>

              <div className="text-xs font-mono text-ink-subtle">
                SHAP Contribution: <span className="font-semibold text-ink">{d.shapValue > 0 ? `+${d.shapValue.toFixed(2)}` : d.shapValue.toFixed(2)}</span>
              </div>
            </div>

            {/* Relative Weight Attribution Line */}
            <div className="w-full bg-gov-border h-1.5 rounded-xs overflow-hidden mb-2">
              <div
                className={`h-full ${
                  d.shapValue > 0
                    ? isHigh
                      ? 'bg-risk-critical-solid'
                      : 'bg-risk-high-solid'
                    : 'bg-risk-low-solid'
                }`}
                style={{ width: barWidth }}
              />
            </div>

            <div className="text-xs text-ink-muted flex items-baseline gap-1.5 font-sans">
              <span className="font-semibold text-ink text-[11px] uppercase tracking-wider font-mono">
                Measurable Signal:
              </span>
              <span>{d.evidence}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
