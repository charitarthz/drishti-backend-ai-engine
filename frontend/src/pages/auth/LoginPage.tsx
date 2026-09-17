import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import type { UserRole } from '../../types/project';
import { Shield, Eye, EyeOff, Lock, User, ArrowRight, Layers } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { loginAs } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('officer.sanket@mospi.gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('MONITORING_OFFICER');

  const handleStandardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAs(selectedRole);
    if (selectedRole === 'POLICYMAKER') navigate('/policymaker');
    else if (selectedRole === 'ADMINISTRATOR') navigate('/administrator');
    else navigate('/monitoring/watchlist');
  };

  const handleDemoAccess = (role: UserRole) => {
    loginAs(role);
    if (role === 'POLICYMAKER') navigate('/policymaker');
    else if (role === 'ADMINISTRATOR') navigate('/administrator');
    else navigate('/monitoring/watchlist');
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col justify-between text-ink">
      {/* Top Government Strip */}
      <div className="border-b border-gov-border bg-white px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-ink-muted">
          <div className="flex items-center gap-2.5">
            <div className="flex h-3 w-5 rounded-xs overflow-hidden shadow-xs shrink-0">
              <div className="w-1/3 bg-[#FF9933]" />
              <div className="w-1/3 bg-white" />
              <div className="w-1/3 bg-[#128807]" />
            </div>
            <span className="font-semibold text-ink uppercase tracking-wider text-[11px]">
              Government of India
            </span>
            <span className="text-gov-border">|</span>
            <span className="hidden sm:inline">Ministry of Statistics & Programme Implementation</span>
          </div>

          <span className="text-[10px] font-mono bg-paper-subtle text-ink-muted px-2 py-0.5 rounded-xs border border-gov-border">
            SIH26103 • Institutional Portal
          </span>
        </div>
      </div>

      {/* Center Authentication Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <div className="w-full max-w-md bg-white border border-gov-border rounded-xs shadow-elevated p-8 space-y-6">
          {/* SANKET-AI Institutional Emblem */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xs bg-gov-terracotta text-white font-serif font-bold text-2xl shadow-subtle border border-amber-600/30">
              सं
            </div>
            <h1 className="editorial-title text-2xl text-ink font-semibold">
              SANKET<span className="text-gov-terracotta font-normal">-AI</span>
            </h1>
            <p className="editorial-sub text-ink-muted text-xs max-w-xs mx-auto">
              Explainable AI-powered Infrastructure Project Monitoring & Risk Prediction Platform
            </p>
          </div>

          {/* Authorized Use Security Notice */}
          <div className="bg-paper-subtle border border-gov-border rounded-xs p-3 text-[11px] text-ink-muted flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-gov-terracotta shrink-0 mt-0.5" />
            <span>
              <strong>Statutory Access Portal:</strong> For authorized project administrators, central policy cells, and field monitoring officers under PAIMANA / OCMS parameters.
            </span>
          </div>

          {/* Prototype Demo Evaluation Bar (Explicitly labeled for SIH Judges) */}
          <div className="border-t border-b border-gov-border py-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="section-eyebrow text-gov-terracotta font-semibold flex items-center gap-1">
                <Layers className="w-3 h-3" />
                SIH Judge Rapid Demo Access:
              </span>
              <span className="text-[10px] text-ink-subtle font-mono">1-Click</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-left">
              <button
                type="button"
                onClick={() => handleDemoAccess('POLICYMAKER')}
                className="p-2 bg-paper-subtle hover:bg-gov-tealSoft hover:border-gov-teal border border-gov-border rounded-xs transition-colors group"
              >
                <div className="text-xs font-semibold text-ink group-hover:text-gov-teal">
                  Policymaker
                </div>
                <div className="text-[10px] text-ink-subtle">
                  National Risk
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoAccess('ADMINISTRATOR')}
                className="p-2 bg-paper-subtle hover:bg-gov-tealSoft hover:border-gov-teal border border-gov-border rounded-xs transition-colors group"
              >
                <div className="text-xs font-semibold text-ink group-hover:text-gov-teal">
                  Administrator
                </div>
                <div className="text-[10px] text-ink-subtle">
                  Portfolio / Cost
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoAccess('MONITORING_OFFICER')}
                className="p-2 bg-paper-subtle hover:bg-gov-tealSoft hover:border-gov-teal border border-gov-border rounded-xs transition-colors group"
              >
                <div className="text-xs font-semibold text-ink group-hover:text-gov-teal">
                  Officer
                </div>
                <div className="text-[10px] text-ink-subtle">
                  Hero Watchlist
                </div>
              </button>
            </div>
          </div>

          {/* Standard Institutional Form */}
          <form onSubmit={handleStandardSubmit} className="space-y-4">
            <div>
              <label className="block section-eyebrow text-ink-subtle mb-1">
                Official Email / NIC ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-paper-subtle border border-gov-border rounded-xs px-3 py-2 text-xs sm:text-sm text-ink focus:outline-none focus:border-ink pl-9 font-sans"
                  required
                />
                <User className="w-4 h-4 text-ink-subtle absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block section-eyebrow text-ink-subtle">
                  Password
                </label>
                <a
                  href="#reset"
                  onClick={(e) => { e.preventDefault(); alert("Contact NIC Central Directory for institutional reset."); }}
                  className="text-[11px] text-gov-terracotta hover:underline font-mono"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-paper-subtle border border-gov-border rounded-xs px-3 py-2 text-xs sm:text-sm text-ink focus:outline-none focus:border-ink pl-9 pr-9 font-mono"
                  required
                />
                <Lock className="w-4 h-4 text-ink-subtle absolute left-2.5 top-2.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2.5 text-ink-subtle hover:text-ink"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block section-eyebrow text-ink-subtle mb-1">
                Jurisdiction Role Assignment
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full bg-paper-subtle border border-gov-border rounded-xs px-3 py-2 text-xs sm:text-sm text-ink focus:outline-none focus:border-ink font-sans"
              >
                <option value="MONITORING_OFFICER">Monitoring Officer (Priority Watchlist & Action Logging)</option>
                <option value="ADMINISTRATOR">Administrator (Portfolio Management & Overruns)</option>
                <option value="POLICYMAKER">Policymaker (National Risk & Spatial Overview)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-ink hover:bg-ink-light text-white font-medium text-xs sm:text-sm rounded-xs transition-colors flex items-center justify-center gap-2 shadow-subtle"
            >
              <span>Authenticate Session</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </form>
        </div>
      </div>

      {/* Footer Notice */}
      <div className="border-t border-gov-border py-4 text-center text-xs text-ink-subtle bg-white">
        SANKET-AI Platform • Developed for Smart India Hackathon 2026 (SIH26103)
      </div>
    </div>
  );
};
