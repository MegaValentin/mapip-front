import { useState, useEffect } from "react";
import axios from "axios";
import ListIps from "./ListIps";

export default function ListGateways() {
    const [gateways, setGateways] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedGateway, setSelectedGateway] = useState(null)


    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL

    useEffect(() => {
        const fetchGateways = async () => {
            setLoading(true)
            try {
                const res = await axios.get(`${apiUrl}/api/gateways`, {
                    withCredentials: true
                })

                setGateways(res.data.gateways)
            } catch (error) {
                console.error("Error al obtener las Puertas de enlaces", error)
            } finally {
                setLoading(false)
            }
        }

        fetchGateways()
    }, [])

    return (
        <div className="container mt-4">
            <h3>Rangos de IP</h3>
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
                                    <th> Puerta enlace</th>
                                    <th> Accion </th>
                                </tr>
                            </thead>
                            <tbody>
                                {gateways.length > 0 ? (
                                    gateways.map((gateway) => (
                                        <tr key={gateway}>
                                            <td>{gateway}</td>
                                            <td>
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => setSelectedGateway(gateway)}
                                                >
                                                    Ver IPs
                                                </button>
                                            </td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center">
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
            )
            }
        </div>
    )

}
