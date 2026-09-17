import React, { useState } from 'react';

export interface StateMapData {
  id: string; // state code or name
  name: string;
  projectCount: number;
  criticalCount: number;
  highCount: number;
  avgRisk: number;
  riskLevel: 'Critical' | 'High' | 'Low' | 'None';
}

interface IndiaMapProps {
  stateData: Record<string, StateMapData>;
  selectedState: string;
  onSelectState: (stateName: string) => void;
}

// Stylized yet recognizable regional SVG path definitions for Indian States/UTs in standard 600x680 projection
const REGIONS: { id: string; name: string; path: string; labelX: number; labelY: number }[] = [
  {
    id: "JK",
    name: "Jammu & Kashmir",
    path: "M 230 45 L 265 30 L 310 40 L 335 75 L 320 115 L 280 120 L 250 110 L 230 95 L 215 70 Z",
    labelX: 270,
    labelY: 75
  },
  {
    id: "PB_HR",
    name: "Haryana & Punjab",
    path: "M 215 115 L 250 110 L 275 125 L 270 155 L 245 165 L 210 150 Z",
    labelX: 242,
    labelY: 138
  },
  {
    id: "RJ",
    name: "Rajasthan",
    path: "M 155 160 L 210 150 L 245 165 L 240 215 L 205 245 L 140 225 L 130 185 Z",
    labelX: 185,
    labelY: 200
  },
  {
    id: "GJ",
    name: "Gujarat",
    path: "M 115 240 L 175 240 L 195 270 L 175 305 L 120 300 L 95 275 L 90 255 Z",
    labelX: 140,
    labelY: 275
  },
  {
    id: "MH",
    name: "Maharashtra",
    path: "M 175 305 L 250 280 L 290 310 L 270 370 L 215 385 L 180 345 Z",
    labelX: 230,
    labelY: 340
  },
  {
    id: "KA",
    name: "Karnataka",
    path: "M 205 390 L 255 375 L 265 440 L 225 470 L 195 440 Z",
    labelX: 230,
    labelY: 425
  },
  {
    id: "KL",
    name: "Kerala",
    path: "M 215 475 L 235 470 L 245 530 L 225 545 L 210 500 Z",
    labelX: 228,
    labelY: 510
  },
  {
    id: "TN",
    name: "Tamil Nadu",
    path: "M 245 445 L 285 440 L 290 515 L 245 540 L 235 470 Z",
    labelX: 265,
    labelY: 490
  },
  {
    id: "AP_TS",
    name: "Andhra Pradesh & Telangana",
    path: "M 270 340 L 325 330 L 340 380 L 305 435 L 255 430 L 270 370 Z",
    labelX: 295,
    labelY: 385
  },
  {
    id: "OD",
    name: "Odisha",
    path: "M 340 290 L 390 280 L 415 320 L 375 355 L 335 340 Z",
    labelX: 370,
    labelY: 315
  },
  {
    id: "WB_BR",
    name: "West Bengal & Bihar",
    path: "M 345 195 L 420 185 L 430 240 L 395 275 L 345 250 Z",
    labelX: 385,
    labelY: 230
  },
  {
    id: "UP",
    name: "Uttar Pradesh",
    path: "M 265 145 L 345 150 L 350 200 L 290 220 L 255 180 Z",
    labelX: 300,
    labelY: 180
  },
  {
    id: "MP",
    name: "Madhya Pradesh",
    path: "M 215 235 L 295 220 L 335 255 L 295 285 L 215 270 Z",
    labelX: 270,
    labelY: 255
  },
  {
    id: "NE",
    name: "Arunachal Pradesh & Assam",
    path: "M 440 180 L 510 160 L 540 190 L 490 230 L 445 220 Z",
    labelX: 485,
    labelY: 195
  }
];

export const IndiaMap: React.FC<IndiaMapProps> = ({ stateData, selectedState, onSelectState }) => {
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  const getFillColor = (stateName: string, isSelected: boolean) => {
    const data = stateData[stateName];
    if (isSelected) {
      return '#0F172A'; // deep ink for selected
    }
    if (!data || data.projectCount === 0) {
      return '#F1F0EA'; // unmonitored neutral stone
    }
    if (data.riskLevel === 'Critical') {
      return '#FEE2E2'; // light terracotta/crimson
    }
    if (data.riskLevel === 'High') {
      return '#FEF3C7'; // light amber
    }
    return '#E6F4EA'; // light teal/sage for low
  };

  const getStrokeColor = (stateName: string, isSelected: boolean) => {
    if (isSelected) return '#C2410C'; // terracotta highlight
    const data = stateData[stateName];
    if (!data || data.projectCount === 0) return '#D6D3C7';
    if (data.riskLevel === 'Critical') return '#EF4444';
    if (data.riskLevel === 'High') return '#F59E0B';
    return '#0D5C56';
  };

  const hoveredData = hoveredState ? stateData[hoveredState] : null;

  return (
    <div className="relative bg-paper-subtle/70 border border-gov-border rounded-xs p-4 flex flex-col items-center">
      {/* Map Sub-header & Tooltip Readout */}
      <div className="w-full flex items-center justify-between pb-2 border-b border-gov-border text-xs mb-2">
        <span className="font-mono text-[10px] text-ink-subtle uppercase tracking-wider">
          Geographic Risk Density • Interactive Selector
        </span>
        <div className="font-mono text-[11px] text-ink">
          {hoveredState ? (
            <span>
              <strong className="text-ink font-semibold">{hoveredState}</strong>: {hoveredData?.projectCount || 0} works • {hoveredData?.riskLevel || 'Unmonitored'}
            </span>
          ) : (
            <span className="text-ink-muted">Click any territory to focus regional intelligence</span>
          )}
        </div>
      </div>

      {/* SVG Container */}
      <div className="w-full max-w-[420px] aspect-[600/640] relative">
        <svg
          viewBox="70 20 500 560"
          className="w-full h-full drop-shadow-sm select-none"
        >
          {/* Subtle Grid / Lat-Long Marks */}
          <g opacity="0.12" stroke="#475569" strokeWidth="0.5" strokeDasharray="3 3">
            <line x1="100" y1="150" x2="550" y2="150" />
            <line x1="100" y1="300" x2="550" y2="300" />
            <line x1="100" y1="450" x2="550" y2="450" />
            <line x1="250" y1="50" x2="250" y2="550" />
            <line x1="400" y1="50" x2="400" y2="550" />
          </g>

          {/* Region Paths */}
          {REGIONS.map((reg) => {
            const isSelected = selectedState === reg.name;
            const isHovered = hoveredState === reg.name;
            const data = stateData[reg.name];
            const fill = getFillColor(reg.name, isSelected);
            const stroke = getStrokeColor(reg.name, isSelected);

            return (
              <g
                key={reg.id}
                className="cursor-pointer transition-all duration-150"
                onClick={() => onSelectState(reg.name)}
                onMouseEnter={() => setHoveredState(reg.name)}
                onMouseLeave={() => setHoveredState(null)}
              >
                <path
                  d={reg.path}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={isSelected ? 2.5 : isHovered ? 1.8 : 1}
                  className="transition-colors duration-150"
                />
                {/* Regional Code Label */}
                <text
                  x={reg.labelX}
                  y={reg.labelY}
                  textAnchor="middle"
                  alignmentBaseline="central"
                  fontSize="11"
                  fontFamily="monospace"
                  fontWeight={isSelected ? 'bold' : '600'}
                  fill={isSelected ? '#FFFFFF' : data?.riskLevel === 'Critical' ? '#991B1B' : '#334155'}
                  pointerEvents="none"
                  className="transition-colors duration-150"
                >
                  {reg.id.split('_')[0]}
                </text>
                {/* Critical Indicator Dot */}
                {data && data.criticalCount > 0 && !isSelected && (
                  <circle
                    cx={reg.labelX + 13}
                    cy={reg.labelY - 7}
                    r="3.5"
                    fill="#DC2626"
                    stroke="#FFFFFF"
                    strokeWidth="1"
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Institutional Map Legend */}
      <div className="w-full pt-3 mt-1 border-t border-gov-border flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-ink-muted">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-xs bg-[#FEE2E2] border border-[#EF4444] inline-block" />
          <span>Critical Tier (≥80)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-xs bg-[#FEF3C7] border border-[#F59E0B] inline-block" />
          <span>High Risk (60–79)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-xs bg-[#E6F4EA] border border-[#0D5C56] inline-block" />
          <span>Low Risk (&lt;60)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-xs bg-[#F1F0EA] border border-[#D6D3C7] inline-block" />
          <span>No Active Alerts</span>
        </div>
      </div>
    </div>
  );
};
