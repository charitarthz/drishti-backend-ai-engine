import React from 'react';

export const InstitutionalFooter: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gov-border mt-20 py-8 text-xs text-ink-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-paper-subtle pb-4">
          <div className="space-y-1">
            <div className="font-serif font-semibold text-ink text-sm">
              SANKET-AI • Integrated Project Monitoring & Risk Prediction
            </div>
            <p className="text-[11px] text-ink-subtle">
              Smart India Hackathon 2026 • Problem Statement SIH26103 • Theme: Smart Automation
            </p>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono text-ink-subtle">
            <span>Framework: PAIMANA / OCMS</span>
            <span>•</span>
            <span>Architecture: Explainable AI / SHAP</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-ink-faint">
          <div>
            Prototype Demonstration Environment. Monitored capital projects and risk attributions are representative models for decision support.
          </div>
          <div className="font-mono text-[10px]">
            Review Cycle: October 2025
          </div>
        </div>
      </div>
    </footer>
  );
};
