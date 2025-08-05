import { useEffect } from "react";
import CloseIcon from "./icons/CloseIcon";
import { registerKeyDown } from "../utils/keyDown"; // Ajustá la ruta según tu estructura

export default function IpScanModal({ result, loading, onClose }) {
  useEffect(() => {
    const cleanup = registerKeyDown(onClose);
    return cleanup;
  }, [onClose]);

  return (
    <>
      {result && !loading && (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content text-center p-4">
              <button
                className="btn btn-sm btn-outline-danger position-absolute end-0 top-0 m-3"
                onClick={onClose}
              >
                <CloseIcon />
              </button>
              <h5 className="mb-3">Resultado del escaneo</h5>
              <p>
                <strong>Dirección IP:</strong> {result.direccion}
              </p>
              <p>
                <strong>Estado:</strong>{" "}
                {result.activa ? (
                  <span className="text-success">Activa</span>
                ) : (
                  <span className="text-danger">Inactiva</span>
                )}
              </p>
              <pre className="text-muted small">{result.resultado}</pre>
            </div>
          </div>
        </div>
      )}
      {loading && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content text-center p-4">
              <div className="spinner-border text-primary" role="status" />
              <p className="mt-3">Escaneando IP...</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
