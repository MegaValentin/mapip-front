import { useEffect, useState } from "react";
import axios from "axios";
import RouterIcon from "./icons/RouterIcon";
import EditIcon from "./icons/EditIcon";
import TrashIcon from "./icons/TrashIcon";

export default function RouterList() {
  const [routers, setRouters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

  useEffect(() => {
    const fetchRouters = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/ips-router`, {
          withCredentials: true,
        });
        setRouters(res.data);
      } catch (err) {
        setError("Error al cargar los routers");
      } finally {
        setLoading(false);
      }
    };
    fetchRouters();
  }, []);

  if (loading) return <p className="text-center mt-4">Cargando routers...</p>;
  if (error) return <p className="text-danger text-center mt-4">{error}</p>;

  return (
    <div className="container py-4">
  <h2 className="mb-4 text-center ">
     Lista de Routers <RouterIcon/>
  </h2>
  {routers.length === 0 ? (
    <p className="text-muted text-center">
      No hay routers registrados.
    </p>
  ) : (
    <div className="row">
      {routers.map((router) => (
        <div key={router._id} className="col-md-6 col-lg-4 mb-4">
          <div className="card border-primary shadow-sm h-100">
            
            <div className="card-header bg-primary text-white text-center">
              <h5 className="mb-0">{router.nombre}</h5>
            </div>

           
            <div className="card-body">
              <div className="row">
                <div className="col-6 mb-2">
                  <strong>WAN:</strong> <br />
                  <span className="text-muted">{router.wan || "—"}</span>
                </div>
                <div className="col-6 mb-2">
                  <strong>LAN:</strong> <br />
                  <span className="text-muted">{router.lan || "—"}</span>
                </div>
                <div className="col-6 mb-2">
                  <strong>Usuario:</strong> <br />
                  <span className="text-muted">{router.userAdmin || "—"}</span>
                </div>
                <div className="col-6 mb-2">
                  <strong>Pass Admin:</strong> <br />
                  <span className="text-muted">{router.passAdmin || "—"}</span>
                </div>
                <div className="col-12 mb-2">
                  <strong>SSID:</strong> <br />
                  <span className="text-muted">{router.ssid || "—"}</span>
                </div>
                <div className="col-12 mb-2">
                  <strong>Pass SSID:</strong> <br />
                  <span className="text-muted">{router.passSsid || "—"}</span>
                </div>
                <div className="col-12 mb-2">
                  <strong>Área:</strong> <br />
                  <span className="badge bg-info text-dark">{router.area || "—"}</span>
                </div>
                <div className="col-12">
                  <strong>Obs:</strong> <br />
                  <span className="text-muted fst-italic">
                    {router.observaciones || "—"}
                  </span>
                </div>
              </div>
            </div>

            
            <div className="card-footer text-center">
              <button className="btn btn-sm btn-outline-warning me-2">
                <EditIcon/>
              </button>
              <button className="btn btn-sm btn-outline-danger">
                <TrashIcon/>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
  );
}
