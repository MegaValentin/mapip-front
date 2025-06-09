import { useEffect, useState } from "react";
import axios from "axios";


export default function ListIps() {
    const [ ips, setIps ] = useState([])
    const [ loading, setLoading ] = useState(true)

    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

    useEffect(() => {
        const fetchIps = async () => {
            try {
              const res = await axios.get(`${apiUrl}/api/ips`, 
              {withCredentials: true, })
              setIps(res.data)
            } catch (error) {
              console.error("Error al obtener las IPs", error)
            }finally{
              setLoading(false)
            }
        }

        fetchIps()
    }, [])

    return (
    
    <>
       
        <div className="container mt-4">
          <h3>Listado de Ips</h3>

          { loading ? (
            <div className="text-center">
              <div className="spinner-border text-primery" role="status"/>   
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
                      <th>accion</th>
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
                    <td> Hostname</td>
                    <td>{ip.mac || "MAC no asignada"}</td>
                    <td> area</td>
                    <td>{new Date(ip.updatedAt).toLocaleString()}</td>
                    <td>botones</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No hay IPs registradas
                  </td>
                </tr>
              )}
                  </tbody>
                </table>
            </div>
          )}
          {/* Podés seguir agregando contenido acá */}
        </div>
      </>
    );
  }