import React, { createContext, useContext, useState } from 'react';
import type { UserRole } from '../types/project';

export interface UserProfile {
  name: string;
  designation: string;
  department: string;
  role: UserRole;
  badgeNumber: string;
  authorityLevel: string;
}

const DEMO_OFFICERS: Record<UserRole, UserProfile> = {
  POLICYMAKER: {
    name: "Dr. Arvind Subramanian, IAS",
    designation: "Principal Advisor (Infrastructure Intelligence)",
    department: "Cabinet Secretariat / NITI Aayog Infrastructure Cell",
    role: "POLICYMAKER",
    badgeNumber: "GOI-CS-98102",
    authorityLevel: "National Strategic Overview"
  },
  ADMINISTRATOR: {
    name: "Sunita Narayanan, IRSE",
    designation: "Director General (Project Implementation)",
    department: "Ministry of Statistics & Programme Implementation (MoSPI)",
    role: "ADMINISTRATOR",
    badgeNumber: "GOI-MS-44190",
    authorityLevel: "Central Portfolio Administration"
  },
  MONITORING_OFFICER: {
    name: "Rajeev K. Sinha",
    designation: "Senior Project Monitoring Officer (OCMS)",
    department: "Infrastructure Monitoring Division, MoSPI",
    role: "MONITORING_OFFICER",
    badgeNumber: "GOI-PM-11204",
    authorityLevel: "Field Monitoring & Inspection"
  }
};

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: UserProfile;
  activeRole: UserRole;
  loginAs: (role: UserRole) => void;
  logout: () => void;
  setRole: (role: UserRole) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  reportingPeriod: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [activeRole, setActiveRole] = useState<UserRole>('MONITORING_OFFICER');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  const reportingPeriod = "October 2025";
  const currentUser = DEMO_OFFICERS[activeRole];

  const loginAs = (role: UserRole) => {
    setActiveRole(role);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const setRole = (role: UserRole) => {
    setActiveRole(role);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      currentUser,
      activeRole,
      loginAs,
      logout,
      setRole,
      isSearchOpen,
      setIsSearchOpen,
      reportingPeriod
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
