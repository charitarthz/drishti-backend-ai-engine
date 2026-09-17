import React from 'react';
import type { FilterState } from '../../types/project';
import { RotateCcw } from 'lucide-react';

interface CommonFiltersProps {
  filters: FilterState;
  onChange: (newFilters: Partial<FilterState>) => void;
  onReset: () => void;
  ministries?: string[];
  sectors?: string[];
  states?: string[];
}

export const CommonFilters: React.FC<CommonFiltersProps> = ({
  filters,
  onChange,
  onReset,
  ministries = [
    "Ministry of Railways",
    "Ministry of Road Transport and Highways",
    "Ministry of Petroleum and Natural Gas",
    "Ministry of Power",
    "Ministry of Civil Aviation",
    "Ministry of Housing and Urban Affairs",
    "Ministry of Health and Family Welfare"
  ],
  sectors = [
    "Railways",
    "Roads and Highways",
    "Petroleum",
    "Power Transmission",
    "Civil Aviation",
    "Urban Transit",
    "Healthcare Infrastructure"
  ],
  states = [
    "West Bengal & Bihar",
    "Jammu & Kashmir",
    "Maharashtra",
    "Haryana & Punjab",
    "Rajasthan",
    "Gujarat",
    "Karnataka"
  ]
}) => {
  const isFiltered =
    filters.ministry !== 'ALL' ||
    filters.sector !== 'ALL' ||
    filters.state !== 'ALL' ||
    filters.riskLevel !== 'ALL' ||
    filters.status !== 'ALL';

  return (
    <div className="bg-white border-y border-gov-border py-2.5 px-4 flex flex-wrap items-center justify-between gap-3 text-xs mb-6">
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="section-eyebrow text-ink-subtle mr-1">
          Filter Dossier:
        </span>

        {/* Ministry Filter */}
        <select
          value={filters.ministry}
          onChange={(e) => onChange({ ministry: e.target.value })}
          className="bg-paper-subtle border border-gov-border text-ink rounded-xs px-2 py-1 text-xs focus:outline-none focus:border-ink"
        >
          <option value="ALL">All Ministries</option>
          {ministries.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        {/* Sector Filter */}
        <select
          value={filters.sector}
          onChange={(e) => onChange({ sector: e.target.value })}
          className="bg-paper-subtle border border-gov-border text-ink rounded-xs px-2 py-1 text-xs focus:outline-none focus:border-ink"
        >
          <option value="ALL">All Sectors</option>
          {sectors.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* State Filter */}
        <select
          value={filters.state}
          onChange={(e) => onChange({ state: e.target.value })}
          className="bg-paper-subtle border border-gov-border text-ink rounded-xs px-2 py-1 text-xs focus:outline-none focus:border-ink"
        >
          <option value="ALL">All States / UTs</option>
          {states.map((st) => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>

        {/* Risk Level Filter */}
        <select
          value={filters.riskLevel}
          onChange={(e) => onChange({ riskLevel: e.target.value })}
          className="bg-paper-subtle border border-gov-border text-ink rounded-xs px-2 py-1 text-xs focus:outline-none focus:border-ink"
        >
          <option value="ALL">All Risk Levels</option>
          <option value="Critical">Critical Risk (80–100)</option>
          <option value="High">High Risk (60–79)</option>
          <option value="Medium">Medium Risk (40–59)</option>
          <option value="Low">Low Risk (0–39)</option>
        </select>

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => onChange({ status: e.target.value })}
          className="bg-paper-subtle border border-gov-border text-ink rounded-xs px-2 py-1 text-xs focus:outline-none focus:border-ink"
        >
          <option value="ALL">All Statuses</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Delayed">Delayed</option>
          <option value="Critical Delay">Critical Delay</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {isFiltered && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1 text-[11px] text-ink-muted hover:text-ink hover:underline font-mono"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      )}
    </div>
  );
};
