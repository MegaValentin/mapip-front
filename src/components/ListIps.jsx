import { useEffect, useState } from "react";
import axios from "axios";

export default function ListIps() {
  const [ips, setIps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

  useEffect(() => {
    const fetchIps = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${apiUrl}/api/ips/filtradas?page=${page}&limit=15`, {
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
  }, [page]); // <-- se actualiza cuando cambia la página

  return (
    <div className="container mt-4">
      <h3>Listado de Ips</h3>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>Direccion Ip</th>
                <th>Estado</th>
                <th>Hostname</th>
                <th>MAC</th>
                <th>Area</th>
                <th>Ultima modificacion</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {ips.length > 0 ? (
                ips.map((ip) => (
                  <tr key={ip._id}>
                    <td>{ip.direccion}</td>
                    <td>
                      <span
                        className={`badge ${
                          ip.estado === "ocupada"
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
                    <td>{new Date(ip.updatedAt).toLocaleString()}</td>
                    <td>botones</td>
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
      )}

      {/* Paginado */}
      <div className="d-flex justify-content-center gap-2 mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="btn btn-secondary"
        >
          Anterior
        </button>

        <span className="align-self-center">{page} </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="btn btn-secondary"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
