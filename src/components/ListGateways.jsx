import axios from "axios";
import { useState } from "react";
import SeeIcon from "../components/icons/SeeIcon"
import ListIps from "./ListIps";
import TrashIcon from "./icons/TrashIcon";

export default function ListGateways({ gateways, loading, onRefresh }) {
    const [selectedGateway, setSelectedGateway] = useState(null);

    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

    const handleDeleteGateway = async (puertaEnlace) => {
        if (!confirm(`¿Seguro que querés eliminar todas las IPs con puerta de enlace ${puertaEnlace}?`)) return;
      
        try {
          await axios.delete(`${apiUrl}/api/removegateways`, {
            data: { puertaEnlace },
            withCredentials: true,
          });
          onRefresh(); // Actualiza la lista
        } catch (error) {
          console.error("Error al eliminar la puerta de enlace:", error);
          alert("No se pudo eliminar la puerta de enlace");
        }
      };


    return (
        <div className="container mt-4">

            {loading ? (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status" />
                </div>
            ) : (
                <>
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                            <thead className="table-dark">
                                <tr>
                                    <th>Puerta de enlace</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {gateways.length > 0 ? (
                                    gateways.map((gateway) => (
                                        <tr key={gateway}>
                                            <td>{gateway}</td>
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => setSelectedGateway(gateway)}
                                                    >
                                                        <SeeIcon />
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleDeleteGateway(gateway)}
                                                    >
                                                        <TrashIcon/>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="2" className="text-center">
                                            No hay IPs registradas
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {selectedGateway && (
                        <ListIps
                            puertaEnlace={selectedGateway}
                            onClose={() => setSelectedGateway(null)}
                        />
                    )}
                </>
            )}
        </div>
    );
}
