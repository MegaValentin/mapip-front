import { useEffect, useState } from "react";
import axios from "axios";
import CloseIcon from "./icons/CloseIcon";
import TrashIcon from "./icons/TrashIcon";
import SeeIcon from "./icons/SeeIcon";
import EditIcon from "./icons/EditIcon";
import IpDatailsModal from "./IpDatailModal";

export default function ListIps({ puertaEnlace, onClose }) {
  const [ips, setIps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedIpData, setSelectedIpData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false)
  const limit = 10;

  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

  useEffect(() => {
    const fetchIps = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${apiUrl}/api/ips/filtradas`, {
          params: { puertaEnlace, page, limit },
          withCredentials: true,
        });

        setIps(res.data.data);
        setTotalPages(res.data.totalPages);
      } catch (error) {
        console.error("Error al obtener las IPs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIps();
  }, [puertaEnlace, page, apiUrl]); // <-- se actualiza cuando cambia la página

  const handleDelete = async (ipId) => {
    const confirmDelete = window.confirm("¿Estás seguro de que querés eliminar esta IP?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${apiUrl}/api/ips/${ipId}`, {
        withCredentials: true,
      });
      // Actualizar lista después de eliminar
      setIps((prevIps) => prevIps.filter((ip) => ip._id !== ipId));
    } catch (error) {
      console.error("Error al eliminar la IP:", error);
      alert("Ocurrió un error al intentar eliminar la IP.");
    }
  };

  const handleViewIp = async (ipId) => {
    setModalLoading(true)

    try {
      const res = await axios.get(`${apiUrl}/api/ip/${ipId}`, {
        withCredentials: true,
      });
      setSelectedIpData(res.data);
    } catch (error) {
      console.error("Error al cargar detalles de la IP:", error);
      alert("Ocurrió un error al cargar los detalles.");
    } finally {
      setModalLoading(false);
    }
  }

  return (
    <div className="modal-content position-relative p-4 bg-white rounded shadow">
      <button onClick={onClose} className="btn btn-sm btn-outline-danger position-absolute start-0 top-0 mx-4 mt-2">
        <CloseIcon />
      </button>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : ips.length > 0 ? (
        <>
          <table className="table table-striped mt-4">
            <thead>
              <tr>
                <th>Direccion Ip</th>
                <th>Estado</th>
                <th>Hostname</th>
                <th>MAC</th>
                <th>Area</th>
                <th></th>
                <th>Ultima modificacion</th>
              </tr>
            </thead>
            <tbody>
              {ips.map((ip) => (
                <tr key={ip._id}>
                  <td>{ip.direccion}</td>
                  <td>
                    <span
                      className={`badge ${ip.estado === "ocupada"
                        ? "bg-success"
                        : ip.estado === "libre"
                          ? "color-estado-libre"
                          : "bg-warning text-dark"
                        }`}
                    >
                      {ip.estado}
                    </span>
                  </td>
                  <td>{ip.hostname || "Sin hostname"}</td>
                  <td>{ip.mac || "MAC no asignada"}</td>
                  <td>{ip.area || "Sin área"}</td>
                  <td className="d-flex gap-2">

                    <button className="btn btn-sm btn-outline-primary" onClick={() => handleViewIp(ip._id)}>
                      <SeeIcon />
                    </button>
                    <button className="btn btn-sm btn-outline-warning">
                      <EditIcon />
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(ip._id)}>
                      <TrashIcon />
                    </button>

                  </td>
                  <td>{new Date(ip.updatedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {selectedIpData && !modalLoading && (
            <IpDatailsModal ip={selectedIpData} onClose={() => setSelectedIpData(null)} />
          )}

          {modalLoading && (
            <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content text-center p-4">
                  <div className="spinner-border text-primary" role="status" />
                  <p className="mt-3">Cargando detalles...</p>
                </div>
              </div>
            </div>
          )}

          {/* Paginación simple */}
          <nav>
            <ul className="pagination justify-content-center">
              <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  aria-label="Anterior"
                >
                  <span aria-hidden="true">&laquo;</span>
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
                  aria-label="Siguiente"
                >
                  <span aria-hidden="true">&raquo;</span>
                </button>
              </li>
            </ul>
          </nav>

        </>
      ) : (
        <p>No hay IPs registradas para esta puerta de enlace.</p>
      )}
    </div>
  );
}
