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

export const ActionsInterventionsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preselectedProject = searchParams.get('project') || '';

  const { actions, addAction, updateActionStatus, openCount, inProgressCount, completedCount, overdueCount } = useActions();

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [projectFilter, setProjectFilter] = useState<string>(preselectedProject || 'ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  // Form State
  const [newProjectId, setNewProjectId] = useState<string>(preselectedProject || MOCK_PROJECTS[0].id);
  const [newActionType, setNewActionType] = useState<ActionType>('Physical Progress Verification');
  const [newOfficer, setNewOfficer] = useState<string>('Rajeshwar Singh (Director - Projects, MoSPI)');
  const [newRole, setNewRole] = useState<string>('Monitoring Officer');
  const [newDueDate, setNewDueDate] = useState<string>('2025-11-30');
  const [newRemarks, setNewRemarks] = useState<string>('');

  const filteredActions = actions.filter(a => {
    const matchStatus = statusFilter === 'ALL' || a.status === statusFilter;
    const matchType = typeFilter === 'ALL' || a.actionType === typeFilter;
    const matchProject = projectFilter === 'ALL' || a.projectId === projectFilter;
    return matchStatus && matchType && matchProject;
  });

  const handleCreateAction = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = MOCK_PROJECTS.find(p => p.id === newProjectId);
    if (!proj) return;

    addAction({
      projectId: newProjectId,
      projectName: proj.name,
      actionType: newActionType,
      assignedOfficer: newOfficer,
      assignedOfficerRole: newRole,
      dueDate: newDueDate,
      status: 'Open',
      remarks: newRemarks || `Statutory ${newActionType} convened under PAIMANA review cycle.`
    });

    setIsCreateModalOpen(false);
    setNewRemarks('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Editorial Header */}
      <EditorialHeader
        eyebrow="Administrator Portfolio • Compliance & Intervention Enforcement"
        title="Statutory Actions & Field Interventions Register"
        subtitle={`Administrative mandate enforcing on-site physical verifications, constraint remediations, and schedule audit follow-ups across field project units (${MOCK_REPORTING_MONTH}).`}
        badge="INTERVENTION WORKSPACE"
        actions={
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-ink hover:bg-ink-light text-white text-xs font-mono font-medium rounded-xs transition-colors shadow-xs flex items-center gap-1.5"
          >
            <span>+</span>
            <span>Create Statutory Action</span>
          </button>
        }
      />

      {/* Information Band */}
      <InformationBand
        cells={[
          { label: 'Total Interventions', value: actions.length, context: 'Logged Actions' },
          { label: 'Open Actions', value: openCount, context: 'Awaiting Initiation', emphasis: 'high' },
          { label: 'In Progress', value: inProgressCount, context: 'Active Field Audits' },
          { label: 'Overdue Reviews', value: overdueCount, context: 'Action Required', emphasis: 'critical' },
          { label: 'Completed Actions', value: completedCount, context: 'Verified & Closed', emphasis: 'positive' },
        ]}
      />

      {/* Filters Toolbar */}
      <div className="bg-white border border-gov-border rounded-xs p-4 shadow-subtle flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 text-xs font-mono">
        {/* Status Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-[10px] text-ink-subtle uppercase">Status:</span>
          {['ALL', 'Open', 'In Progress', 'Overdue', 'Completed'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-xs border transition-colors ${
                statusFilter === st
                  ? 'bg-ink text-white font-bold border-ink'
                  : 'bg-paper-subtle text-ink hover:bg-gov-border border-gov-border'
              }`}
            >
              {st === 'ALL' ? 'All' : st}
            </button>
          ))}
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-ink-subtle text-[11px]">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-paper-subtle border border-gov-border rounded-xs px-2 py-1 text-xs font-mono text-ink max-w-xs truncate"
            >
              <option value="ALL">All Types</option>
              {ACTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-ink-subtle text-[11px]">Project:</span>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="bg-paper-subtle border border-gov-border rounded-xs px-2 py-1 text-xs font-mono text-ink max-w-xs truncate"
            >
              <option value="ALL">All Projects</option>
              {MOCK_PROJECTS.map(p => <option key={p.id} value={p.id}>#{p.id} - {p.name}</option>)}
            </select>
          </div>

          {(statusFilter !== 'ALL' || typeFilter !== 'ALL' || projectFilter !== 'ALL') && (
            <button
              onClick={() => { setStatusFilter('ALL'); setTypeFilter('ALL'); setProjectFilter('ALL'); }}
              className="text-[11px] text-gov-terracotta hover:underline"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Action Items Master Register Table */}
      <div className="bg-white border border-gov-border rounded-xs shadow-subtle overflow-hidden">
        <div className="px-6 py-3.5 border-b border-gov-border flex items-center justify-between">
          <span className="font-mono text-xs text-ink">
            Displaying <strong className="font-bold">{filteredActions.length}</strong> statutory intervention items
          </span>
          <span className="font-mono text-[11px] text-ink-subtle">
            Select status dropdown to update compliance milestone
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Action ID & Project</th>
                <th>Intervention Type</th>
                <th>Assigned Officer & Authority</th>
                <th>Due Date</th>
                <th>Status (Update)</th>
                <th>Audit Scope & Remarks</th>
                <th className="text-right">Project Dossier</th>
              </tr>
            </thead>
            <tbody>
              {filteredActions.map((act) => (
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
                  <td className="text-xs text-ink">
                    <div className="font-medium">{act.assignedOfficer}</div>
                    <div className="text-[10px] font-mono text-ink-subtle">{act.assignedOfficerRole}</div>
                  </td>
                  <td>
                    <span className={`font-mono text-xs tabular-figure ${
                      act.status === 'Overdue' ? 'text-risk-critical-solid font-bold' : 'text-ink'
                    }`}>
                      {act.dueDate}
                    </span>
                    {act.status === 'Overdue' && (
                      <span className="block text-[9px] font-mono text-risk-critical-solid uppercase font-bold">Past Due</span>
                    )}
                  </td>
                  <td>
                    {/* Interactive Status Selector */}
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
                    <p className="text-xs text-ink-muted leading-relaxed line-clamp-2">
                      {act.remarks}
                    </p>
                    <span className="text-[9px] font-mono text-ink-subtle block mt-0.5">
                      Logged: {act.createdDate} {act.completedDate && `• Closed: ${act.completedDate}`}
                    </span>
                  </td>
                  <td className="text-right">
                    <Link
                      to={`/project/${act.projectId}`}
                      className="inline-block text-xs font-mono font-medium text-gov-terracotta hover:underline px-2 py-1 bg-paper-subtle border border-gov-border rounded-xs"
                    >
                      Dossier →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Institutional Create Action Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white border border-gov-border rounded-xs shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="border-b border-gov-border pb-3 flex items-center justify-between">
              <div>
                <div className="section-eyebrow text-ink-subtle">Statutory Accountability Protocol</div>
                <h3 className="editorial-title text-base font-bold text-ink">
                  Log New Project Intervention Action
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-ink-subtle hover:text-ink font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAction} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[11px] text-ink-subtle mb-1 uppercase">Target Project</label>
                <select
                  value={newProjectId}
                  onChange={(e) => setNewProjectId(e.target.value)}
                  className="w-full bg-paper-subtle border border-gov-border rounded-xs p-2 text-xs text-ink"
                >
                  {MOCK_PROJECTS.map(p => (
                    <option key={p.id} value={p.id}>
                      #{p.id} — {p.name} ({p.sector})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-ink-subtle mb-1 uppercase">Intervention Action Type</label>
                <select
                  value={newActionType}
                  onChange={(e) => setNewActionType(e.target.value as ActionType)}
                  className="w-full bg-paper-subtle border border-gov-border rounded-xs p-2 text-xs text-ink"
                >
                  {ACTION_TYPES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-ink-subtle mb-1 uppercase">Assigned Officer</label>
                  <input
                    type="text"
                    value={newOfficer}
                    onChange={(e) => setNewOfficer(e.target.value)}
                    className="w-full bg-paper-subtle border border-gov-border rounded-xs p-2 text-xs text-ink"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-ink-subtle mb-1 uppercase">Officer Role</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full bg-paper-subtle border border-gov-border rounded-xs p-2 text-xs text-ink"
                  >
                    <option value="Monitoring Officer">Monitoring Officer</option>
                    <option value="Administrator">Administrator</option>
                    <option value="Joint Secretary">Joint Secretary</option>
                    <option value="Chief Engineer">Chief Engineer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-ink-subtle mb-1 uppercase">Target Due Date</label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full bg-paper-subtle border border-gov-border rounded-xs p-2 text-xs text-ink"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] text-ink-subtle mb-1 uppercase">Action Scope & Directives</label>
                <textarea
                  rows={3}
                  value={newRemarks}
                  onChange={(e) => setNewRemarks(e.target.value)}
                  placeholder="Specify on-site inspection requirements, contractor accountability clauses, or inter-agency clearings..."
                  className="w-full bg-paper-subtle border border-gov-border rounded-xs p-2 text-xs text-ink focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gov-border">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3.5 py-1.5 bg-paper-subtle hover:bg-gov-border border border-gov-border text-ink rounded-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-ink hover:bg-ink-light text-white font-bold rounded-xs transition-colors shadow-xs"
                >
                  Create & Dispatch Action Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
