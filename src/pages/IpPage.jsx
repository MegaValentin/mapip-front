import { useEffect, useState } from "react";
import ListGateways from "../components/ListGateways";
import AddGatewayModal from "../components/AddGatewayModal";
import axios from "axios";

export default function IpPage() {
    const [gateways, setGateways] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

    const fetchGateways = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${apiUrl}/api/gateways`, {
                withCredentials: true
            });
            setGateways(res.data.gateways);
        } catch (err) {
            console.error("Error al obtener gateways", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGateways();
    }, []);
      
    return (
        <div className="p-4">
            <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => setShowModal(true)}
            >
                Agregar puerta de enlace
            </button>

            <ListGateways
                gateways={gateways}
                loading={loading}
                onRefresh={fetchGateways}
            />

            {showModal && (
                <AddGatewayModal
                    onClose={() => setShowModal(false)}
                    onAdded={fetchGateways} // 🔄 Actualiza la lista
                />
            )}
        </div>
    );
}
