import ListGateways from "../components/ListGateways";
import AddGatewayModal from "../components/AddGatewayModal";
import { useState } from "react";

export default function IpPage() {
  const [ showModal, setShowModal ] = useState(false)
  const [ reload, setReload ] = useState(false)

  return (
    <div className="">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Puertas de Enlace</h3>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Agregar Puerta de Enlace
        </button>
      </div>

      <ListGateways reload={reload} />

      {showModal && (
        <AddGatewayModal
          onClose={() => setShowModal(false)}
          onAdded={() => {
            setReload(reload); // fuerza recarga de la lista
          }}
        />
      )}
    </div>
  );
}