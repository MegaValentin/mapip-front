// components/IpListModal.jsx
import CloseIcon from "./icons/CloseIcon";

export default function IpListModal({ office, data, onClose }) {
  return (
    <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content p-4">
          <button className="btn btn-sm btn-outline-danger position-absolute end-0 top-0 m-3" onClick={onClose}>
            <CloseIcon />
          </button>
          <h5 className="mb-3 text-primary">
            IPs ocupadas del área: <strong>{office.area}</strong> ({data.cantidad})
          </h5>
          <ul className="list-group">
            {data.ips.map((ip) => (
              <li key={ip._id} className="list-group-item">
                <strong>{ip.direccion}</strong> - {ip.hostname || "sin hostname"} ({ip.equipo || "sin equipo"})
                <br />
                <small className="text-muted">MAC: {ip.mac || "N/A"}</small>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
