import React from "react";
import { AlertOctagon, RotateCcw } from "lucide-react";
import Button from "./Button";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an unhandled error:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-slate-200/80 shadow-xl shadow-slate-200/50">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4 shadow-xs">
              <AlertOctagon className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Something went wrong
            </h2>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              An unexpected error occurred in the user interface. Please try reloading the page.
            </p>
            <div className="mt-6 flex justify-center">
              <Button
                variant="primary"
                icon={RotateCcw}
                onClick={this.handleReload}
              >
                Reload Application
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
