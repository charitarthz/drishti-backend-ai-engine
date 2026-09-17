import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MOCK_PROJECTS } from '../../data/mockProjects';
import { RiskBadge } from './RiskBadge';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchTerm('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const matches = searchTerm.trim() === ''
    ? MOCK_PROJECTS.slice(0, 5)
    : MOCK_PROJECTS.filter((p) => {
        const term = searchTerm.toLowerCase();
        return (
          p.id.toLowerCase().includes(term) ||
          p.name.toLowerCase().includes(term) ||
          p.ministry.toLowerCase().includes(term) ||
          p.sector.toLowerCase().includes(term) ||
          p.state.toLowerCase().includes(term) ||
          p.implementingAgency.toLowerCase().includes(term)
        );
      });

  const handleSelect = (projectId: string) => {
    setIsSearchOpen(false);
    navigate(`/project/${projectId}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-ink/70 backdrop-blur-xs">
      <div
        className="w-full max-w-2xl bg-white border border-gov-darkBorder rounded-xs shadow-elevated overflow-hidden animate-in fade-in zoom-in-95 duration-75"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 bg-paper-subtle border-b border-gov-border">
          <Search className="w-4 h-4 text-ink-subtle mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Project ID (e.g. 615186), Title, Sector, Ministry, State..."
            className="w-full bg-transparent border-none text-ink placeholder-ink-subtle text-xs sm:text-sm focus:outline-none"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 text-ink-subtle hover:text-ink rounded-xs"
            title="Close (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto divide-y divide-paper-subtle p-2">
          {matches.length === 0 ? (
            <div className="p-8 text-center text-xs text-ink-subtle">
              No project record matching <span className="font-semibold text-ink">"{searchTerm}"</span>
            </div>
          ) : (
            matches.map((proj) => (
              <button
                key={proj.id}
                onClick={() => handleSelect(proj.id)}
                className="w-full text-left p-3 rounded-xs hover:bg-paper-subtle flex items-start justify-between gap-4 transition-colors group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-ink bg-paper-subtle px-1.5 py-0.5 border border-gov-border rounded-xs">
                      #{proj.id}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-ink group-hover:text-gov-terracotta transition-colors">
                      {proj.name}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-ink-subtle">
                    <span>{proj.ministry}</span>
                    <span>•</span>
                    <span>{proj.sector}</span>
                    <span>•</span>
                    <span>{proj.state}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 pt-1">
                  <RiskBadge level={proj.riskLevel} size="sm" />
                  <ArrowRight className="w-3.5 h-3.5 text-ink-subtle group-hover:text-ink group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-2 bg-paper-subtle border-t border-gov-border text-[11px] text-ink-subtle flex items-center justify-between font-mono">
          <span>Navigate with mouse or arrow keys</span>
          <span>ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
};
