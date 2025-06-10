import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="alert alert-danger text-center m-5 p-4 rounded">
          <h1>¡Uy! Algo salió mal.</h1>
          <p>Estamos trabajando para solucionarlo. Por favor, intenta recargar la página.</p>
          <button 
            className="btn btn-danger mt-3"
            onClick={() => window.location.reload()}
          >
            Recargar página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
