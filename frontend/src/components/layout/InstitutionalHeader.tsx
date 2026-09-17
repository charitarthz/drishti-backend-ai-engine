import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import type { UserRole } from '../../types/project';
import { Search, UserCheck, LogOut, Layers } from 'lucide-react';

export const InstitutionalHeader: React.FC = () => {
  const { 
    currentUser, 
    activeRole, 
    setRole, 
    setIsSearchOpen, 
    logout, 
    reportingPeriod 
  } = useAuth();
  const navigate = useNavigate();

  const handleRoleSwitch = (role: UserRole) => {
    setRole(role);
    if (role === 'POLICYMAKER') navigate('/policymaker');
    else if (role === 'ADMINISTRATOR') navigate('/administrator');
    else navigate('/monitoring/watchlist');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-ink text-white border-b border-ink-light">
      {/* 1. Top Government of India Authority Strip */}
      <div className="border-b border-white/10 px-4 sm:px-6 lg:px-8 py-2 text-xs text-ink-faint flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {/* Official Tricolor ribbon */}
          <div className="flex h-3 w-5 rounded-xs overflow-hidden shadow-xs shrink-0">
            <div className="w-1/3 bg-[#FF9933]" />
            <div className="w-1/3 bg-white" />
            <div className="w-1/3 bg-[#128807]" />
          </div>
          <span className="font-semibold text-white tracking-wider uppercase text-[11px]">
            Government of India
          </span>
          <span className="text-white/20">|</span>
          <span className="text-white/80 hidden md:inline">
            Ministry of Statistics & Programme Implementation (MoSPI)
          </span>
          <span className="text-white/20 hidden md:inline">|</span>
          <span className="text-white/60 font-mono text-[10px] hidden lg:inline">
            Problem Statement: SIH26103
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-ink-faint uppercase text-[10px]">Review Cycle:</span>
            <span className="bg-white/10 px-2 py-0.5 rounded-xs text-amber-300 font-medium">
              {reportingPeriod}
            </span>
          </div>

          <div className="h-3 w-px bg-white/20 hidden sm:block" />

          {/* Quick Search Shortcut Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-2.5 py-1 bg-white/10 hover:bg-white/15 text-white/90 rounded-xs transition-colors text-xs"
            title="Search Projects (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Find Project by ID, Sector...</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.2 text-[9px] bg-black/40 text-white/70 rounded-xs font-mono">
              Ctrl K
            </kbd>
          </button>
        </div>
      </div>

      {/* 2. Main Identity & Rapid Judge Role Switcher Strip */}
      <div className="px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* SANKET-AI Emblem & Identity */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xs bg-gov-terracotta flex items-center justify-center text-white font-serif font-bold text-lg shadow-subtle border border-amber-500/40">
            सं
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-amber-200 transition-colors">
                SANKET<span className="text-amber-400 font-light">-AI</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-white/10 text-white/80 rounded-xs">
                v2.6 Prototype
              </span>
            </div>
            <p className="text-[11px] text-ink-faint tracking-wide font-sans">
              Predict. Explain. Prioritise. Act. Track.
            </p>
          </div>
        </Link>

        {/* Rapid Role Evaluator for SIH Judges */}
        <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xs border border-white/10">
          <div className="flex items-center gap-1.5 px-2 text-[10px] font-mono text-amber-400 uppercase font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Role View:</span>
          </div>

          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => handleRoleSwitch('POLICYMAKER')}
              className={`px-3 py-1.5 rounded-xs transition-all ${
                activeRole === 'POLICYMAKER'
                  ? 'bg-gov-terracotta text-white font-medium shadow-xs'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Policymaker
            </button>
            <button
              onClick={() => handleRoleSwitch('ADMINISTRATOR')}
              className={`px-3 py-1.5 rounded-xs transition-all ${
                activeRole === 'ADMINISTRATOR'
                  ? 'bg-gov-terracotta text-white font-medium shadow-xs'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Administrator
            </button>
            <button
              onClick={() => handleRoleSwitch('MONITORING_OFFICER')}
              className={`px-3 py-1.5 rounded-xs transition-all ${
                activeRole === 'MONITORING_OFFICER'
                  ? 'bg-gov-terracotta text-white font-medium shadow-xs'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Monitoring Officer
            </button>
          </div>
        </div>

        {/* User Identity & Logout */}
        <div className="flex items-center gap-3">
          <Link
            to="/profile"
            className="flex items-center gap-2 p-1.5 rounded-xs hover:bg-white/10 transition-colors text-left"
          >
            <div className="w-7 h-7 rounded-xs bg-white/10 border border-white/20 flex items-center justify-center text-amber-400">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-medium text-white leading-tight">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-ink-faint font-mono leading-tight">
                {currentUser.role.replace('_', ' ')}
              </div>
            </div>
          </Link>

          <div className="h-5 w-px bg-white/20" />

          <button
            onClick={handleLogout}
            className="p-2 text-white/60 hover:text-rose-400 hover:bg-white/10 rounded-xs transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
