import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { EditorialHeader } from '../../components/common/EditorialHeader';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { currentUser, logout, reportingPeriod } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <EditorialHeader
        eyebrow="Identity & Authority Management"
        title="Officer Credential Dossier"
        subtitle="Active user credentials, jurisdiction authorization, and statutory audit accreditation."
        badge="OFFICIAL USE ONLY"
      />

      <div className="bg-white border border-gov-border rounded-xs divide-y divide-gov-border">
        {/* Profile Card Summary */}
        <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-16 h-16 rounded-xs bg-paper-subtle border border-gov-border flex items-center justify-center text-ink font-serif text-2xl font-bold shrink-0">
            {currentUser.name.charAt(0)}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-serif font-bold text-ink">
                {currentUser.name}
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-xs bg-gov-tealSoft text-gov-tealDeep border border-gov-teal font-semibold">
                ROLE: {currentUser.role.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-ink-muted">{currentUser.designation}</p>
            <p className="text-xs text-ink-subtle">{currentUser.department}</p>
          </div>
        </div>

        {/* Credentials Breakdown */}
        <div className="p-6 space-y-3 text-xs">
          <div className="section-eyebrow text-ink-subtle mb-2">
            Statutory Clearance Attributes
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-paper-subtle border border-gov-border rounded-xs">
              <span className="text-ink-muted text-[11px] block mb-0.5">Clearance Identifier</span>
              <span className="font-mono font-bold text-ink text-sm">{currentUser.badgeNumber}</span>
            </div>
            <div className="p-3 bg-paper-subtle border border-gov-border rounded-xs">
              <span className="text-ink-muted text-[11px] block mb-0.5">Authority Tier</span>
              <span className="font-semibold text-ink text-sm">{currentUser.authorityLevel}</span>
            </div>
            <div className="p-3 bg-paper-subtle border border-gov-border rounded-xs">
              <span className="text-ink-muted text-[11px] block mb-0.5">Monitoring Cycle Coverage</span>
              <span className="font-mono text-ink text-sm">{reportingPeriod}</span>
            </div>
            <div className="p-3 bg-paper-subtle border border-gov-border rounded-xs">
              <span className="text-ink-muted text-[11px] block mb-0.5">Statutory Standard</span>
              <span className="font-mono text-ink text-sm">PAIMANA / OCMS Level 3</span>
            </div>
          </div>
        </div>

        {/* Session Management */}
        <div className="p-6 flex items-center justify-between bg-paper-subtle/50">
          <div className="text-xs text-ink-muted">
            Authenticated session for Smart India Hackathon 2026 platform verification.
          </div>

          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 px-4 py-2 bg-ink hover:bg-ink-light text-white text-xs font-medium rounded-xs transition-colors shadow-subtle"
          >
            <LogOut className="w-3.5 h-3.5 text-amber-400" />
            <span>Terminate Active Session</span>
          </button>
        </div>
      </div>
    </div>
  );
};
