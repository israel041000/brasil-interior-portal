import React, { Component, ErrorInfo, ReactNode, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in App:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-100 dark:bg-stone-900 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-800 p-6 rounded-xl shadow-lg max-w-md w-full text-center space-y-4 border border-stone-200 dark:border-stone-700">
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">Brasil & Interior</h2>
            <p className="text-sm text-stone-600 dark:text-stone-300">
              Ocorreu um problema temporário ao carregar o portal.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
