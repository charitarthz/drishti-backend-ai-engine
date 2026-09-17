import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../../components/common/EditorialHeader';
import { InformationBand } from '../../components/common/InformationBand';
import { MOCK_PROJECTS, MOCK_REPORTING_MONTH } from '../../data/mockProjects';

// Helper to estimate project age from sanction date to Oct 2025
const calculateAge = (sanctionDate: string): string => {
  const parts = sanctionDate.split(' ');
  if (parts.length < 2) return 'Active';
  const year = parseInt(parts[1], 10);
  if (isNaN(year)) return 'Active';
  const diffYears = 2025 - year;
  return `${diffYears} yrs`;
};

// Helper to derive schedule bottleneck push indicators from verifiable facts
const getPushIndicator = (p: typeof MOCK_PROJECTS[0]): string => {
  if (p.id === '615191') return 'CRS Statutory Safety Certification Pending';
  if (p.id === '615186') return 'Sub-grade & Track Laying Interface Delay';
  if (p.id === '611602') return 'Terminal MEP & DGCA Flight Calibration Review';
  if (p.id === '400010') return 'Right-of-Way Removal & ROB Structure Lag';
  if (p.id === '510924') return 'Process Unit Engineering Scope Modifications';
  if (p.id === '318920') return 'Underground TBM Tunneling Breakthrough Delay';
  if (p.id === '820144') return 'Winter Execution Stoppage & 33kV Feeder Line';
  if (p.id === '504112') return 'Gasifier Island Cryogenic Piping Deliveries';
  if (p.id === '210945') return 'Evacuation Rail Connectivity Tunnel Lag';
  if (p.id === '412890') return 'Depot & Viaduct Power Line Relocation';
  return 'Milestone Dependency Scheduled';
};

export const ScheduleSlippagePage: React.FC = () => {
  const [filterDelayThreshold, setFilterDelayThreshold] = useState<'ALL' | 'DELAY_36' | 'REVISIONS_3'>('ALL');

  const total = MOCK_PROJECTS.length;
  const severeDelays = MOCK_PROJECTS.filter(p => p.schedule.timeOverrun >= 36);
  const multipleExtensions = MOCK_PROJECTS.filter(p => p.schedule.deadlineRevision >= 3);
  const avgDelay = Math.round(MOCK_PROJECTS.reduce((acc, p) => acc + p.schedule.timeOverrun, 0) / total);

  const displayedProjects = MOCK_PROJECTS.filter(p => {
    if (filterDelayThreshold === 'DELAY_36') return p.schedule.timeOverrun >= 36;
    if (filterDelayThreshold === 'REVISIONS_3') return p.schedule.deadlineRevision >= 3;
    return true;
  }).sort((a, b) => b.schedule.timeOverrun - a.schedule.timeOverrun);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Editorial Header */}
      <EditorialHeader
        eyebrow="Administrator Portfolio • Timeline Governance"
        title="Schedule Slippage & Milestone Revision Monitoring"
        subtitle={`Chronological audit tracking baseline commissioning dates, cumulative schedule slippages, project age, and critical milestone push indicators (${MOCK_REPORTING_MONTH}).`}
        badge="SCHEDULE MONITORING"
      />

      {/* Information Band */}
      <InformationBand
        cells={[
          { label: 'Monitored Works', value: total, context: 'Active Portfolio' },
          { label: 'Severe Delays (≥36 Mos)', value: severeDelays.length, context: 'Multi-Year Slips', emphasis: 'critical' },
          { label: 'Max Project Delay', value: '+216 Mos', context: 'USBRL Section (Northern Rail)', emphasis: 'critical' },
          { label: 'Avg Schedule Slippage', value: `+${avgDelay} Mos`, context: 'Across Monitored Works' },
          { label: 'High Revision Count (≥3)', value: multipleExtensions.length, context: 'Extension Cycles', emphasis: 'high' },
          { label: 'Current Review Cycle', value: 'Oct 2025', context: 'PAIMANA Reporting' },
        ]}
      />

      {/* Schedule Bottleneck Indicator Callout */}
      <div className="bg-white border border-gov-border rounded-xs p-6 shadow-subtle space-y-3">
        <div className="border-b border-gov-border pb-2 flex items-center justify-between">
          <div className="section-eyebrow text-ink-subtle">Primary Milestone Push Mechanisms</div>
          <span className="font-mono text-xs text-ink-subtle">Physical Dependency Analysis</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-paper-subtle border border-gov-border rounded-xs">
            <span className="font-mono font-bold text-ink block text-[11px]">Geotechnical & Tunnelling Stoppages</span>
            <p className="text-ink-muted text-[11px] font-sans mt-0.5">
              Account for delays exceeding 60 months; severe Himalayan geological surprises and dense urban TBM boring lags.
            </p>
          </div>
          <div className="p-3 bg-paper-subtle border border-gov-border rounded-xs">
            <span className="font-mono font-bold text-ink block text-[11px]">Statutory & Safety Clearances</span>
            <p className="text-ink-muted text-[11px] font-sans mt-0.5">
              Commissioning dates pushed repeatedly awaiting CRS rail certifications and DGCA calibration flights.
            </p>
          </div>
          <div className="p-3 bg-paper-subtle border border-gov-border rounded-xs">
            <span className="font-mono font-bold text-ink block text-[11px]">Inter-Agency Utility Shifting</span>
            <p className="text-ink-muted text-[11px] font-sans mt-0.5">
              Dedicated high-voltage power lines and municipal corridor clearances causing compounding project extensions.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-gov-border pb-3">
        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            onClick={() => setFilterDelayThreshold('ALL')}
            className={`px-3 py-1.5 rounded-xs border transition-colors ${
              filterDelayThreshold === 'ALL'
                ? 'bg-ink text-white font-bold border-ink'
                : 'bg-paper-subtle text-ink hover:bg-gov-border border-gov-border'
            }`}
          >
            All Projects ({total})
          </button>
          <button
            onClick={() => setFilterDelayThreshold('DELAY_36')}
            className={`px-3 py-1.5 rounded-xs border transition-colors ${
              filterDelayThreshold === 'DELAY_36'
                ? 'bg-ink text-white font-bold border-ink'
                : 'bg-paper-subtle text-ink hover:bg-gov-border border-gov-border'
            }`}
          >
            Delay ≥ 36 Months ({severeDelays.length})
          </button>
          <button
            onClick={() => setFilterDelayThreshold('REVISIONS_3')}
            className={`px-3 py-1.5 rounded-xs border transition-colors ${
              filterDelayThreshold === 'REVISIONS_3'
                ? 'bg-ink text-white font-bold border-ink'
                : 'bg-paper-subtle text-ink hover:bg-gov-border border-gov-border'
            }`}
          >
            Revisions ≥ 3 ({multipleExtensions.length})
          </button>
        </div>

        <span className="font-mono text-xs text-ink-subtle">
          Showing {displayedProjects.length} projects
        </span>
      </div>

      {/* Schedule Monitoring Master Table */}
      <div className="bg-white border border-gov-border rounded-xs shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Project ID & Title</th>
                <th>Sanction Date</th>
                <th>Project Age</th>
                <th>Planned Completion</th>
                <th>Revised Completion</th>
                <th>Time Overrun</th>
                <th>Extensions</th>
                <th>Milestone Push Indicator</th>
                <th className="text-right">Dossier</th>
              </tr>
            </thead>
            <tbody>
              {displayedProjects.map(p => {
                const age = calculateAge(p.sanctionDate);
                const pushReason = getPushIndicator(p);

                return (
                  <tr key={p.id} className="hover:bg-paper-subtle/50 transition-colors">
                    <td className="max-w-xs">
                      <span className="font-mono text-[10px] text-ink-subtle block">#{p.id}</span>
                      <Link to={`/project/${p.id}`} className="font-semibold text-ink hover:text-gov-terracotta text-xs block">
                        {p.name}
                      </Link>
                      <span className="text-[10px] text-ink-subtle font-mono">{p.implementingAgency}</span>
                    </td>
                    <td className="font-mono text-xs text-ink-muted">{p.sanctionDate}</td>
                    <td className="font-mono text-xs font-semibold text-ink">{age}</td>
                    <td className="font-mono text-xs text-ink-subtle">{p.schedule.plannedCompletion}</td>
                    <td className="font-mono text-xs font-bold text-ink">{p.schedule.revisedCompletion}</td>
                    <td>
                      <span className={`tabular-figure font-mono text-xs font-bold ${
                        p.schedule.timeOverrun >= 36
                          ? 'text-risk-critical-solid'
                          : p.schedule.timeOverrun > 12
                          ? 'text-risk-high-solid'
                          : 'text-risk-low-solid'
                      }`}>
                        +{p.schedule.timeOverrun} mos
                      </span>
                    </td>
                    <td className="tabular-figure font-mono text-xs text-center font-semibold">
                      {p.schedule.deadlineRevision}
                    </td>
                    <td className="max-w-xs">
                      <span className="font-mono text-[11px] bg-paper-subtle px-2 py-0.5 border border-gov-border rounded-xs text-ink inline-block">
                        {pushReason}
                      </span>
                    </td>
                    <td className="text-right">
                      <Link
                        to={`/project/${p.id}`}
                        className="inline-block text-xs font-mono font-medium text-gov-terracotta hover:underline px-2 py-1 bg-paper-subtle border border-gov-border rounded-xs"
                      >
                        Inspect →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
