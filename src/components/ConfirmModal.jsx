import { useEffect } from "react";

export default function ConfirmModal({ message, onConfirm, onCancel }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  return (
    <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-4 text-center">
          <p className="mb-4">{message}</p>
          <div className="d-flex justify-content-center gap-3">
            <button className="btn btn-danger" onClick={onConfirm}>
              Confirmar
            </button>
            <button className="btn btn-secondary" onClick={onCancel}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
