import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto my-16 p-8 text-center space-y-4">
      <h1 className="text-3xl font-serif text-slate-900">404</h1>
      <p className="text-xs text-slate-600">Page not found.</p>
      <Link
        to="/monitoring-officer"
        className="inline-block text-xs font-medium text-amber-700 hover:underline"
      >
        Return to Portal
      </Link>
    </div>
  );
};
