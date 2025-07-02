import axios from "axios";
import { useEffect, useState } from "react";
import SeeIcon from "./icons/SeeIcon";
import TrashIcon from "./icons/TrashIcon";


export default function ListOffices() {
    const [offices, setOffices] = useState([])
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const limit = 10

    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

    const fetchOffices = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`${apiUrl}/api/offices/paginated`, {
                params: { page, limit },
                withCredentials: true
            })

            setOffices(res.data.data)

            setTotalPages(res.data.totalPages)
        } catch (error) {
            console.error("Error al obtener las Ips: ", error)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchOffices()
    }, [page, apiUrl])
    return (
        <div className="modal-content position-relative p-4 bg-white rounded shadow">
            {loading ? (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status" />
                </div>
            ) : offices.length > 0 ? (
                <>
                
                    <table className="table table-striped mt-4">
                        <thead>
                            <tr>
                                <th>Area</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>

                            {offices.map((office) => (
                                <tr key={office._id}>
                                    <td>{office.area}</td>
                                    <td className="d-flex gap-2">
                                        <button className="btn btn-sm btn-outline-primary">
                                            <SeeIcon />
                                        </button>
                                        <button className="btn btn-sm btn-outline-danger" >
                                            <TrashIcon />
                                        </button>
                                    </td>
                                </tr>

                            ))}
                        </tbody>
                    </table>

                    <nav>
                        <ul className="pagination justify-content-center">
                            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                                <button
                                    className="page-link"
                                    onClick={() => setPage(page - 1)}
                                    disabled={page === 1}
                                    aria-label="Anterior">
                                    <span aria-hidden="true">&laquo;</span>
                                </button>
                            </li>
                            <li className="page-item disabled">
                                <span className="page-link">
                                    Pagina {page} de {totalPages}
                                </span>
                            </li>
                            <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                                <button
                                    className="page-link"
                                    onClick={() => setPage(page + 1)}
                                    disabled={page === totalPages}
                                    aria-label="Siguiente">
                                    <span aria-label="true">&raquo;</span>
                                </button>
                            </li>
                        </ul>
                    </nav>
                </>

            ) : (
                <p> No hay areas registradas</p>
            )}

        </div>
    )
}