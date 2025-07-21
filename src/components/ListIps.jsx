import { useEffect, useState } from "react";
import axios from "axios";

import IpDatailsModal from "./IpDatailModal";
import IpEditModal from "./IpEditModal";
import IpScanModal from "./IpScanModal";

import CloseIcon from "./icons/CloseIcon";
import TrashIcon from "./icons/TrashIcon";
import SeeIcon from "./icons/SeeIcon";
import EditIcon from "./icons/EditIcon";
import RouterIcon from "./icons/RouterIcon";
import PrinterIcon from "./icons/PrinterIcon";
import CpuIcon from "./icons/CpuIcon";
import ServerIcon from "./icons/ServerIcon";
import QuestionIcon from "./icons/QuestionIcon";
import ScanMacIcon from "./icons/ScanMacIcon";
import ScanIcon from "./icons/ScanIcon";

import { CheckCircle, AlertTriangle, Cpu } from "lucide-react";

export default function ListIps({ puertaEnlace, onClose, }) {
  const [ips, setIps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedIpData, setSelectedIpData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false)
  const [ipToEdit, setIpToEdit] = useState(null);
  const [ipsFree, setIpsFree] = useState([])
  const [busyIps, setBuysIps] = useState([])
  const [ipsWithConflicts, setIpsWithConflicts] = useState([])
  const [scanResults, setScanResults] = useState(null)
  const [scanning, setScanning] = useState(false)
  const [feedback, setFeedback] = useState(null);

  const limit = 20;

  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

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

  const fetchFreeIps = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/lengthips`, {
        params: {
          puertaEnlace,
          estado: "libre",
        },
        withCredentials: true
      })
      setIpsFree(res.data)
    } catch (error) {
      console.error("Error al obtener IPs libres", error)
    }
  }
  const fetchbusyIps = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/lengthips`, {
        params: {
          puertaEnlace,
          estado: "ocupada",
        },
        withCredentials: true
      })
      setBuysIps(res.data)
    } catch (error) {
      console.error("Error al obtener IPs libres", error)
    }
  }
  const fetchIpsWithConflicts = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/lengthips`, {
        params: {
          puertaEnlace,
          estado: "conflicto",
        },
        withCredentials: true
      })
      setIpsWithConflicts(res.data)
    } catch (error) {
      console.error("Error al obtener IPs libres", error)
    }
  }

  const compareMac = async (ipId) => {
    try {
      const res = await axios.get(`${apiUrl}/api/compare/${ipId}`, {
        withCredentials: true
      })

      const message = res.data?.mensaje

      const itIsConflict = message.toLowerCase().includes("conflictiva")
      const isBusy = message.toLowerCase().includes("MAC asignada automáticamente desde escaneo.")
      const noHost = message.toLowerCase().includes("Host no activo")

      setFeedback({
        mensaje: message,
        tipo: itIsConflict ? "conflicto" : isBusy ? "ocupada" : noHost ? "libre" : "info"
      })

      fetchIps()

    } catch (error) {
      setFeedback({
        mensaje: "Error al escanear IP",
        tipo: "error"
      });
    }
  }

  useEffect(() => {

    fetchIps();
    fetchFreeIps()
    fetchbusyIps(),
      fetchIpsWithConflicts()
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

  const handleScanIp = async (ipId) => {
    setScanning(true)
    try {
      const res = await axios.get(`${apiUrl}/api/scan/ips/${ipId}`, {
        withCredentials: true
      })

      setScanResults(res.data)
      console.log(res.data)
    } catch (error) {
      console.error("Error al escanear la ip: ", error)
      setScanResults({
        message: "Error al escanear",
        direccion: "desconocidad",
        activa: false,
        resultado: error.message
      })
    } finally {
      setScanning(false)
    }
  }

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => {
        setFeedback(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);


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
          <div className="row mt-4">

            {[
              {
                title: "Ips Libre",
                count: ipsFree.length,
                border: "success",
                text: "success",
                icon: <CheckCircle className="text-success mb-2" size={24} />
              },
              {
                title: "Ips Ocupadas",
                count: busyIps.length,
                border: "primary",
                text: "primary",
                icon: <Cpu className="text-primary mb-2" size={24} />,
              },
              {
                title: "Ips con Conflicto",
                count: ipsWithConflicts.length,
                border: "warning",
                text: "warning",
                icon: <AlertTriangle className="text-warning mb-2" size={24} />,
              }
            ].map((info, index) => (
              <div className="col-md-4" key={index}>
                <div className={`card border-${info.border} shadow text-center`}>
                  <div className="card-body">
                    {info.icon}
                    <h5 className={`card-title text-${info.text}`}>{info.title}</h5>
                    <p className="card-text fs-4">{info.count}</p>
                    <small className="text-muted">en {puertaEnlace}</small>
                  </div>
                </div>
              </div>
            ))}

          </div>
          <nav className="mt-3">
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
          <table className="table table-striped mt-4">
            <thead>
              <tr>
                <th>Direccion Ip</th>
                <th>Estado</th>
                <th>Hostname</th>
                <th>MAC</th>
                <th>Area</th>
                <th>Equipo</th>
                <th>Ultima modificacion</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {ips.map((ip) => (
                <tr key={ip._id}>
                  <td>{ip.direccion}</td>
                  <td>
                    <span
                      className={`badge ${ip.estado === "ocupada"
                        ? "bg-primary"
                        : ip.estado === "libre"
                          ? "bg-success"
                          : "bg-warning text-dark"
                        }`}
                    >
                      {ip.estado}
                    </span>
                  </td>
                  <td>{ip.hostname || "Sin hostname"}</td>
                  <td>{ip.mac || "MAC no asignada"}</td>
                  <td>{ip.area?.area || "Sin área"}</td>
                  <td> {ip.equipo === "computadora" ? <CpuIcon />
                    : ip.equipo === "impresora" ? <PrinterIcon />
                      : ip.equipo === "router" ? <RouterIcon />
                        : ip.equipo === "servidor" ? <ServerIcon />
                          : <QuestionIcon />}</td>

                  <td>{new Date(ip.updatedAt).toLocaleString()}</td>
                  <td className="d-flex gap-2">

                    <button className="btn btn-sm btn-outline-primary" onClick={() => handleViewIp(ip._id)}>
                      <SeeIcon />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-warning"
                      onClick={() => setIpToEdit(ip)}
                      onUpdated={() => {
                        setIpToEdit(null)
                        fetchIps()
                      }
                      }
                    >
                      <EditIcon />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-info"
                      onClick={() => handleScanIp(ip._id)}
                    >
                      <ScanIcon />
                    </button>
                    <button
                      onClick={() => compareMac(ip._id)}
                      className="btn btn-sm btn-outline-info"
                    >
                      <ScanMacIcon />
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(ip._id)}>
                      <TrashIcon />
                    </button>

                  </td>

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

          {ipToEdit && (
            <IpEditModal
              ip={ipToEdit}
              onClose={() => setIpToEdit(null)}
              onUpdated={() => {
                setIpToEdit(null);
                fetchIps();
                fetchFreeIps();
                fetchbusyIps();
                fetchIpsWithConflicts();
              }}
            />
          )}

          <IpScanModal
            result={scanResults}
            loading={scanning}
            onClose={() => setScanResults(null)}
          />

          {feedback && (
            <div
              className={`alert mt-3 ${feedback.tipo === "conflicto"
                ? "alert-warning"
                : feedback.tipo === "ocupada"
                  ? "alert-success"
                  : feedback.tipo === "error"
                    ? "alert-danger"
                    : "alert-secondary"
                }`}
              role="alert"
            >
              {feedback.mensaje}
            </div>
          )}

          <nav className="mt-3">
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
