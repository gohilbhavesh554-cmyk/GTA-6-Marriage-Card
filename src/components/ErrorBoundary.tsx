import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error?.message || 'An unexpected error occurred while loading the invitation.',
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Application ErrorBoundary caught:', error, info.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0D0B18] text-[#FFF4E8] flex items-center justify-center p-6">
          <div className="max-w-md w-full border border-[#FF4E8C]/35 bg-[#161326] p-7 text-center">
            <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-[#FFD166] mb-2">
              Love in the City
            </p>
            <h1 className="font-display text-4xl tracking-[0.06em] text-[#FFF4E8] mb-3">
              Something Interrupted the View
            </h1>
            <p className="text-sm text-[#FFF4E8]/75 mb-6 leading-relaxed">
              We ran into a temporary loading issue. Please reload the invitation to continue.
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="w-full px-6 py-3 bg-[#FFF4E8] text-[#0D0B18] hover:bg-[#FFD166] text-xs font-semibold tracking-[0.2em] uppercase transition-colors cursor-pointer"
            >
              Reload Invitation
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
