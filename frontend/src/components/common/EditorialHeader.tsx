import React from 'react';

interface EditorialHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  badge?: string;
  actions?: React.ReactNode;
}

export const EditorialHeader: React.FC<EditorialHeaderProps> = ({
  eyebrow,
  title,
  subtitle,
  badge,
  actions
}) => {
  return (
    <div className="border-b border-gov-border pb-5 mb-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          {eyebrow && (
            <div className="flex items-center gap-2 mb-1.5">
              <span className="section-eyebrow text-ink-subtle">
                {eyebrow}
              </span>
              {badge && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-paper-subtle text-ink-muted border border-gov-border rounded-xs">
                  {badge}
                </span>
              )}
            </div>
          )}
          <h1 className="editorial-title text-2xl lg:text-3xl text-ink">
            {title}
          </h1>
          {subtitle && (
            <p className="editorial-sub text-ink-muted max-w-3xl mt-1.5">
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <div className="shrink-0 flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
