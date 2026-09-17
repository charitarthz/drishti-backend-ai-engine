import React from 'react';
import type { CostHealth, ProgressHealth, ScheduleHealth } from '../../types/project';

interface HealthBaselinePillarsProps {
  cost: CostHealth;
  progress: ProgressHealth;
  schedule: ScheduleHealth;
}

export const HealthBaselinePillars: React.FC<HealthBaselinePillarsProps> = ({
  cost,
  progress,
  schedule
}) => {
  return (
    <div className="bg-white border border-gov-border rounded-xs divide-y lg:divide-y-0 lg:divide-x divide-gov-border grid grid-cols-1 lg:grid-cols-3">
      {/* Pillar 1: Cost Parameters */}
      <div className="p-5 space-y-3.5">
        <div className="flex items-center justify-between border-b border-gov-border pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-xs bg-gov-saffron"></span>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-ink">
              Cost Parameters
            </h3>
          </div>
          <span className="text-[10px] font-mono text-ink-subtle">
            {cost.costRevisionCount} {cost.costRevisionCount === 1 ? 'Revision' : 'Revisions'}
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between py-1 border-b border-paper-subtle">
            <span className="text-ink-muted">Original Sanction Cost</span>
            <span className="tabular-figure font-medium text-ink">
              ₹{cost.originalApprovedCost.toLocaleString()} Cr
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-paper-subtle">
            <span className="text-ink-muted">Revised Approved Cost</span>
            <span className="tabular-figure font-semibold text-ink">
              ₹{cost.revisedCost.toLocaleString()} Cr
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-paper-subtle">
            <span className="text-ink-muted">Cumulative Expenditure</span>
            <span className="tabular-figure text-ink">
              ₹{cost.cumulativeExpenditure.toLocaleString()} Cr
            </span>
          </div>
          <div className="flex justify-between py-1 bg-paper-subtle px-2 rounded-xs">
            <span className="font-medium text-ink">Reported Cost Overrun</span>
            <span className={`tabular-figure font-bold ${cost.costOverrunPercent > 10 ? 'text-risk-critical-solid' : 'text-ink'}`}>
              +{cost.costOverrunPercent}% (₹{(cost.revisedCost - cost.originalApprovedCost).toLocaleString()} Cr)
            </span>
          </div>
        </div>
      </div>

      {/* Pillar 2: Physical Progress */}
      <div className="p-5 space-y-3.5">
        <div className="flex items-center justify-between border-b border-gov-border pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-xs bg-gov-teal"></span>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-ink">
              Physical Progress
            </h3>
          </div>
          {progress.progressStall ? (
            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-risk-critical-bg text-risk-critical-text border border-risk-critical-border font-bold">
              STALL SIGNAL
            </span>
          ) : (
            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-risk-low-bg text-risk-low-text border border-risk-low-border">
              ACTIVE
            </span>
          )}
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between py-1 border-b border-paper-subtle">
            <span className="text-ink-muted">Reported Physical Progress</span>
            <span className="tabular-figure font-bold text-ink text-sm">
              {progress.physicalProgress}%
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-paper-subtle">
            <span className="text-ink-muted">Milestone Expected Target</span>
            <span className="tabular-figure text-ink">
              {progress.expectedProgress}%
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-paper-subtle">
            <span className="text-ink-muted">Monthly Velocity</span>
            <span className="tabular-figure text-ink">
              {progress.progressRate}% / month
            </span>
          </div>
          <div className="flex justify-between py-1 bg-paper-subtle px-2 rounded-xs">
            <span className="font-medium text-ink">Execution Progress Gap</span>
            <span className={`tabular-figure font-bold ${progress.progressGap < -10 ? 'text-risk-critical-solid' : 'text-ink'}`}>
              {progress.progressGap}% pts
            </span>
          </div>
        </div>
      </div>

      {/* Pillar 3: Schedule & Slippage */}
      <div className="p-5 space-y-3.5">
        <div className="flex items-center justify-between border-b border-gov-border pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-xs bg-ink-muted"></span>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-ink">
              Schedule & Milestones
            </h3>
          </div>
          <span className="text-[10px] font-mono text-ink-subtle">
            {schedule.deadlineRevision} {schedule.deadlineRevision === 1 ? 'Extension' : 'Extensions'}
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between py-1 border-b border-paper-subtle">
            <span className="text-ink-muted">Planned Commissioning Date</span>
            <span className="font-mono text-ink">
              {schedule.plannedCompletion}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-paper-subtle">
            <span className="text-ink-muted">Revised Target Date</span>
            <span className="font-mono font-semibold text-ink">
              {schedule.revisedCompletion}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-paper-subtle">
            <span className="text-ink-muted">Milestone Amendments</span>
            <span className="tabular-figure text-ink">
              {schedule.deadlineRevision} revisions logged
            </span>
          </div>
          <div className="flex justify-between py-1 bg-paper-subtle px-2 rounded-xs">
            <span className="font-medium text-ink">Cumulative Timeline Slippage</span>
            <span className={`tabular-figure font-bold ${schedule.timeOverrun > 12 ? 'text-risk-critical-solid' : 'text-ink'}`}>
              +{schedule.timeOverrun} Months
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
