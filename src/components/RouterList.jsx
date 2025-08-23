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
      } catch (error) {
        console.log("Error en el servidor" , error)
        setError("Error al cargar los routers");
      } finally {
        setLoading(false);
      }
    };
    fetchRouters();
  }, []);

  if (loading) return <p className="text-center mt-4">Cargando routers...</p>;
  if (error) return <p className="text-danger text-center mt-4">{error}</p>;



  const renderdata = (links) =>
    links.map((link, index) => (
      <div
        key={index}
        className="col-6 mb-2">
        <strong>{link.text}</strong> <br />
        <span className="text-muted">{link.data || "—"}</span>
      </div>
    ));

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center ">
        Lista de Routers <RouterIcon />
      </h2>
      {routers.length === 0 ? (
        <p className="text-muted text-center">
          No hay routers registrados.
        </p>
      ) : (
        <div className="row">
          {routers.map((router) => {
            const dataCard = [
              { data: router.wan, text: "WAN" },
              { data: router.lan, text: "LAN" },
              { data: router.userAdmin, text: "USUARIO" },
              { data: router.passAdmin, text: "PASS ADMIN" },
              { data: router.ssid, text: "SSID" },
              { data: router.passSsid, text: "PASS SSID" },
              { data: router.area, text: "AREA" }
            ];

            return (
              <div key={router._id} className="col-md-6 col-lg-4 mb-4">
                <div className="card border-primary shadow-sm h-100">
                  <div className="card-header bg-primary text-white text-center">
                    <h5 className="mb-0">{router.nombre}</h5>
                  </div>

                  <div className="card-body">
                    <div className="row">
                      {renderdata(dataCard)}
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
                      <EditIcon />
                    </button>
                    <button className="btn btn-sm btn-outline-danger">
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
