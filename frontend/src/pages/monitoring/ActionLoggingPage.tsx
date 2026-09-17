import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { EditorialHeader } from '../../components/common/EditorialHeader';
import { InformationBand } from '../../components/common/InformationBand';
import { ActionStatusBadge } from '../../components/common/ActionStatusBadge';
import { MOCK_PROJECTS, MOCK_REPORTING_MONTH } from '../../data/mockProjects';
import { useActions } from '../../context/ActionContext';
import type { ActionType, ActionStatus } from '../../types/project';

const ACTION_TYPES: ActionType[] = [
  'Physical Progress Verification',
  'Ground Verification Audit',
  'Schedule Review',
  'Cost Review',
  'Constraint Review',
  'Critical Constraint Remediation'
];

export const ActionLoggingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preselectedProject = searchParams.get('project') || '';

  const { actions, addAction, updateActionStatus, openCount, inProgressCount, completedCount, overdueCount } = useActions();

  // Quick Action Form State
  const [projectId, setProjectId] = useState<string>(preselectedProject || MOCK_PROJECTS[0].id);
  const [actionType, setActionType] = useState<ActionType>('Physical Progress Verification');
  const [dueDate, setDueDate] = useState<string>('2025-11-20');
  const [remarks, setRemarks] = useState<string>('');
  const [officerName] = useState<string>('Rajeev K. Sinha (Monitoring Officer, MoSPI)');

  const [filterTab, setFilterTab] = useState<'PENDING' | 'COMPLETED' | 'ALL'>('PENDING');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = MOCK_PROJECTS.find(p => p.id === projectId);
    if (!proj) return;

    addAction({
      projectId,
      projectName: proj.name,
      actionType,
      assignedOfficer: officerName,
      assignedOfficerRole: 'Monitoring Officer',
      dueDate,
      status: 'Open',
      remarks: remarks || `Field ${actionType} initiated by Monitoring Officer for ${proj.name}.`
    });

    setRemarks('');
  };

  const displayedActions = actions.filter(act => {
    if (filterTab === 'PENDING') return act.status !== 'Completed';
    if (filterTab === 'COMPLETED') return act.status === 'Completed';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Editorial Header */}
      <EditorialHeader
        eyebrow="Monitoring Desk • Field Operations & Enforcement"
        title="Operational Action Logging Desk"
        subtitle={`Fast-dispatch operational action console enabling monitoring officers to schedule field verifications, set due dates, add ground remarks, and log completions (${MOCK_REPORTING_MONTH}).`}
        badge="ACTION LOGGING"
      />

      {/* Information Band */}
      <InformationBand
        cells={[
          { label: 'Pending Queue', value: openCount + inProgressCount, context: 'Active Follow-Ups', emphasis: 'high' },
          { label: 'Overdue Audits', value: overdueCount, context: 'Past Target Date', emphasis: overdueCount > 0 ? 'critical' : 'positive' },
          { label: 'Completed Actions', value: completedCount, context: 'Verified This Quarter', emphasis: 'positive' },
          { label: 'Assigned Officer', value: 'Rajeev K. Sinha', context: 'MoSPI Monitoring Cell' },
          { label: 'Current Cycle', value: 'Oct 2025', context: 'PAIMANA Return' },
        ]}
      />

      {/* Quick Action Dispatch Form Panel */}
      <div className="bg-white border border-gov-border rounded-xs p-6 shadow-subtle space-y-4">
        <div className="border-b border-gov-border pb-3 flex items-center justify-between">
          <div>
            <div className="section-eyebrow text-gov-terracotta font-semibold">RAPID ACTION LOGGING</div>
            <h3 className="editorial-title text-base font-bold text-ink">
              Schedule Immediate Field Verification / Review
            </h3>
          </div>
          <span className="font-mono text-xs text-ink-subtle">Fast Dispatch Console</span>
        </div>

        <form onSubmit={handleCreate} className="space-y-4 text-xs font-mono">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] text-ink-subtle mb-1 uppercase font-semibold">Target Monitored Project</label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full bg-paper-subtle border border-gov-border rounded-xs p-2 text-xs text-ink font-mono focus:outline-none focus:border-ink"
              >
                {MOCK_PROJECTS.map(p => (
                  <option key={p.id} value={p.id}>
                    #{p.id} — {p.name.slice(0, 38)}...
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-ink-subtle mb-1 uppercase font-semibold">Intervention Action Type</label>
              <select
                value={actionType}
                onChange={(e) => setActionType(e.target.value as ActionType)}
                className="w-full bg-paper-subtle border border-gov-border rounded-xs p-2 text-xs text-ink font-mono focus:outline-none focus:border-ink"
              >
                {ACTION_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-ink-subtle mb-1 uppercase font-semibold">Compliance Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-paper-subtle border border-gov-border rounded-xs p-2 text-xs text-ink font-mono focus:outline-none focus:border-ink"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-ink-subtle mb-1 uppercase font-semibold">
              Ground Verification Scope & Directives
            </label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g., Joint on-site inspection of track laying compaction, batching plant run-rates, or contractor labor muster roll..."
              className="w-full bg-paper-subtle border border-gov-border rounded-xs p-2 text-xs text-ink focus:outline-none focus:border-ink font-mono"
              required
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gov-border/60">
            <span className="text-[11px] text-ink-subtle font-mono">
              Action logged under statutory authority: {officerName}
            </span>
            <button
              type="submit"
              className="px-5 py-2 bg-ink hover:bg-ink-light text-white font-mono text-xs font-bold rounded-xs transition-colors shadow-xs"
            >
              + Dispatch Action Directive
            </button>
          </div>
        </form>
      </div>

      {/* Queue View Switcher */}
      <div className="flex items-center justify-between border-b border-gov-border pb-3">
        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            onClick={() => setFilterTab('PENDING')}
            className={`px-3 py-1.5 rounded-xs border transition-colors ${
              filterTab === 'PENDING'
                ? 'bg-ink text-white font-bold border-ink'
                : 'bg-paper-subtle text-ink hover:bg-gov-border border-gov-border'
            }`}
          >
            Active Actions Queue ({openCount + inProgressCount + overdueCount})
          </button>
          <button
            onClick={() => setFilterTab('COMPLETED')}
            className={`px-3 py-1.5 rounded-xs border transition-colors ${
              filterTab === 'COMPLETED'
                ? 'bg-ink text-white font-bold border-ink'
                : 'bg-paper-subtle text-ink hover:bg-gov-border border-gov-border'
            }`}
          >
            Completed Archive ({completedCount})
          </button>
          <button
            onClick={() => setFilterTab('ALL')}
            className={`px-3 py-1.5 rounded-xs border transition-colors ${
              filterTab === 'ALL'
                ? 'bg-ink text-white font-bold border-ink'
                : 'bg-paper-subtle text-ink hover:bg-gov-border border-gov-border'
            }`}
          >
            All Logged Actions ({actions.length})
          </button>
        </div>

        <span className="font-mono text-xs text-ink-subtle">
          Showing {displayedActions.length} action items
        </span>
      </div>

      {/* Operational Actions Queue Table */}
      <div className="bg-white border border-gov-border rounded-xs shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Action ID & Project</th>
                <th>Type</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Verification Scope & Remarks</th>
                <th className="text-right">Quick Follow-Up</th>
              </tr>
            </thead>
            <tbody>
              {displayedActions.map(act => (
                <tr key={act.id} className="hover:bg-paper-subtle/50 transition-colors">
                  <td className="max-w-xs">
                    <span className="font-mono text-[10px] text-ink-subtle block font-semibold">{act.id}</span>
                    <Link to={`/project/${act.projectId}`} className="font-semibold text-ink hover:text-gov-terracotta text-xs block">
                      {act.projectName}
                    </Link>
                    <span className="text-[10px] text-ink-subtle font-mono">Ref: #{act.projectId}</span>
                  </td>
                  <td>
                    <span className="font-mono text-xs font-semibold text-ink bg-paper-subtle px-2 py-0.5 border border-gov-border rounded-xs inline-block">
                      {act.actionType}
                    </span>
                  </td>
                  <td className="font-mono text-xs">
                    <span className={act.status === 'Overdue' ? 'text-risk-critical-solid font-bold' : 'text-ink'}>
                      {act.dueDate}
                    </span>
                    {act.status === 'Overdue' && (
                      <span className="block text-[9px] font-mono text-risk-critical-solid uppercase font-bold">Past Due</span>
                    )}
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <ActionStatusBadge status={act.status} />
                      <select
                        value={act.status}
                        onChange={(e) => updateActionStatus(act.id, e.target.value as ActionStatus)}
                        className="text-[10px] font-mono bg-paper-subtle border border-gov-border rounded-xs px-1 py-0.5 text-ink focus:outline-none"
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Overdue">Overdue</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </td>
                  <td className="max-w-sm">
                    <p className="text-xs text-ink-muted leading-relaxed font-sans line-clamp-2">
                      {act.remarks}
                    </p>
                    <span className="text-[9px] font-mono text-ink-subtle block mt-0.5">
                      By: {act.assignedOfficer} • Date: {act.createdDate}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {act.status !== 'Completed' && (
                        <button
                          onClick={() => updateActionStatus(act.id, 'Completed')}
                          className="px-2.5 py-1 text-xs font-mono font-bold bg-gov-teal hover:bg-gov-teal-dark text-white rounded-xs transition-colors shadow-xs"
                          title="Mark action complete"
                        >
                          Complete ✓
                        </button>
                      )}
                      <Link
                        to={`/project/${act.projectId}`}
                        className="px-2 py-1 text-xs font-mono text-gov-terracotta hover:underline font-semibold"
                      >
                        Dossier →
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
