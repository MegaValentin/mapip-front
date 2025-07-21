import CloseIcon from "./icons/CloseIcon";
import { registerKeyDown } from "../utils/keyDown.js";
import { useEffect } from "react";
export default function IpDatailsModal({ ip, onClose }) {
  useEffect(() => {
    const cleanup = registerKeyDown(onClose);
    return cleanup;
  }, [onClose]);

    return (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="modal-title">DETALLE DE IP</h5>
                        <button className="btn btn-sm btn-outline-danger " onClick={onClose}>
                            <CloseIcon />
                        </button>
                    </div>
                    <ul className="list-group">
                        <li className="list-group-item"><strong>Dirección IP:</strong> {ip.direccion}</li>
                        <li className="list-group-item"><strong>Mascara Subred:</strong> {ip.marcaraSubRed}</li>
                        <li className="list-group-item"><strong>Puerta de Enlace:</strong> {ip.puertaEnlace}</li>
                        <li className="list-group-item"><strong>Estado:</strong> {ip.estado}</li>
                        <li className="list-group-item"><strong>Hostname:</strong> {ip.hostname || "Sin hostname"}</li>
                        <li className="list-group-item"><strong>MAC:</strong> {ip.mac || "Sin MAC"}</li>
                        <li className="list-group-item"><strong>Área:</strong> {ip.area || "Sin área"}</li>
                        <li className="list-group-item"><strong>Equipo:</strong> {ip.area || "Sin data"}</li>
                        <li className="list-group-item"><strong>Observaciones:</strong> {ip.observaciones || "Sin Observacion"}</li>
                        
                        <li className="list-group-item"><strong>Última modificación:</strong> {new Date(ip.updatedAt).toLocaleString()}</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}