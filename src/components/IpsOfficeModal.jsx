import CloseIcon from "./icons/CloseIcon"

export default function IpsOfficeModal({ office, data, onClose, scanResults, scanning }) {
    return (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content p-4">
                    <button className="btn btn-sm btn-outline-danger position-absolute end-0 top-0 m-3" onClick={onClose}>
                        <CloseIcon/>
                    </button>

                    <h5 className="mb-3">
                        Área: { office.area}
                    </h5>

                    {
                        scanning ? (
                            <div className="text-center my-4">
                                <div className="spinner-border text-primary" role="status"/>
                                <p>Escaneando las ips, por favor espere ...</p>
                            </div>
                        ) : scanResults ? (
                            <>
                            <h6 className="mt-3">Resultado del escaneo:</h6>
                            <ul className="list-group mt-2">
                              {scanResults.map((ip, idx) => (
                                <li
                                  key={idx}
                                  className={`list-group-item d-flex justify-content-between align-items-center ${
                                    ip.activa ? "list-group-item-success" : "list-group-item-secondary"
                                  }`}
                                >
                                  {ip.direccion}
                                  <span>{ip.activa ? "✅ Activa" : "❌ Inactiva"}</span>
                                </li>
                              ))}
                            </ul>
                          </>
                        ) : (
                            <>
                            <h6 className="mt-3">Ips asignadas: </h6>
                            <ul className="list-group">
                                {data.map((ip, idx) => (
                                    <li key={idx} className="list-group-item">
                                        {ip.direccion} - {ip.estado}
                                    </li>
                                ))}
                            </ul>
                            </>
                        )
                    }
                </div>

            </div>

        </div>
    )
}