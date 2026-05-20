import React from 'react';
import { AlertTriangle, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="error-page-container">
          <div className="error-card">
            <AlertTriangle className="error-icon" size={64} />
            <h1>System Override Error</h1>
            <p className="error-subtitle">Something went wrong in the mainframe.</p>
            
            <div className="error-details">
              <p className="error-message">{this.state.error && this.state.error.toString()}</p>
            </div>
            
            <button 
              className="btn btn-primary"
              onClick={() => window.location.href = '/'}
            >
              <Home size={18} />
              Return to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
