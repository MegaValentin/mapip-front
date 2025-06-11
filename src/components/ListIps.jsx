import { useEffect, useState } from "react";
import axios from "axios";
import CloseIcon from "./icons/CloseIcon";

export default function ListIps({ puertaEnlace, onClose }) {
  const [ips, setIps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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

  return (
    <div className="ips-list-container mt-3 p-3 border">
      <h4>IPs para puerta de enlace: {puertaEnlace}</h4>
      <button onClick={onClose} className="btn buttonClose">
        <CloseIcon />
      </button>
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : ips.length > 0 ? (
        <>
          <table className="table table-striped">
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

                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(ip._id)}>
                      Eliminar
                    </button>
                  </td>
                  <td>{new Date(ip.updatedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginación simple */}
          <nav>
            <ul className="pagination justify-content-center">
              <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Anterior
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
                  Siguiente
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
