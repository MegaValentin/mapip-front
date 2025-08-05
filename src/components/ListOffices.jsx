import { useEffect, useState } from "react";
import axios from "axios";
import SeeIcon from "./icons/SeeIcon";
import TrashIcon from "./icons/TrashIcon";
import ScanIcon from "./icons/ScanIcon";
import OfficeModal from "./OfficeModal";
import IpsOfficeModal from "./IpsOfficeModal";
import ConfirmModal from "./ConfirmModal"; // nuevo modal

export default function ListOffices() {
    const [offices, setOffices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedOffice, setSelectedOffice] = useState(null);
    const [selectedOfficeIps, setSelectedOfficeIps] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [scanResults, setScanResults] = useState(null);
    const [confirmDeleteOfficeId, setConfirmDeleteOfficeId] = useState(null); // nuevo estado

    const limit = 10;
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

    const fetchOffices = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${apiUrl}/api/offices/paginated`, {
                params: { page, limit },
                withCredentials: true,
            });
            setOffices(res.data.data);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.error("Error al obtener las áreas: ", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAskDeleteOffice = (officeId) => {
        setConfirmDeleteOfficeId(officeId);
    };

    const handleConfirmDeleteOffice = async () => {
        try {
            await axios.delete(`${apiUrl}/api/office/${confirmDeleteOfficeId}`, {
                withCredentials: true,
            });
            setOffices((prev) => prev.filter((office) => office._id !== confirmDeleteOfficeId));
        } catch (error) {
            console.error("Error al eliminar el área: ", error);
            alert("Ocurrió un error al intentar eliminar el área.");
        } finally {
            setConfirmDeleteOfficeId(null);
        }
    };

    const handleViewIps = async (office) => {
        try {
            const res = await axios.get(`${apiUrl}/api/ips/by-office/${office._id}`, {
                withCredentials: true,
            });
            setSelectedOffice(office);
            setSelectedOfficeIps(res.data);
            setShowModal(true);
        } catch (error) {
            console.error("Error al obtener IPs del área: ", error);
        }
    };

    const handleScanIps = async (office) => {
        setScanning(true);
        setSelectedOffice(office);
        setScanResults(null);
        setShowModal(true);

        try {
            const res = await axios.get(`${apiUrl}/api/scan/office/${office._id}`, {
                withCredentials: true
            });

            setScanResults(res.data.results);
        } catch (error) {
            console.error("Error al escanear IPs: ", error);
            alert("Error al escanear las Ips de la oficina");
        } finally {
            setScanning(false);
        }
    };

    useEffect(() => {
        fetchOffices();
    }, [page]);

    return (
        <>

            <div className="modal-content position-relative p-4 bg-white rounded shadow">


                {loading ? (
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status" />
                    </div>
                ) : offices.length > 0 ? (
                    <>
                        <table className="table table-striped mt-4 shadow">
                            <thead>
                                <tr>
                                    <th>Área</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {offices.map((office) => (
                                    <tr key={office._id}>
                                        <td>{office.area}</td>
                                        <td className="justify-content-end d-flex gap-2">
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => handleViewIps(office)}
                                            >
                                                <SeeIcon />
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={() => handleScanIps(office)}
                                            >
                                                <ScanIcon />
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleAskDeleteOffice(office._id)}
                                            >
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
                                    <button className="page-link" onClick={() => setPage(page - 1)} disabled={page === 1}>
                                        &laquo;
                                    </button>
                                </li>
                                <li className="page-item disabled">
                                    <span className="page-link">
                                        Página {page} de {totalPages}
                                    </span>
                                </li>
                                <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => setPage(page + 1)}
                                        disabled={page === totalPages}
                                    >
                                        &raquo;
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </>
                ) : (
                    <p>No hay áreas registradas</p>
                )}
            </div>

            {showModal && selectedOffice && selectedOfficeIps && (
                <OfficeModal
                    office={selectedOffice}
                    data={selectedOfficeIps}
                    onClose={() => setShowModal(false)}
                />
            )}

            {showModal && selectedOffice && (
                <IpsOfficeModal
                    office={selectedOffice}
                    data={selectedOfficeIps}
                    onClose={() => {
                        setShowModal(false);
                        setScanResults(null);
                    }}
                    scanResults={scanResults}
                    scanning={scanning}
                />
            )}

            {confirmDeleteOfficeId && (
                <ConfirmModal
                    message="¿Estás seguro de que querés eliminar esta área?"
                    onConfirm={handleConfirmDeleteOffice}
                    onCancel={() => setConfirmDeleteOfficeId(null)}
                />
            )}
        </>
    );
}
