import type { ProjectIntelligence, ActionItem, CurrentRiskSignal, OperationalAlert } from '../types/project';

export const MOCK_REPORTING_MONTH = "October 2025";
export const MOCK_DATA_VERSION = "PAIMANA Review Cycle 2025-Q3 (Representative Demonstration Data)";

export const MOCK_PROJECTS: ProjectIntelligence[] = [
  {
    id: "615186",
    name: "Eastern Dedicated Freight Corridor (Sonnagar - Dankuni Section)",
    ministry: "Ministry of Railways",
    sector: "Railways",
    implementingAgency: "DFCCIL (Dedicated Freight Corridor Corp)",
    state: "West Bengal & Bihar",
    district: "Dankuni to Sonnagar Stretch",
    status: "Delayed",
    sanctionDate: "Nov 2011",
    cost: {
      originalApprovedCost: 9680.0,
      revisedCost: 14220.0,
      costOverrunPercent: 46.9,
      cumulativeExpenditure: 11140.0,
      costRevisionCount: 3
    },
    progress: {
      physicalProgress: 42.4,
      expectedProgress: 88.0,
      progressGap: -45.6,
      progressRate: 0.28,
      progressStall: true
    },
    schedule: {
      plannedCompletion: "Mar 2021",
      revisedCompletion: "Dec 2026",
      timeOverrun: 69,
      deadlineRevision: 4
    },
    riskScore: 92,
    riskLevel: "Critical",
    highRiskProbability: 94.2,
    costEscalationRisk: 88.5,
    deadlineSlipRisk: 91.0,
    shapDrivers: [
      {
        feature: "Progress vs Expected Gap",
        impact: "HIGH IMPACT",
        shapValue: 0.41,
        direction: "increases_risk",
        evidence: "Physical progress at 42.4% against expected 88.0% (Net gap: -45.6% points)."
      },
      {
        feature: "Progress Stall",
        impact: "HIGH IMPACT",
        shapValue: 0.34,
        direction: "increases_risk",
        evidence: "Consecutive 4-month progress rate below 0.30%/month indicates acute stall."
      },
      {
        feature: "Time Overrun",
        impact: "HIGH IMPACT",
        shapValue: 0.29,
        direction: "increases_risk",
        evidence: "Cumulative project timeline slip currently stands at 69 months past baseline."
      },
      {
        feature: "Cost Overrun Ratio",
        impact: "MEDIUM IMPACT",
        shapValue: 0.18,
        direction: "increases_risk",
        evidence: "Sanction cost revised upward by 46.9% across 3 formal administrative approvals."
      }
    ],
    evidence: {
      reportingMonth: "October 2025",
      sourceReport: "PAIMANA Monthly Infrastructure Review",
      sourcePage: "Vol. 4, Table 12, Page 142",
      verifiableFacts: [
        { label: "Approved Milestone Target", value: "88.0% Completion by Q3 2025" },
        { label: "Reported Field Milestone", value: "42.4% Cumulative Execution" },
        { label: "Quarterly Run-rate", value: "0.28% avg / month" },
        { label: "Sanction Revisions Logged", value: "3 Cost, 4 Schedule Amendments" }
      ]
    },
    suggestedReviews: [
      {
        id: "SR-615186-01",
        triggerSignal: "Progress Stall detected (3 consecutive quarters under 1%)",
        suggestedActionType: "Physical Progress Verification",
        rationale: "Requires on-site physical verification of track laying and sub-grade preparation."
      },
      {
        id: "SR-615186-02",
        triggerSignal: "Time Overrun > 60 months",
        suggestedActionType: "Schedule Review",
        rationale: "Evaluate revised milestone dependency critical path for Sonnagar package."
      }
    ],
    trendDirection: "Increasing",
    riskHistory: [
      { month: "May 2025", score: 79, level: "High" },
      { month: "Jun 2025", score: 82, level: "High" },
      { month: "Jul 2025", score: 85, level: "High" },
      { month: "Aug 2025", score: 88, level: "Critical" },
      { month: "Sep 2025", score: 90, level: "Critical" },
      { month: "Oct 2025", score: 92, level: "Critical" }
    ],
    keyWarningSignal: "Progress Stall"
  },
  {
    id: "615191",
    name: "Udhampur-Srinagar-Baramulla Rail Link (Katra-Banihal Section)",
    ministry: "Ministry of Railways",
    sector: "Railways",
    implementingAgency: "Northern Railway / KRCL",
    state: "Jammu & Kashmir",
    district: "Reasi, Ramban",
    status: "Delayed",
    sanctionDate: "Mar 2002",
    cost: {
      originalApprovedCost: 3077.0,
      revisedCost: 27949.0,
      costOverrunPercent: 808.3,
      cumulativeExpenditure: 26890.0,
      costRevisionCount: 5
    },
    progress: {
      physicalProgress: 96.1,
      expectedProgress: 100.0,
      progressGap: -3.9,
      progressRate: 0.45,
      progressStall: false
    },
    schedule: {
      plannedCompletion: "Dec 2007",
      revisedCompletion: "Dec 2025",
      timeOverrun: 216,
      deadlineRevision: 7
    },
    riskScore: 78,
    riskLevel: "High",
    highRiskProbability: 81.0,
    costEscalationRisk: 74.0,
    deadlineSlipRisk: 79.5,
    shapDrivers: [
      {
        feature: "Time Overrun",
        impact: "HIGH IMPACT",
        shapValue: 0.48,
        direction: "increases_risk",
        evidence: "Historic schedule slip of 216 months; residual safety certification pending."
      },
      {
        feature: "Cost Overrun Ratio",
        impact: "HIGH IMPACT",
        shapValue: 0.38,
        direction: "increases_risk",
        evidence: "Cumulative cost escalation of 808.3% over initial baseline sanction."
      },
      {
        feature: "Progress vs Expected Gap",
        impact: "LOW IMPACT",
        shapValue: 0.09,
        direction: "decreases_risk",
        evidence: "Nearing final completion with physical progress at 96.1%."
      }
    ],
    evidence: {
      reportingMonth: "October 2025",
      sourceReport: "PAIMANA Monthly Infrastructure Review",
      sourcePage: "Vol. 4, Table 12, Page 158",
      verifiableFacts: [
        { label: "Residual Tunnelling", value: "Tunnel T-1 excavation 99.8% complete" },
        { label: "Track Linking", value: "94.2 km commissioned of 111 km Katra-Banihal" },
        { label: "Commissioning Target", value: "CRS Inspection scheduled Q4 2025" }
      ]
    },
    suggestedReviews: [
      {
        id: "SR-615191-01",
        triggerSignal: "CRS statutory inspection milestone pending",
        suggestedActionType: "Schedule Review",
        rationale: "Verify timeline for safety clearance certificates and ballast stabilization."
      }
    ],
    trendDirection: "Decreasing",
    riskHistory: [
      { month: "May 2025", score: 86, level: "Critical" },
      { month: "Jun 2025", score: 84, level: "High" },
      { month: "Jul 2025", score: 82, level: "High" },
      { month: "Aug 2025", score: 80, level: "High" },
      { month: "Sep 2025", score: 79, level: "High" },
      { month: "Oct 2025", score: 78, level: "High" }
    ],
    keyWarningSignal: "Time Overrun"
  },
  {
    id: "611602",
    name: "Navi Mumbai International Airport (Phase-1)",
    ministry: "Ministry of Civil Aviation",
    sector: "Civil Aviation",
    implementingAgency: "CIDCO / NMIAL (Adani Airports)",
    state: "Maharashtra",
    district: "Raigad",
    status: "Ongoing",
    sanctionDate: "Feb 2018",
    cost: {
      originalApprovedCost: 14118.0,
      revisedCost: 19646.0,
      costOverrunPercent: 39.1,
      cumulativeExpenditure: 16820.0,
      costRevisionCount: 2
    },
    progress: {
      physicalProgress: 79.5,
      expectedProgress: 94.0,
      progressGap: -14.5,
      progressRate: 1.65,
      progressStall: false
    },
    schedule: {
      plannedCompletion: "Dec 2019",
      revisedCompletion: "Mar 2026",
      timeOverrun: 75,
      deadlineRevision: 3
    },
    riskScore: 71,
    riskLevel: "High",
    highRiskProbability: 72.4,
    costEscalationRisk: 68.0,
    deadlineSlipRisk: 74.2,
    shapDrivers: [
      {
        feature: "Progress vs Expected Gap",
        impact: "HIGH IMPACT",
        shapValue: 0.35,
        direction: "increases_risk",
        evidence: "Physical execution gap of -14.5% points against Q3 targets."
      },
      {
        feature: "Time Overrun",
        impact: "MEDIUM IMPACT",
        shapValue: 0.28,
        direction: "increases_risk",
        evidence: "Commercial operational date moved from baseline 2019 to Mar 2026."
      },
      {
        feature: "Progress Rate",
        impact: "LOW IMPACT",
        shapValue: -0.15,
        direction: "decreases_risk",
        evidence: "Active monthly execution run-rate sustained at 1.65% per month."
      }
    ],
    evidence: {
      reportingMonth: "October 2025",
      sourceReport: "PAIMANA Monthly Infrastructure Review",
      sourcePage: "Vol. 2, Table 8, Page 84",
      verifiableFacts: [
        { label: "Runway Package Rwy 08R/26L", value: "Pavement 88% done, AGL installation ongoing" },
        { label: "Terminal 1 Structural Works", value: "81% complete; MEP commissioning underway" },
        { label: "ATC Tower Structure", value: "100% Civil complete; Radar fitment in progress" }
      ]
    },
    suggestedReviews: [
      {
        id: "SR-611602-01",
        triggerSignal: "Terminal MEP integration lagging civil completion",
        suggestedActionType: "Constraint Review",
        rationale: "Examine specialized baggage handling systems and DGCA calibration schedule."
      }
    ],
    trendDirection: "Stable",
    riskHistory: [
      { month: "May 2025", score: 72, level: "High" },
      { month: "Jun 2025", score: 71, level: "High" },
      { month: "Jul 2025", score: 70, level: "High" },
      { month: "Aug 2025", score: 71, level: "High" },
      { month: "Sep 2025", score: 71, level: "High" },
      { month: "Oct 2025", score: 71, level: "High" }
    ],
    keyWarningSignal: "Progress Below Expected"
  },
  {
    id: "400010",
    name: "Delhi-Amritsar-Katra Expressway (Pkg 1 to 4 - Haryana Section)",
    ministry: "Ministry of Road Transport and Highways",
    sector: "Roads and Highways",
    implementingAgency: "National Highways Authority of India (NHAI)",
    state: "Haryana & Punjab",
    district: "Jhajjar, Rohtak, Jind",
    status: "Delayed",
    sanctionDate: "Jan 2020",
    cost: {
      originalApprovedCost: 8250.0,
      revisedCost: 9870.0,
      costOverrunPercent: 19.6,
      cumulativeExpenditure: 7420.0,
      costRevisionCount: 1
    },
    progress: {
      physicalProgress: 64.2,
      expectedProgress: 91.0,
      progressGap: -26.8,
      progressRate: 0.62,
      progressStall: false
    },
    schedule: {
      plannedCompletion: "Oct 2023",
      revisedCompletion: "Jun 2026",
      timeOverrun: 32,
      deadlineRevision: 2
    },
    riskScore: 84,
    riskLevel: "Critical",
    highRiskProbability: 86.8,
    costEscalationRisk: 78.2,
    deadlineSlipRisk: 89.1,
    shapDrivers: [
      {
        feature: "Progress vs Expected Gap",
        impact: "HIGH IMPACT",
        shapValue: 0.44,
        direction: "increases_risk",
        evidence: "Gap of -26.8% between planned and completed road formation."
      },
      {
        feature: "Time Overrun",
        impact: "HIGH IMPACT",
        shapValue: 0.32,
        direction: "increases_risk",
        evidence: "32 months delay past initial milestone date."
      },
      {
        feature: "Cost Overrun Ratio",
        impact: "MEDIUM IMPACT",
        shapValue: 0.19,
        direction: "increases_risk",
        evidence: "Cost escalated by 19.6% due to utility shifting and grade separator revisions."
      }
    ],
    evidence: {
      reportingMonth: "October 2025",
      sourceReport: "PAIMANA Monthly Infrastructure Review",
      sourcePage: "Vol. 1, Table 4, Page 31",
      verifiableFacts: [
        { label: "Pavement Quality Concrete (PQC)", value: "54.8 km laid of 84.5 km target" },
        { label: "Structures (Major Bridges / ROB)", value: "11 of 18 structures completed" },
        { label: "Right of Way Handover", value: "98.2% unencumbered" }
      ]
    },
    suggestedReviews: [
      {
        id: "SR-400010-01",
        triggerSignal: "Progress rate below required completion velocity",
        suggestedActionType: "Ground Verification Audit",
        rationale: "Inspect machine deployment and batching plant capacity across Packages 2 & 3."
      }
    ],
    trendDirection: "Increasing",
    riskHistory: [
      { month: "May 2025", score: 74, level: "High" },
      { month: "Jun 2025", score: 76, level: "High" },
      { month: "Jul 2025", score: 79, level: "High" },
      { month: "Aug 2025", score: 81, level: "Critical" },
      { month: "Sep 2025", score: 82, level: "Critical" },
      { month: "Oct 2025", score: 84, level: "Critical" }
    ],
    keyWarningSignal: "Progress Below Expected"
  },
  {
    id: "510924",
    name: "Barmer Petroleum Refinery and Petrochemical Complex (9 MMTPA)",
    ministry: "Ministry of Petroleum and Natural Gas",
    sector: "Petroleum",
    implementingAgency: "HPCL Rajasthan Refinery Ltd (HRRL)",
    state: "Rajasthan",
    district: "Barmer",
    status: "Delayed",
    sanctionDate: "Jan 2018",
    cost: {
      originalApprovedCost: 43129.0,
      revisedCost: 72937.0,
      costOverrunPercent: 69.1,
      cumulativeExpenditure: 59400.0,
      costRevisionCount: 2
    },
    progress: {
      physicalProgress: 76.8,
      expectedProgress: 97.0,
      progressGap: -20.2,
      progressRate: 1.10,
      progressStall: false
    },
    schedule: {
      plannedCompletion: "Oct 2022",
      revisedCompletion: "Dec 2025",
      timeOverrun: 38,
      deadlineRevision: 3
    },
    riskScore: 81,
    riskLevel: "Critical",
    highRiskProbability: 83.5,
    costEscalationRisk: 86.0,
    deadlineSlipRisk: 80.0,
    shapDrivers: [
      {
        feature: "Cost Overrun Ratio",
        impact: "HIGH IMPACT",
        shapValue: 0.46,
        direction: "increases_risk",
        evidence: "Escalation of ₹29,808 Cr (+69.1%) driven by refinery unit reconfigurations."
      },
      {
        feature: "Progress vs Expected Gap",
        impact: "HIGH IMPACT",
        shapValue: 0.36,
        direction: "increases_risk",
        evidence: "Progress deficit of -20.2% points across mechanical erection stages."
      },
      {
        feature: "Time Overrun",
        impact: "MEDIUM IMPACT",
        shapValue: 0.25,
        direction: "increases_risk",
        evidence: "38 months schedule revision past primary commercial commissioning."
      }
    ],
    evidence: {
      reportingMonth: "October 2025",
      sourceReport: "PAIMANA Monthly Infrastructure Review",
      sourcePage: "Vol. 5, Table 3, Page 210",
      verifiableFacts: [
        { label: "DFU & VGO Units Erection", value: "88% equipment positioned" },
        { label: "Piping & Instrumentation", value: "62% spools welded and radiographed" },
        { label: "Power & Captive Utilities", value: "Co-gen plant sync under review" }
      ]
    },
    suggestedReviews: [
      {
        id: "SR-510924-01",
        triggerSignal: "Substantial cost escalation (>50%)",
        suggestedActionType: "Cost Review",
        rationale: "Examine procurement escalation benchmarks and contractual variation claims."
      }
    ],
    trendDirection: "Stable",
    riskHistory: [
      { month: "May 2025", score: 80, level: "Critical" },
      { month: "Jun 2025", score: 81, level: "Critical" },
      { month: "Jul 2025", score: 81, level: "Critical" },
      { month: "Aug 2025", score: 82, level: "Critical" },
      { month: "Sep 2025", score: 81, level: "Critical" },
      { month: "Oct 2025", score: 81, level: "Critical" }
    ],
    keyWarningSignal: "Cost Overrun"
  },
  {
    id: "712401",
    name: "765kV D/C Khavda to Ahmedabad Transmission Link",
    ministry: "Ministry of Power",
    sector: "Power Transmission",
    implementingAgency: "Power Grid Corporation of India (POWERGRID)",
    state: "Gujarat",
    district: "Kutch, Surendranagar, Ahmedabad",
    status: "Ongoing",
    sanctionDate: "Aug 2021",
    cost: {
      originalApprovedCost: 4890.0,
      revisedCost: 4980.0,
      costOverrunPercent: 1.8,
      cumulativeExpenditure: 3950.0,
      costRevisionCount: 0
    },
    progress: {
      physicalProgress: 88.4,
      expectedProgress: 90.0,
      progressGap: -1.6,
      progressRate: 2.8,
      progressStall: false
    },
    schedule: {
      plannedCompletion: "Nov 2025",
      revisedCompletion: "Dec 2025",
      timeOverrun: 1,
      deadlineRevision: 1
    },
    riskScore: 28,
    riskLevel: "Low",
    highRiskProbability: 12.0,
    costEscalationRisk: 14.5,
    deadlineSlipRisk: 22.0,
    shapDrivers: [
      {
        feature: "Progress vs Expected Gap",
        impact: "LOW IMPACT",
        shapValue: -0.32,
        direction: "decreases_risk",
        evidence: "Minimal gap of -1.6%; erection velocity on track."
      },
      {
        feature: "Cost Overrun Ratio",
        impact: "LOW IMPACT",
        shapValue: -0.28,
        direction: "decreases_risk",
        evidence: "Negligible cost variance within 1.8% of base estimate."
      },
      {
        feature: "Progress Rate",
        impact: "LOW IMPACT",
        shapValue: -0.22,
        direction: "decreases_risk",
        evidence: "Healthy monthly progress velocity of 2.8%/month."
      }
    ],
    evidence: {
      reportingMonth: "October 2025",
      sourceReport: "PAIMANA Monthly Infrastructure Review",
      sourcePage: "Vol. 3, Table 15, Page 98",
      verifiableFacts: [
        { label: "Tower Foundations Poured", value: "984 of 1,012 towers complete" },
        { label: "Stringing Progress", value: "294 km of 330 km circuit completed" },
        { label: "Substation Bay Expansion", value: "765kV GIS testing initiated" }
      ]
    },
    suggestedReviews: [],
    trendDirection: "Stable",
    riskHistory: [
      { month: "May 2025", score: 32, level: "Low" },
      { month: "Jun 2025", score: 30, level: "Low" },
      { month: "Jul 2025", score: 29, level: "Low" },
      { month: "Aug 2025", score: 28, level: "Low" },
      { month: "Sep 2025", score: 28, level: "Low" },
      { month: "Oct 2025", score: 28, level: "Low" }
    ],
    keyWarningSignal: "Time Overrun"
  },
  {
    id: "318920",
    name: "Bengaluru Metro Rail Project Phase-2 (Reach 6 - Kalena Agrahara to Nagawara)",
    ministry: "Ministry of Housing and Urban Affairs",
    sector: "Urban Transit",
    implementingAgency: "Bangalore Metro Rail Corporation (BMRCL)",
    state: "Karnataka",
    district: "Bengaluru Urban",
    status: "Delayed",
    sanctionDate: "Jun 2014",
    cost: {
      originalApprovedCost: 26405.0,
      revisedCost: 30695.0,
      costOverrunPercent: 16.2,
      cumulativeExpenditure: 24100.0,
      costRevisionCount: 1
    },
    progress: {
      physicalProgress: 73.1,
      expectedProgress: 96.0,
      progressGap: -22.9,
      progressRate: 0.85,
      progressStall: false
    },
    schedule: {
      plannedCompletion: "Jun 2020",
      revisedCompletion: "Sep 2026",
      timeOverrun: 75,
      deadlineRevision: 3
    },
    riskScore: 76,
    riskLevel: "High",
    highRiskProbability: 78.4,
    costEscalationRisk: 66.0,
    deadlineSlipRisk: 82.1,
    shapDrivers: [
      {
        feature: "Time Overrun",
        impact: "HIGH IMPACT",
        shapValue: 0.42,
        direction: "increases_risk",
        evidence: "Total schedule delay of 75 months beyond primary sanction."
      },
      {
        feature: "Progress vs Expected Gap",
        impact: "HIGH IMPACT",
        shapValue: 0.37,
        direction: "increases_risk",
        evidence: "Underground section tunneling gap of -22.9% points."
      },
      {
        feature: "Progress Rate",
        impact: "MEDIUM IMPACT",
        shapValue: 0.18,
        direction: "increases_risk",
        evidence: "TBM drive advancement below monthly baseline requirements."
      }
    ],
    evidence: {
      reportingMonth: "October 2025",
      sourceReport: "PAIMANA Monthly Infrastructure Review",
      sourcePage: "Vol. 2, Table 19, Page 112",
      verifiableFacts: [
        { label: "Tunnel Boring Machine (TBM) Drives", value: "19 of 24 tunnel drives holed through" },
        { label: "Underground Stations Civil", value: "71% average structural completion" },
        { label: "Track & Traction Work", value: "Commenced on elevated sections (Reach 6 South)" }
      ]
    },
    suggestedReviews: [
      {
        id: "SR-318920-01",
        triggerSignal: "Underground tunneling progress pace lagging",
        suggestedActionType: "Schedule Review",
        rationale: "Review breakthrough schedule for TBMs operating in dense Cantonment stretch."
      }
    ],
    trendDirection: "Increasing",
    riskHistory: [
      { month: "May 2025", score: 68, level: "Medium" },
      { month: "Jun 2025", score: 70, level: "High" },
      { month: "Jul 2025", score: 72, level: "High" },
      { month: "Aug 2025", score: 74, level: "High" },
      { month: "Sep 2025", score: 75, level: "High" },
      { month: "Oct 2025", score: 76, level: "High" }
    ],
    keyWarningSignal: "Progress Below Expected"
  },
  {
    id: "820144",
    name: "AIIMS Mega Tertiary Healthcare Campus - Awantipora",
    ministry: "Ministry of Health and Family Welfare",
    sector: "Healthcare Infrastructure",
    implementingAgency: "CPWD / HSCC",
    state: "Jammu & Kashmir",
    district: "Pulwama",
    status: "Delayed",
    sanctionDate: "Dec 2018",
    cost: {
      originalApprovedCost: 1828.0,
      revisedCost: 2350.0,
      costOverrunPercent: 28.6,
      cumulativeExpenditure: 1120.0,
      costRevisionCount: 1
    },
    progress: {
      physicalProgress: 48.0,
      expectedProgress: 82.0,
      progressGap: -34.0,
      progressRate: 0.35,
      progressStall: true
    },
    schedule: {
      plannedCompletion: "Jan 2023",
      revisedCompletion: "Dec 2026",
      timeOverrun: 47,
      deadlineRevision: 2
    },
    riskScore: 89,
    riskLevel: "Critical",
    highRiskProbability: 91.5,
    costEscalationRisk: 77.0,
    deadlineSlipRisk: 93.0,
    shapDrivers: [
      {
        feature: "Progress Stall",
        impact: "HIGH IMPACT",
        shapValue: 0.43,
        direction: "increases_risk",
        evidence: "Severe winter stoppage coupled with slow contractor mobilization."
      },
      {
        feature: "Progress vs Expected Gap",
        impact: "HIGH IMPACT",
        shapValue: 0.39,
        direction: "increases_risk",
        evidence: "Hospital block superstructure at 48% vs expected 82%."
      },
      {
        feature: "Time Overrun",
        impact: "HIGH IMPACT",
        shapValue: 0.31,
        direction: "increases_risk",
        evidence: "47 months schedule slip past targeted inauguration."
      }
    ],
    evidence: {
      reportingMonth: "October 2025",
      sourceReport: "PAIMANA Monthly Infrastructure Review",
      sourcePage: "Vol. 6, Table 7, Page 61",
      verifiableFacts: [
        { label: "Main Hospital Block", value: "RCC frame complete up to 4th slab of 7" },
        { label: "Hostel & Residential Blocks", value: "Civil masonry 52% completed" },
        { label: "Substation & Medical Gas Pipeline", value: "Tendering pending final approval" }
      ]
    },
    suggestedReviews: [
      {
        id: "SR-820144-01",
        triggerSignal: "Progress Stall and winter execution vulnerability",
        suggestedActionType: "Physical Progress Verification",
        rationale: "Inspect pre-winter concrete shuttering and on-site labor muster rolls."
      },
      {
        id: "SR-820144-02",
        triggerSignal: "Multi-utility service dependency",
        suggestedActionType: "Constraint Review",
        rationale: "Assess delay in 33kV dedicated electrical line clearance."
      }
    ],
    trendDirection: "Increasing",
    riskHistory: [
      { month: "May 2025", score: 79, level: "High" },
      { month: "Jun 2025", score: 81, level: "Critical" },
      { month: "Jul 2025", score: 84, level: "Critical" },
      { month: "Aug 2025", score: 86, level: "Critical" },
      { month: "Sep 2025", score: 87, level: "Critical" },
      { month: "Oct 2025", score: 89, level: "Critical" }
    ],
    keyWarningSignal: "Progress Stall"
  },
  {
    id: "504112",
    name: "Talcher Ultra-Supercritical Fertilizer & Coal Gasification Complex",
    ministry: "Ministry of Chemicals and Fertilizers",
    sector: "Fertilizers & Chemicals",
    implementingAgency: "Talcher Fertilizers Ltd (TFL - JV of GAIL, CIL, RCF, FCIL)",
    state: "Odisha",
    district: "Angul",
    status: "Delayed",
    sanctionDate: "Sep 2019",
    cost: {
      originalApprovedCost: 11611.0,
      revisedCost: 13277.0,
      costOverrunPercent: 14.3,
      cumulativeExpenditure: 9840.0,
      costRevisionCount: 1
    },
    progress: {
      physicalProgress: 61.2,
      expectedProgress: 94.0,
      progressGap: -32.8,
      progressRate: 0.54,
      progressStall: false
    },
    schedule: {
      plannedCompletion: "Sep 2023",
      revisedCompletion: "Dec 2025",
      timeOverrun: 27,
      deadlineRevision: 2
    },
    riskScore: 86,
    riskLevel: "Critical",
    highRiskProbability: 88.0,
    costEscalationRisk: 75.0,
    deadlineSlipRisk: 89.5,
    shapDrivers: [
      {
        feature: "Progress vs Expected Gap",
        impact: "HIGH IMPACT",
        shapValue: 0.44,
        direction: "increases_risk",
        evidence: "Coal gasification unit execution gap at -32.8% points below sanctioned milestones."
      },
      {
        feature: "Time Overrun",
        impact: "HIGH IMPACT",
        shapValue: 0.35,
        direction: "increases_risk",
        evidence: "Schedule delayed by 27 months from initial commissioning target."
      },
      {
        feature: "Cost Overrun Ratio",
        impact: "MEDIUM IMPACT",
        shapValue: 0.16,
        direction: "increases_risk",
        evidence: "14.3% capital cost overrun on gasification island engineering changes."
      }
    ],
    evidence: {
      reportingMonth: "October 2025",
      sourceReport: "PAIMANA Monthly Infrastructure Review",
      sourcePage: "Vol. 5, Table 9, Page 178",
      verifiableFacts: [
        { label: "Gasification Island Erection", value: "Gasifier shell lifting 82% completed" },
        { label: "Ammonia / Urea Synthesis Loop", value: "Structural steel 67% fabricated" },
        { label: "Water & Captive Power Plant", value: "Boiler hydro-test successfully conducted" }
      ]
    },
    suggestedReviews: [
      {
        id: "SR-504112-01",
        triggerSignal: "Execution gap > 30% points",
        suggestedActionType: "Ground Verification Audit",
        rationale: "Audit EPC contractor vendor package deliveries for high-pressure cryogenic piping."
      }
    ],
    trendDirection: "Increasing",
    riskHistory: [
      { month: "May 2025", score: 78, level: "High" },
      { month: "Jun 2025", score: 80, level: "Critical" },
      { month: "Jul 2025", score: 82, level: "Critical" },
      { month: "Aug 2025", score: 84, level: "Critical" },
      { month: "Sep 2025", score: 85, level: "Critical" },
      { month: "Oct 2025", score: 86, level: "Critical" }
    ],
    keyWarningSignal: "Progress Below Expected"
  },
  {
    id: "210945",
    name: "Vizhinjam International Deepwater Multipurpose Seaport (Phase-1)",
    ministry: "Ministry of Ports, Shipping and Waterways",
    sector: "Ports & Waterways",
    implementingAgency: "Vizhinjam International Seaport Ltd (VISL / Adani Ports)",
    state: "Kerala",
    district: "Thiruvananthapuram",
    status: "Ongoing",
    sanctionDate: "Dec 2015",
    cost: {
      originalApprovedCost: 5552.0,
      revisedCost: 7700.0,
      costOverrunPercent: 38.7,
      cumulativeExpenditure: 6850.0,
      costRevisionCount: 2
    },
    progress: {
      physicalProgress: 89.2,
      expectedProgress: 98.0,
      progressGap: -8.8,
      progressRate: 1.40,
      progressStall: false
    },
    schedule: {
      plannedCompletion: "Dec 2019",
      revisedCompletion: "Dec 2025",
      timeOverrun: 72,
      deadlineRevision: 4
    },
    riskScore: 64,
    riskLevel: "High",
    highRiskProbability: 66.0,
    costEscalationRisk: 62.0,
    deadlineSlipRisk: 68.0,
    shapDrivers: [
      {
        feature: "Time Overrun",
        impact: "HIGH IMPACT",
        shapValue: 0.40,
        direction: "increases_risk",
        evidence: "72 months elapsed beyond original concession milestone."
      },
      {
        feature: "Cost Overrun Ratio",
        impact: "MEDIUM IMPACT",
        shapValue: 0.28,
        direction: "increases_risk",
        evidence: "38.7% cost revision due to breakwater tetrapod armour additions and dredging scope."
      },
      {
        feature: "Progress Rate",
        impact: "LOW IMPACT",
        shapValue: -0.19,
        direction: "decreases_risk",
        evidence: "Container berth and STS crane installations running at solid operational pace."
      }
    ],
    evidence: {
      reportingMonth: "October 2025",
      sourceReport: "PAIMANA Monthly Infrastructure Review",
      sourcePage: "Vol. 3, Table 11, Page 119",
      verifiableFacts: [
        { label: "Breakwater Construction", value: "2,960 meters completed of 3,100 meters" },
        { label: "Berth Structure", value: "800m container berth completed; trial berthing done" },
        { label: "Rail Connectivity Link", value: "Underground rail tunnel excavation 42% complete" }
      ]
    },
    suggestedReviews: [
      {
        id: "SR-210945-01",
        triggerSignal: "Rail connectivity evacuation tunnel lagging",
        suggestedActionType: "Constraint Review",
        rationale: "Review alignment clearances with Southern Railway for port connectivity freight line."
      }
    ],
    trendDirection: "Stable",
    riskHistory: [
      { month: "May 2025", score: 66, level: "High" },
      { month: "Jun 2025", score: 65, level: "High" },
      { month: "Jul 2025", score: 65, level: "High" },
      { month: "Aug 2025", score: 64, level: "High" },
      { month: "Sep 2025", score: 64, level: "High" },
      { month: "Oct 2025", score: 64, level: "High" }
    ],
    keyWarningSignal: "Time Overrun"
  },
  {
    id: "412890",
    name: "Chennai Metro Rail Project Phase-II (Corridor 4 - Lighthouse to Poonamallee Bypass)",
    ministry: "Ministry of Housing and Urban Affairs",
    sector: "Urban Transit",
    implementingAgency: "Chennai Metro Rail Ltd (CMRL)",
    state: "Tamil Nadu",
    district: "Chennai & Tiruvallur",
    status: "Ongoing",
    sanctionDate: "Aug 2019",
    cost: {
      originalApprovedCost: 61843.0,
      revisedCost: 63246.0,
      costOverrunPercent: 2.3,
      cumulativeExpenditure: 32100.0,
      costRevisionCount: 0
    },
    progress: {
      physicalProgress: 56.4,
      expectedProgress: 68.0,
      progressGap: -11.6,
      progressRate: 1.15,
      progressStall: false
    },
    schedule: {
      plannedCompletion: "Jun 2026",
      revisedCompletion: "Dec 2026",
      timeOverrun: 6,
      deadlineRevision: 1
    },
    riskScore: 62,
    riskLevel: "High",
    highRiskProbability: 61.2,
    costEscalationRisk: 42.0,
    deadlineSlipRisk: 67.5,
    shapDrivers: [
      {
        feature: "Progress vs Expected Gap",
        impact: "MEDIUM IMPACT",
        shapValue: 0.31,
        direction: "increases_risk",
        evidence: "Underground TBM boring in Corridor 4 lagging planned milestone by -11.6% points."
      },
      {
        feature: "Time Overrun",
        impact: "LOW IMPACT",
        shapValue: 0.15,
        direction: "increases_risk",
        evidence: "6 months preliminary slip on elevated depot package."
      },
      {
        feature: "Cost Overrun Ratio",
        impact: "LOW IMPACT",
        shapValue: -0.22,
        direction: "decreases_risk",
        evidence: "Capital outlay disciplined within 2.3% variance against approved sanction."
      }
    ],
    evidence: {
      reportingMonth: "October 2025",
      sourceReport: "PAIMANA Monthly Infrastructure Review",
      sourcePage: "Vol. 2, Table 21, Page 130",
      verifiableFacts: [
        { label: "Corridor 4 Viaduct Erection", value: "18.4 km completed of 26.1 km" },
        { label: "Underground Stations Civil", value: "Diaphragm wall 91% complete across 10 stations" },
        { label: "Poonamallee Depot", value: "Track laying and stabling yard 64% complete" }
      ]
    },
    suggestedReviews: [
      {
        id: "SR-412890-01",
        triggerSignal: "Underground station interface coordination",
        suggestedActionType: "Schedule Review",
        rationale: "Assess electrical and signalling contract award alignment for elevated stretch."
      }
    ],
    trendDirection: "Increasing",
    riskHistory: [
      { month: "May 2025", score: 54, level: "Medium" },
      { month: "Jun 2025", score: 56, level: "Medium" },
      { month: "Jul 2025", score: 58, level: "Medium" },
      { month: "Aug 2025", score: 60, level: "High" },
      { month: "Sep 2025", score: 61, level: "High" },
      { month: "Oct 2025", score: 62, level: "High" }
    ],
    keyWarningSignal: "Progress Below Expected"
  },
  {
    id: "109283",
    name: "Sela Strategic Road & Bi-Lane Tunnel Infrastructure",
    ministry: "Ministry of Road Transport and Highways",
    sector: "Roads and Highways",
    implementingAgency: "Border Roads Organisation (BRO)",
    state: "Arunachal Pradesh & Assam",
    district: "West Kameng & Tawang",
    status: "Completed",
    sanctionDate: "Mar 2019",
    cost: {
      originalApprovedCost: 687.0,
      revisedCost: 712.0,
      costOverrunPercent: 3.6,
      cumulativeExpenditure: 708.0,
      costRevisionCount: 1
    },
    progress: {
      physicalProgress: 100.0,
      expectedProgress: 100.0,
      progressGap: 0.0,
      progressRate: 0.0,
      progressStall: false
    },
    schedule: {
      plannedCompletion: "Feb 2022",
      revisedCompletion: "Mar 2024",
      timeOverrun: 25,
      deadlineRevision: 2
    },
    riskScore: 24,
    riskLevel: "Low",
    highRiskProbability: 8.5,
    costEscalationRisk: 10.0,
    deadlineSlipRisk: 5.0,
    shapDrivers: [
      {
        feature: "Progress vs Expected Gap",
        impact: "LOW IMPACT",
        shapValue: -0.45,
        direction: "decreases_risk",
        evidence: "Project fully commissioned and operational; zero active physical execution deficit."
      },
      {
        feature: "Cost Overrun Ratio",
        impact: "LOW IMPACT",
        shapValue: -0.32,
        direction: "decreases_risk",
        evidence: "Minimal cost escalation within 3.6% baseline variance."
      }
    ],
    evidence: {
      reportingMonth: "October 2025",
      sourceReport: "PAIMANA Monthly Infrastructure Review",
      sourcePage: "Vol. 1, Table 2, Page 18",
      verifiableFacts: [
        { label: "Tunnel 1 & Tunnel 2", value: "100% Civil and electromechanical commissioning complete" },
        { label: "Approach Roads & Snow Galleries", value: "Fully operational all-weather connectivity" },
        { label: "Statutory Defect Liability", value: "BRO maintenance protocol active" }
      ]
    },
    suggestedReviews: [],
    trendDirection: "Stable",
    riskHistory: [
      { month: "May 2025", score: 25, level: "Low" },
      { month: "Jun 2025", score: 25, level: "Low" },
      { month: "Jul 2025", score: 24, level: "Low" },
      { month: "Aug 2025", score: 24, level: "Low" },
      { month: "Sep 2025", score: 24, level: "Low" },
      { month: "Oct 2025", score: 24, level: "Low" }
    ],
    keyWarningSignal: "Time Overrun"
  }
];

export const INITIAL_ACTIONS: ActionItem[] = [
  {
    id: "ACT-2025-081",
    projectId: "615186",
    projectName: "Eastern Dedicated Freight Corridor (Sonnagar - Dankuni)",
    actionType: "Physical Progress Verification",
    assignedOfficer: "Rajeshwar Singh (Director - Projects, MoSPI)",
    assignedOfficerRole: "Monitoring Officer",
    dueDate: "2025-11-15",
    status: "Open",
    remarks: "Joint field verification of sub-grade compaction and bridge piers between Dankuni and Bardhaman.",
    createdDate: "2025-10-18"
  },
  {
    id: "ACT-2025-078",
    projectId: "400010",
    projectName: "Delhi-Amritsar-Katra Expressway (Pkg 1 to 4)",
    actionType: "Schedule Review",
    assignedOfficer: "S. K. Verma (Joint Secretary, MoRTH)",
    assignedOfficerRole: "Administrator",
    dueDate: "2025-11-05",
    status: "In Progress",
    remarks: "Convened inter-agency session with Haryana PWD for RoW removal on Rohtak bypass.",
    createdDate: "2025-10-12"
  },
  {
    id: "ACT-2025-072",
    projectId: "820144",
    projectName: "AIIMS Mega Tertiary Healthcare Campus - Awantipora",
    actionType: "Constraint Review",
    assignedOfficer: "Pooja Malhotra (Deputy Secretary, Health)",
    assignedOfficerRole: "Monitoring Officer",
    dueDate: "2025-10-25",
    status: "Overdue",
    remarks: "Urgent coordination with UT Power Development Department for 33kV substation feeder line.",
    createdDate: "2025-10-02"
  },
  {
    id: "ACT-2025-069",
    projectId: "510924",
    projectName: "Barmer Petroleum Refinery and Petrochemical Complex",
    actionType: "Cost Review",
    assignedOfficer: "V. Ramaswamy (Adviser - Finance, MoPNG)",
    assignedOfficerRole: "Administrator",
    dueDate: "2025-10-15",
    status: "Completed",
    remarks: "Audit of procurement cost escalation claims completed. Final report submitted to Standing Committee.",
    createdDate: "2025-09-24",
    completedDate: "2025-10-14"
  },
  {
    id: "ACT-2025-064",
    projectId: "615191",
    projectName: "Udhampur-Srinagar-Baramulla Rail Link (Katra-Banihal)",
    actionType: "Schedule Review",
    assignedOfficer: "Anil K. Mishra (Executive Director, Railway Board)",
    assignedOfficerRole: "Administrator",
    dueDate: "2025-09-30",
    status: "Completed",
    remarks: "Tunnel T-1 safety review finalized; CRS trial run parameters confirmed.",
    createdDate: "2025-09-10",
    completedDate: "2025-09-28"
  },
  {
    id: "ACT-2025-085",
    projectId: "504112",
    projectName: "Talcher Ultra-Supercritical Fertilizer & Coal Gasification Complex",
    actionType: "Ground Verification Audit",
    assignedOfficer: "Sunita Rao (Joint Secretary, Fertilizers)",
    assignedOfficerRole: "Administrator",
    dueDate: "2025-11-20",
    status: "Open",
    remarks: "Audit vendor deliveries for high-pressure cryogenic gasification piping and steam boilers.",
    createdDate: "2025-10-21"
  },
  {
    id: "ACT-2025-083",
    projectId: "318920",
    projectName: "Bengaluru Metro Rail Project Phase-2 (Reach 6)",
    actionType: "Schedule Review",
    assignedOfficer: "Deepak Chawla (Director - Rail Transit, MoHUA)",
    assignedOfficerRole: "Administrator",
    dueDate: "2025-11-10",
    status: "In Progress",
    remarks: "Evaluate revised breakthrough milestones for TBMs operating in Cantonment station stretch.",
    createdDate: "2025-10-15"
  },
  {
    id: "ACT-2025-075",
    projectId: "412890",
    projectName: "Chennai Metro Rail Project Phase-II (Corridor 4)",
    actionType: "Constraint Review",
    assignedOfficer: "K. R. Narayanan (Chief Engineer, CMRL)",
    assignedOfficerRole: "Monitoring Officer",
    dueDate: "2025-11-18",
    status: "Open",
    remarks: "Coordinate elevated viaduct power line shifting with Tamil Nadu Transmission Corp.",
    createdDate: "2025-10-14"
  },
  {
    id: "ACT-2025-071",
    projectId: "611602",
    projectName: "Navi Mumbai International Airport (Phase-1)",
    actionType: "Critical Constraint Remediation",
    assignedOfficer: "A. K. Sen (Advisor - Infrastructure, MoCA)",
    assignedOfficerRole: "Administrator",
    dueDate: "2025-10-22",
    status: "Overdue",
    remarks: "Expedite DGCA instrument landing system (ILS) flight calibration schedule before commercial operations.",
    createdDate: "2025-09-28"
  }
];

export const INITIAL_RISK_SIGNALS: CurrentRiskSignal[] = [
  {
    id: "SIG-01",
    projectId: "615186",
    projectName: "Eastern Dedicated Freight Corridor (Sonnagar - Dankuni)",
    ministry: "Ministry of Railways",
    signalType: "Progress Stall",
    severity: "Critical",
    summary: "Progress rate stalled below 0.30%/month for 4 consecutive monitoring cycles.",
    timestamp: "2025-10-20"
  },
  {
    id: "SIG-02",
    projectId: "820144",
    projectName: "AIIMS Mega Tertiary Healthcare Campus - Awantipora",
    ministry: "Ministry of Health and Family Welfare",
    signalType: "Progress Stall",
    severity: "Critical",
    summary: "Pre-winter progress velocity dropped to 0.35%/month; -34% gap vs planned.",
    timestamp: "2025-10-19"
  },
  {
    id: "SIG-03",
    projectId: "400010",
    projectName: "Delhi-Amritsar-Katra Expressway (Pkg 1 to 4)",
    ministry: "Ministry of Road Transport and Highways",
    signalType: "Progress Below Expected",
    severity: "Critical",
    summary: "Cumulative progress gap widened to -26.8% points with 32 months schedule slippage.",
    timestamp: "2025-10-18"
  },
  {
    id: "SIG-04",
    projectId: "510924",
    projectName: "Barmer Petroleum Refinery and Petrochemical Complex",
    ministry: "Ministry of Petroleum and Natural Gas",
    signalType: "Cost Overrun",
    severity: "Critical",
    summary: "Reported cost variation exceeds +69.1% (₹29,808 Cr addition over initial approval).",
    timestamp: "2025-10-16"
  },
  {
    id: "SIG-05",
    projectId: "318920",
    projectName: "Bengaluru Metro Rail Project Phase-2 (Reach 6)",
    ministry: "Ministry of Housing and Urban Affairs",
    signalType: "Progress Below Expected",
    severity: "High",
    summary: "Underground package progress gap at -22.9% points; cumulative time overrun 75 months.",
    timestamp: "2025-10-14"
  }
];

export const INITIAL_ALERTS: OperationalAlert[] = [
  {
    id: "ALT-101",
    projectId: "615186",
    projectName: "Eastern Dedicated Freight Corridor (Sonnagar - Dankuni)",
    alertType: "Critical Risk",
    severity: "Critical",
    whatHappened: "SANKET Risk Score escalated to 92/100 following severe progress stall signal.",
    whyCare: "Crossed critical risk threshold; high probability of further multi-year delay unless ground intervention is carried out.",
    timestamp: "2 days ago"
  },
  {
    id: "ALT-102",
    projectId: "820144",
    projectName: "AIIMS Mega Tertiary Healthcare Campus - Awantipora",
    alertType: "Progress Risk Signal",
    severity: "Critical",
    whatHappened: "Progress stall flag triggered; execution rate dropped to 0.35%/month.",
    whyCare: "Upcoming winter cessation window will aggravate delay if civil foundation work is not verified immediately.",
    timestamp: "3 days ago"
  },
  {
    id: "ALT-103",
    projectId: "400010",
    projectName: "Delhi-Amritsar-Katra Expressway (Pkg 1 to 4)",
    alertType: "Risk Increased",
    severity: "Critical",
    whatHappened: "Risk score increased from 82 to 84; 26.8% gap against approved target milestone.",
    whyCare: "Inter-state connectivity corridor experiencing prolonged right-of-way and structure delays.",
    timestamp: "4 days ago"
  },
  {
    id: "ALT-104",
    projectId: "510924",
    projectName: "Barmer Petroleum Refinery and Petrochemical Complex",
    alertType: "Cost Risk Signal",
    severity: "Critical",
    whatHappened: "Cost escalation index reached 86.0% probability with 69.1% total cost overrun.",
    whyCare: "High capital exposure project with multi-agency standing committee oversight requirements.",
    timestamp: "5 days ago"
  },
  {
    id: "ALT-105",
    projectId: "318920",
    projectName: "Bengaluru Metro Rail Project Phase-2 (Reach 6)",
    alertType: "Deadline Risk Signal",
    severity: "High",
    whatHappened: "TBM drive delays project scheduled completion past September 2026.",
    whyCare: "Direct impact on public urban mobility timeline in central corridor.",
    timestamp: "6 days ago"
  },
  {
    id: "ALT-106",
    projectId: "504112",
    projectName: "Talcher Ultra-Supercritical Fertilizer & Coal Gasification Complex",
    alertType: "New High Risk",
    severity: "Critical",
    whatHappened: "Gasifier island piping delivery deficit escalated risk score from 78 to 86/100.",
    whyCare: "Crucial domestic coal gasification mandate facing acute milestone slippage.",
    timestamp: "1 day ago"
  },
  {
    id: "ALT-107",
    projectId: "611602",
    projectName: "Navi Mumbai International Airport (Phase-1)",
    alertType: "Deadline Risk Signal",
    severity: "High",
    whatHappened: "Instrument Landing System (ILS) calibration deferred past targeted commercial opening.",
    whyCare: "Commercial operation date dependent on mandatory DGCA aeronautical clearance.",
    timestamp: "3 days ago"
  }
];
