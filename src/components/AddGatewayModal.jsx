import { useState } from "react";
import axios from "axios";

export default function AddGatewayModal({ onClose, onAdded }) {
    const [puertaEnlace, setPuertaEnlace] = useState("");
    const [loading, setLoading] = useState(false);

    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

    const generarRedCidr = (ip) => {
        return `${ip.split('.').slice(0, 3).join('.')}.0/24`;
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!puertaEnlace) {
            alert("Debe ingresar la puerta de enlace")
            return
        }

        const redCidr = generarRedCidr(puertaEnlace)

        setLoading(true);
        try {
            await axios.post(`${apiUrl}/api/generateip`, { puertaEnlace, redCidr }, { withCredentials: true });
            onAdded();
            onClose();
        } catch (error) {
            console.error("Error al agregar puerta de enlace", error);
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="modal-overlay">
            <div className="modal-content p-4 bg-white rounded shadow w-50">
                <h5>Agregar puerta de enlace</h5>

                <form onSubmit={handleSubmit}>
                    <input type="text"
                        className="form-control mb-3"
                        placeholder="Ej: 192.168.1.1"
                        value={puertaEnlace}
                        onChange={(e) => setPuertaEnlace(e.target.value)} />

                    <div className="d-flex justify-content-end">
                        <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? "Guardando..." : "Agregar"}
                        </button>
                    </div>
                </form>
                {puertaEnlace && (
                    <div className="text-muted mt-2">
                        Red generada: <code>{generarRedCidr(puertaEnlace)}</code>
                    </div>
                )}
            </div>
        </div>
    )
}