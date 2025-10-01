import { useEffect, useState } from "react";
import axios from "axios";

import ConfirmModal from "./ConfirmModal"; // Importá tu modal de confirmación

import IpsFilters from "./IpFilters";
import IpsSummary from "./IpSummary";
import IpPagination from "./IpPagination";

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
import ClockIcon from "./icons/ClockIcon";
import ScanMacIcon from "./icons/ScanMacIcon";
import ScanIcon from "./icons/ScanIcon";


export default function ListIps({ puertaEnlace, onClose }) {
  const [ips, setIps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [selectedIpData, setSelectedIpData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [ipToEdit, setIpToEdit] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [feedback, setFeedback] = useState(null);
  
  const [ipsFree, setIpsFree] = useState([]);
  const [busyIps, setBuysIps] = useState([]);
  const [ipsWithConflicts, setIpsWithConflicts] = useState([]);
  
  const [scanResults, setScanResults] = useState(null);
  const [filters, setFilters] = useState({
    estado: "",
    equipo: ""
  })

  // Estado para el modal de confirmación
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [ipIdToDelete, setIpIdToDelete] = useState(null);

  const limit = 20;

  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

  const fetchIps = async () => {
    setLoading(true);
    try {
      const params = {
        puertaEnlace,
        page,
        limit,
        ...filters
      }
      const res = await axios.get(`${apiUrl}/api/ips/filtradas`, {
        params,
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

  const fetchCounters = async () => {
    try {
      const [freeRes, busyRes, conflictRes] = await Promise.all([
        axios.get(`${apiUrl}/api/lengthips`, { params: { puertaEnlace, estado: "libre" }, withCredentials: true }),
        axios.get(`${apiUrl}/api/lengthips`, { params: { puertaEnlace, estado: "ocupada" }, withCredentials: true }),
        axios.get(`${apiUrl}/api/lengthips`, { params: { puertaEnlace, estado: "conflicto" }, withCredentials: true }),
      ]);
      setIpsFree(freeRes.data);
      setBuysIps(busyRes.data);
      setIpsWithConflicts(conflictRes.data);
    } catch (error) {
      console.error("Error en contadores de IPs", error);
    }
  };

  const compareMac = async (ipId) => {
    try {
      const res = await axios.get(`${apiUrl}/api/compare/${ipId}`, {
        withCredentials: true,
      });

      const message = res.data?.mensaje;

      const itIsConflict = message.toLowerCase().includes("conflictiva");
      const isBusy = message.toLowerCase().includes(
        "MAC asignada automáticamente desde escaneo."
      );
      const noHost = message.toLowerCase().includes("Host no activo");

      setFeedback({
        mensaje: message,
        tipo: itIsConflict ? "conflicto" : isBusy ? "ocupada" : noHost ? "libre" : "info",
      });

      fetchIps();
    } catch (error) {
      setFeedback({
        mensaje: "Error al escanear IP",
        tipo: "error",
      });
    }
  };

  useEffect(() => {
    fetchIps();
    fetchCounters()
  }, [puertaEnlace, page, filters]); // <-- se actualiza cuando cambia la página


  const handleDelete = async (ipId) => {
    try {
      await axios.delete(`${apiUrl}/api/ips/${ipId}`, {
        withCredentials: true,
      });
      setIps((prevIps) => prevIps.filter((ip) => ip._id !== ipId));
    } catch (error) {
      console.error("Error al eliminar la IP:", error);
      alert("Ocurrió un error al intentar eliminar la IP.");
    }
  };

  // Cuando el usuario hace click en eliminar, abrimos el modal y guardamos el id
  const handleRequestDelete = (ipId) => {
    setIpIdToDelete(ipId);
    setShowConfirmModal(true);
  };

  // Confirmar eliminar
  const confirmDelete = () => {
    if (ipIdToDelete) {
      handleDelete(ipIdToDelete);
    }
    setShowConfirmModal(false);
    setIpIdToDelete(null);
  };

  // Cancelar eliminar
  const cancelDelete = () => {
    setShowConfirmModal(false);
    setIpIdToDelete(null);
  };

  const handleViewIp = async (ipId) => {
    setModalLoading(true);
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
  };

  const handleScanIp = async (ipId) => {
    setScanning(true);
    try {
      const res = await axios.get(`${apiUrl}/api/scan/ips/${ipId}`, {
        withCredentials: true,
      });
      setScanResults(res.data);
      console.log(res.data);
    } catch (error) {
      console.error("Error al escanear la ip: ", error);
      setScanResults({
        message: "Error al escanear",
        direccion: "desconocida",
        activa: false,
        resultado: error.message,
      });
    } finally {
      setScanning(false);
    }
  };

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
      <button
        onClick={onClose}
        className="btn btn-sm btn-outline-danger position-absolute start-0 top-0 mx-4 mt-2"
      >
        <CloseIcon />
      </button>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : ips.length > 0 ? (
        <>
          <IpsSummary free={ipsFree.length} 
            busy={busyIps.length} 
            conflict={ipsWithConflicts.length} 
            puertaEnlace={puertaEnlace} />

        <IpPagination page={page} totalPages={totalPages} setPage={setPage} />

          

          <IpsFilters filters={filters} setFilters={setFilters} />
          
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
                      className={`badge ${
                        ip.estado === "ocupada"
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
                  <td>
                    {ip.equipo === "computadora" ? (
                      <CpuIcon />
                    ) : ip.equipo === "impresora" ? (
                      <PrinterIcon />
                    ) : ip.equipo === "router" ? (
                      <RouterIcon />
                    ) : ip.equipo === "servidor" ? (
                      <ServerIcon />
                    ) : ip.equipo === "reloj" ? (
                      <ClockIcon/>
                    ) : (
                      <QuestionIcon />
                    )}
                  </td>

                  <td>{new Date(ip.updatedAt).toLocaleString()}</td>
                  <td className="justify-content-end d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleViewIp(ip._id)}
                    >
                      <SeeIcon />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-warning"
                      onClick={() => setIpToEdit(ip)}
                      onUpdated={() => {
                        setIpToEdit(null);
                        fetchIps();
                      }}
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
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleRequestDelete(ip._id)} 
                    >
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
                fetchCounters()
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
              className={`alert mt-3 ${
                feedback.tipo === "conflicto"
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

          <IpPagination page={page} totalPages={totalPages} setPage={setPage} />
        </>
      ) : (
        <>
          <div class="alert alert-info text-center my-4" role="alert">
            <strong>¡Atención!</strong> No hay IPs registradas para esta puerta de enlace.
          </div>
        </>
      )}

      {showConfirmModal && (
        <ConfirmModal
          message="¿Estás seguro de que querés eliminar esta IP?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}
