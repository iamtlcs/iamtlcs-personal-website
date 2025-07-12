"use client";

import { ErrorBoundary } from 'react-error-boundary';
import { ReactNode } from 'react';

interface HydrationErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorFallbackProps {
  resetErrorBoundary: () => void;
}

function HydrationErrorFallback({ resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <p className="text-gray-300 mb-6">
          There was an error loading the page. This might be due to browser extensions.
        </p>
        <button
          onClick={resetErrorBoundary}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export default function HydrationErrorBoundary({ children }: HydrationErrorBoundaryProps) {
  return (
    <ErrorBoundary FallbackComponent={HydrationErrorFallback}>
      {children}
    </ErrorBoundary>
  );
}
